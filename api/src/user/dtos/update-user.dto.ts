import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class UpdateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({ type: String, nullable: true })
  name: string | null

  constructor(email: string, name: string | null) {
    this.email = email
    this.name = name
  }
}
