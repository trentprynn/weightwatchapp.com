import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { LoginRequest } from '../models/login-request.class'
import { RefreshTokenRequest } from '../models/refresh-token-request.class'
import { AuthService } from '../services/auth.service'
import { AuthenticatedRequest } from '../types/authenticated-request.type'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Generate a new auth token using email / password' })
  @Post('login')
  async login(@Body() body: LoginRequest) {
    console.log('GENERATING NEW AUTH TOKEN')
    return this.authService.validateLoginAndGenerateAuthToken(body.email, body.password)
  }

  @ApiOperation({ summary: 'Generate a new auth token using a previously created refresh token' })
  @ApiResponse({ status: 201, description: 'New auth token' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('refresh-token')
  async refreshToken(@Body() body: RefreshTokenRequest) {
    console.log('REFRESHING TOKEN')
    return this.authService.refreshToken(body.refresh_token)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete a refresh token for the calling user` })
  @ApiResponse({ status: 200, description: 'Refresh token successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Delete('refresh-token')
  async deleteRefreshToken(@Req() req: AuthenticatedRequest, @Body() body: RefreshTokenRequest) {
    console.log(`DELETING REFRESH TOKEN`)
    return this.authService.deleteRefreshTokenForUser(req.user.id, body.refresh_token)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete all refresh tokens for the calling user` })
  @ApiResponse({ status: 200, description: 'All refresh tokens deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Delete('refresh-tokens')
  async deleteAllRefreshTokens(@Req() req: AuthenticatedRequest) {
    console.log(`DELETING ALL REFRESH TOKENS FOR USER`)
    return this.authService.deleteAllRefreshTokensForUser(req.user.id)
  }
}
