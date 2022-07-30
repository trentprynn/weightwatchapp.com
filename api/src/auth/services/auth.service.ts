import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { prisma } from 'prisma/client'

type JWTPayload = {
  userId: string
  email: string
}

type parsedJWTPayload = {
  userId: string
  email: string
  iat: number
  exp: number
}

type TokenReturnObject = {
  access_token: string
  expires_in: number
  refresh_token: string
  refresh_token_expires_in: number
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  public async validateLoginAndGenerateAuthToken(email: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const jwtPayload: JWTPayload = {
        userId: user.userId,
        email: user.email,
      }

      // every time a user logs in, cleanup their expired refresh tokens (this is done to avoid having to
      // do this in a cron-like action)
      await this.cleanupExpiredRefreshTokensByUserId(user.userId)

      return await this.constructTokenFromPayloadAndStoreRefreshToken(jwtPayload)
    }

    throw new UnauthorizedException('Invalid username or password')
  }

  public async refreshToken(refreshToken: string) {
    try {
      const refreshTokenData: parsedJWTPayload = await this.jwtService.verifyAsync<parsedJWTPayload>(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      })

      const userRefreshTokens = await prisma.refreshToken.findMany({
        where: {
          userId: refreshTokenData.userId,
        },
      })

      // the user gave a valid refresh token we issued, ensure it hasn't been revoked by checking that we have it
      // stored
      let userRefreshTokenHashMatch: string | undefined = undefined
      for (let i = 0; i < userRefreshTokens.length; i++) {
        if (await bcrypt.compare(refreshToken, userRefreshTokens[i].refreshTokenHash)) {
          userRefreshTokenHashMatch = userRefreshTokens[i].refreshTokenHash
        }
      }

      if (userRefreshTokenHashMatch) {
        // the refresh token the user sent is both valid and non-revoked, remove it from the store so it can't be
        // used again and use the token to generate a full new auth token object for the user
        await prisma.refreshToken.delete({
          where: {
            refreshTokenHash_userId: { userId: refreshTokenData.userId, refreshTokenHash: userRefreshTokenHashMatch },
          },
        })

        const newAuthTokenPayload: JWTPayload = {
          userId: refreshTokenData.userId,
          email: refreshTokenData.email,
        }

        // every time a user refreshes an access token, cleanup their expired refresh tokens (this is done to avoid
        // having to do this in a cron-like action)
        await this.cleanupExpiredRefreshTokensByUserId(refreshTokenData.userId)

        // create the signed JWT object we'll return to the caller that will have a new access token + refresh token
        // with updated expirations they can use
        return this.constructTokenFromPayloadAndStoreRefreshToken(newAuthTokenPayload)
      } else {
        console.log('GIVEN TOKEN VERIFIED BUT NOT FOUND IN STORE')
        throw new BadRequestException('Token cryptographically valid but not found (probably revoked)')
      }
    } catch (e: any) {
      console.log('FAILED TO VERIFY REFRESH TOKEN')
      throw new BadRequestException('Invalid refresh token given')
    }
  }

  public async deleteAllRefreshTokenForUser(userId: string) {
    return await prisma.refreshToken.deleteMany({
      where: {
        userId: userId,
      },
    })
  }

  public async deleteRefreshTokenForUser(userId: string, refreshTokenHash: string) {
    return await prisma.refreshToken.delete({
      where: {
        refreshTokenHash_userId: { userId: userId, refreshTokenHash: refreshTokenHash },
      },
    })
  }

  private async constructTokenFromPayloadAndStoreRefreshToken(jwtPayload: JWTPayload) {
    // create our signed token return object which has the access token + refresh tokens setup
    const returnObject: TokenReturnObject = {
      access_token: await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('JWT_SECRET') as string,
        expiresIn: parseInt(this.configService.get<string>('JWT_LIFE_SECONDS') as string, 10),
      }),
      expires_in: parseInt(this.configService.get<string>('JWT_LIFE_SECONDS') as string, 10),
      refresh_token: await this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET') as string,
        expiresIn: parseInt(this.configService.get<string>('REFRESH_TOKEN_LIFE_SECONDS') as string, 10),
      }),
      refresh_token_expires_in: parseInt(this.configService.get<string>('REFRESH_TOKEN_LIFE_SECONDS') as string, 10),
    }

    // add the refresh tokens to our store of refresh tokens for a specific user, we do this so we can
    // revoke refresh tokens by deleting them from the store if the user changes their password etc
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + returnObject.refresh_token_expires_in)
    await prisma.refreshToken.create({
      data: {
        refreshTokenHash: await bcrypt.hash(returnObject.refresh_token, 10),
        expiration: expiration,
        userId: jwtPayload.userId,
      },
    })

    return returnObject
  }

  private async cleanupExpiredRefreshTokensByUserId(userId: string) {
    return await prisma.refreshToken.findMany({
      where: {
        AND: {
          userId: userId,
          expiration: {
            lt: new Date(),
          },
        },
      },
    })
  }
}
