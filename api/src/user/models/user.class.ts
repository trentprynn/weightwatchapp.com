import { ApiProperty } from '@nestjs/swagger'

export class User {
  @ApiProperty()
  userId: string

  @ApiProperty()
  email: string

  @ApiProperty({ type: String, nullable: true })
  name: string | null

  constructor(userId: string, email: string, name: string | null) {
    this.userId = userId
    this.email = email
    this.name = name
  }
}
