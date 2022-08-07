import { Module } from '@nestjs/common'
import { WeightLogController } from './controllers/weight-log.controller'
import { WeightLogService } from './services/weight-log.service'

@Module({
  providers: [WeightLogService],
  exports: [WeightLogService],
  controllers: [WeightLogController],
})
export class WeightModule {}
