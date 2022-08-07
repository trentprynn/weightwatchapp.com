import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from 'prisma/client'
import { CreateActivityLogDTO } from '../dtos/create-activity-log.dto'
import { ActivityLogEntity } from '../entities/activity-log.entity'
import { ActivityService } from './activity.service'

@Injectable()
export class ActivityLogService {
  constructor(private activityService: ActivityService) {}

  public async getActivityLogsForUser(userId: string) {
    return (await prisma.activityLog.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        activityDate: 'asc',
      },
      include: {
        activity: true,
      },
    })) as ActivityLogEntity[]
  }

  public async createActivityLogForUser(userId: string, createRequest: CreateActivityLogDTO) {
    const activity = await this.activityService.getActivityForUser(userId, createRequest.activityId)

    return (await prisma.activityLog.create({
      data: {
        userId: userId,
        activityId: activity.activityId,
        activityDate: createRequest.activityDate,
        lengthInSeconds: createRequest.activityLengthSeconds,
      },
      include: {
        activity: true,
      },
    })) as ActivityLogEntity
  }

  public async deleteActivityLogForUser(userId: string, activityLogId: string) {
    const foundActivityLog = await prisma.activityLog.findFirst({
      where: {
        activityLogId: activityLogId,
      },
    })

    if (!foundActivityLog) {
      throw new NotFoundException(`Activity log with id ${activityLogId} not found.`)
    }

    if (foundActivityLog.userId !== userId) {
      throw new ForbiddenException(`Activity log ${activityLogId} does not belong to ${userId}`)
    }

    return (await prisma.activityLog.delete({
      where: {
        activityLogId: activityLogId,
      },
    })) as ActivityLogEntity
  }
}
