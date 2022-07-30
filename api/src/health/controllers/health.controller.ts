import { Controller, Get } from '@nestjs/common'

import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { HealthCheckResponse } from '../models/health-check-response.class'

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: `Performs a health check for the api server` })
  @ApiOkResponse({
    description: 'The health check object.',
    type: HealthCheckResponse,
  })
  @Get()
  async getHealthCheck() {
    console.log('HEALTH CHECK')
    const healthCheck: HealthCheckResponse = {
      status: 'alive',
      serverTimeUTC: new Date().toUTCString(),
    }
    return healthCheck
  }
}
