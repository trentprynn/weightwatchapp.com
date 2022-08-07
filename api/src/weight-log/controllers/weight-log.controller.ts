import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'

import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type'
import { CreateWeightLogDTO } from '../dtos/create-weight-log.dto'
import { WeightActivityLogEntity } from '../entities/weight-log.entity'
import { WeightLogService } from '../services/weight-log.service'

@ApiTags('weight log')
@Controller('weight/log')
export class WeightLogController {
  constructor(private weightLogService: WeightLogService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: `Create a new weight log entry for the calling user` })
  @ApiOkResponse({
    description: 'The newly created weight log entry',
    type: WeightActivityLogEntity,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createWeightLog(@Req() req: AuthenticatedRequest, @Body() body: CreateWeightLogDTO) {
    console.log('CREATE WEIGHT LOG ENTRY')
    return this.weightLogService.createWeightLogForUser(req.user.id, body)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Get the calling user's weight log entries` })
  @ApiOkResponse({
    description: 'The weight log entries',
    type: [WeightActivityLogEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getWeightLog(@Req() req: AuthenticatedRequest) {
    console.log('GET WEIGHT LOG ENTRIES')
    return this.weightLogService.getWeightLogForUser(req.user.id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `Delete a weight log entry for the calling user` })
  @ApiOkResponse({
    description: 'The deleted weight log entry',
    type: [WeightActivityLogEntity],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(JwtAuthGuard)
  @Delete(':weightActivityLogId')
  async deleteWeightLog(@Req() req: AuthenticatedRequest, @Param('weightActivityLogId') weightActivityLogId: string) {
    console.log(`DELETE WEIGHT LOG ENTRY`)
    return this.weightLogService.deleteWeightLogForUser(req.user.id, weightActivityLogId)
  }
}
