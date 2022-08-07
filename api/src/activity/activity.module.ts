import { Module } from '@nestjs/common'
import { ActivityLogController } from './controllers/activity-log.controller'
import { ActivityController } from './controllers/activity.controller'
import { ActivityLogService } from './services/activity-log.service'
import { ActivityService } from './services/activity.service'

@Module({
  providers: [ActivityService, ActivityLogService],
  exports: [ActivityService, ActivityLogService],
  controllers: [ActivityController, ActivityLogController],
})
export class ActivityModule {}
