import { Module } from '@nestjs/common'
import { HealthController } from './controllers/health.controller'

@Module({
  providers: [],
  exports: [],
  controllers: [HealthController],
})
export class HealthModule {}
