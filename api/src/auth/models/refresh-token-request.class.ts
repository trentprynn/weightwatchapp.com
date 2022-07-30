import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class RefreshTokenRequest {
  @ApiProperty()
  @IsNotEmpty()
  refresh_token: string

  constructor(refresh_token: string) {
    this.refresh_token = refresh_token
  }
}
