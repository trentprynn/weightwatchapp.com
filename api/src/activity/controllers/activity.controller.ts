import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type'
import { CreateActivityDTO } from '../dtos/create-activity.dto'
import { ActivityEntity } from '../entities/activity.entity'
import { ActivityService } from '../services/activity.service'

@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: `Create a new activity` })
  @ApiCreatedResponse({
    description: 'The newly created activity',
    type: ActivityEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createActivity(@Req() req: AuthenticatedRequest, @Body() body: CreateActivityDTO) {
    console.log('CREATE ACTIVITY')
    return this.activityService.createActivityForUser(req.user.id, body)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get activities` })
  @ApiOkResponse({
    description: 'The activities',
    type: [ActivityEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getActivities(@Req() req: AuthenticatedRequest) {
    console.log('GET ACTIVITIES')
    return this.activityService.getActivitiesForUser(req.user.id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete an activity` })
  @ApiOkResponse({
    description: 'The deleted activity',
    type: ActivityEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':activityId')
  async deleteActivity(@Req() req: AuthenticatedRequest, @Param('activityId') activityId: string) {
    console.log('DELETE ACTIVITY')
    return this.activityService.deleteActivityForUser(req.user.id, activityId)
  }
}
