import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { prisma } from 'prisma/client'
import { CreateActivityDTO } from '../dtos/create-activity.dto'

@Injectable()
export class ActivityService {
  public async createActivityForUser(userId: string, createRequest: CreateActivityDTO) {
    return await prisma.activity.create({
      data: {
        name: createRequest.activityName,
        iconName: createRequest.activityIconName,
        userId: userId,
      },
    })
  }

  public async getActivitiesForUser(userId: string) {
    return await prisma.activity.findMany({
      where: {
        userId: userId,
      },
    })
  }

  public async deleteActivityForUser(userId: string, activityId: string) {
    const foundActivity = await prisma.activity.findFirst({
      where: {
        activityId: activityId,
      },
    })

    if (!foundActivity) {
      throw new NotFoundException(`Activity with id ${activityId} not found.`)
    }

    if (foundActivity.userId !== userId) {
      throw new ForbiddenException(`Activity ${activityId} does not belong to ${userId}`)
    }

    return await prisma.activity.delete({
      where: {
        activityId: activityId,
      },
    })
  }

  public async getActivityForUser(userId: string, activityId: string) {
    const foundActivity = await prisma.activity.findFirst({
      where: {
        activityId: activityId,
      },
    })

    if (!foundActivity) {
      throw new NotFoundException(`Activity with id ${activityId} not found.`)
    }

    if (foundActivity.userId !== userId) {
      throw new ForbiddenException(`Activity ${activityId} does not belong to ${userId}`)
    }

    return foundActivity
  }
}
