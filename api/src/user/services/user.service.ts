import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { prisma } from 'prisma/client'
import { UpdateUserRequest } from '../models/update-user-request.class'
import { User } from '../models/user.class'

@Injectable()
export class UserService {
  public async findUserByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`)
    }

    const returnUser: User = {
      userId: user.userId,
      email: user.email,
      name: user.name,
    }

    return returnUser
  }

  public async findUserById(userId: string) {
    const user = await prisma.user.findFirst({
      where: {
        userId: userId,
      },
    })

    if (!user) {
      throw new NotFoundException(`User with userId '${userId}' not found`)
    }

    const returnUser: User = {
      userId: user.userId,
      email: user.email,
      name: user.name,
    }

    return returnUser
  }

  public async createUser(email: string, password: string) {
    if (
      await prisma.user.findFirst({
        where: {
          email: email,
        },
      })
    ) {
      throw new BadRequestException(`User with email ${email} already exists`)
    }

    const createdUser = await prisma.user.create({
      data: {
        email: email,
        passwordHash: await bcrypt.hash(password, 10),
      },
    })

    const returnUser: User = {
      userId: createdUser.userId,
      email: createdUser.email,
      name: createdUser.name,
    }

    return returnUser
  }

  public async updateUser(userId: string, updatedUser: UpdateUserRequest) {
    const userWithUpdatedUserEmail = await prisma.user.findFirst({
      where: {
        email: updatedUser.email,
      },
    })

    if (userWithUpdatedUserEmail && userWithUpdatedUserEmail.userId !== userId) {
      // user trying to switch their email to an email that's already registered
      throw new BadRequestException(`User with email ${updatedUser.email} already exists`)
    }

    const modifiedUser = await prisma.user.update({
      where: {
        userId: userId,
      },
      data: {
        email: updatedUser.email,
        name: updatedUser.name,
      },
    })

    const returnUser: User = {
      userId: modifiedUser.userId,
      email: modifiedUser.email,
      name: modifiedUser.name,
    }

    return returnUser
  }

  public async deleteUser(userId: string) {
    const deletedUser = await prisma.user.delete({
      where: {
        userId: userId,
      },
    })

    const returnUser: User = {
      userId: deletedUser.userId,
      email: deletedUser.email,
      name: deletedUser.name,
    }

    return returnUser
  }
}
