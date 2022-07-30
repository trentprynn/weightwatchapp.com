import { Module } from '@nestjs/common'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'

@Module({
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
