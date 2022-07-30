import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class CreateNewUserRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  password: string

  constructor(email: string, password: string) {
    this.email = email
    this.password = password
  }
}
