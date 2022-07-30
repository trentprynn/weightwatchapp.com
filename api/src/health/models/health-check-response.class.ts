import { ApiProperty } from '@nestjs/swagger'

export class HealthCheckResponse {
  @ApiProperty()
  status: string

  @ApiProperty()
  serverTimeUTC: string

  constructor(status: string, serverTimeUTC: string) {
    this.status = status
    this.serverTimeUTC = serverTimeUTC
  }
}
