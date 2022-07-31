import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type'
import { CreateNewUserRequest } from '../models/create-new-user-request.class'
import { UpdateUserRequest } from '../models/update-user-request.class'
import { User } from '../models/user.class'
import { UserService } from '../services/user.service'

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get the calling user's information such as email` })
  @ApiOkResponse({
    description: 'The user',
    type: User,
  })
  @UseGuards(JwtAuthGuard)
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async getUser(@Req() req: AuthenticatedRequest) {
    console.log('GET USER')
    return this.userService.findUserById(req.user.id)
  }

  @ApiOperation({ summary: `Create a new user` })
  @ApiOkResponse({
    description: 'The new user',
    type: User,
  })
  @Post()
  async createUser(@Req() req: AuthenticatedRequest, @Body() body: CreateNewUserRequest) {
    console.log('CREATE USER')
    return this.userService.createUser(body.email, body.password)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Update the calling user's information` })
  @ApiOkResponse({
    description: 'The updated user',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateUser(@Req() req: AuthenticatedRequest, @Body() body: UpdateUserRequest) {
    console.log('UPDATE USER')
    return this.userService.updateUser(req.user.id, body)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete the calling user's account` })
  @ApiOkResponse({
    description: 'The deleted user',
    type: User,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@Req() req: AuthenticatedRequest) {
    console.log('DELETE USER')
    return this.userService.deleteUser(req.user.id)
  }
}
