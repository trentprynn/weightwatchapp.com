import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type'
import { CreateActivityLogDTO } from '../dtos/create-activity-log.dto'
import { ActivityLogEntity } from '../entities/activity-log.entity'
import { ActivityLogService } from '../services/activity-log.service'

@ApiTags('activity log')
@Controller('activity/log')
export class ActivityLogController {
  constructor(private activityLogService: ActivityLogService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: `Create a new activity log` })
  @ApiCreatedResponse({
    description: 'The newly created activity log entry',
    type: ActivityLogEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createActivityLog(@Req() req: AuthenticatedRequest, @Body() body: CreateActivityLogDTO) {
    console.log('CREATE ACTIVITY LOG ENTRY')
    return this.activityLogService.createActivityLogForUser(req.user.id, body)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get activity logs` })
  @ApiOkResponse({
    description: 'The activity logs',
    type: [ActivityLogEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getActivityLogs(@Req() req: AuthenticatedRequest) {
    console.log('GET ACTIVITY LOGS')
    return this.activityLogService.getActivityLogsForUser(req.user.id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete an activity log` })
  @ApiOkResponse({
    description: 'The deleted activity log',
    type: ActivityLogEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':activityLogId')
  async deleteActivity(@Req() req: AuthenticatedRequest, @Param('activityLogId') activityLogId: string) {
    console.log('DELETE ACTIVITY LOG')
    return this.activityLogService.deleteActivityLogForUser(req.user.id, activityLogId)
  }
}
