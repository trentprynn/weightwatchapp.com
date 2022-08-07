import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { prisma } from 'prisma/client'
import { CreateWeightLogDTO } from '../dtos/create-weight-log.dto'
import { WeightActivityLogEntity } from '../entities/weight-log.entity'

@Injectable()
export class WeightLogService {
  public async createWeightLogForUser(userId: string, createRequest: CreateWeightLogDTO) {
    return (await prisma.weightActivityLog.create({
      data: {
        weight: createRequest.weight,
        userId: userId,
      },
    })) as WeightActivityLogEntity
  }

  public async getWeightLogForUser(userId: string) {
    return (await prisma.weightActivityLog.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })) as WeightActivityLogEntity[]
  }

  public async deleteWeightLogForUser(userId: string, weightActivityLogId: string) {
    const existingWeightLogEntry = await prisma.weightActivityLog.findFirst({
      where: {
        weightActivityLogId: weightActivityLogId,
      },
    })

    if (!existingWeightLogEntry) {
      throw new NotFoundException(`Weight log with id ${weightActivityLogId} not found`)
    }

    if (existingWeightLogEntry.userId !== userId) {
      throw new UnauthorizedException(`Weight log with id ${weightActivityLogId} does not belong to calling user`)
    }

    return (await prisma.weightActivityLog.delete({
      where: {
        weightActivityLogId: existingWeightLogEntry.weightActivityLogId,
      },
    })) as WeightActivityLogEntity
  }
}
