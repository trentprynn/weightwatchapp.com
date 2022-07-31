import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { prisma } from 'prisma/client'
import { CreateWeightLogRequest } from '../models/create-weight-log-request.class'
import { WeightLogEntry } from '../models/weight-log.class'

@Injectable()
export class WeightLogService {
  public async createWeightLogEntry(userId: string, createRequest: CreateWeightLogRequest) {
    const createEntry = await prisma.weightActivityLog.create({
      data: {
        weight: createRequest.weight,
        userId: userId,
      },
    })

    const returnEntry: WeightLogEntry = {
      weightActivityLogId: createEntry.weightActivityLogId,
      weight: createEntry.weight,
      createdAt: createEntry.createdAt,
      userId: createEntry.userId,
    }

    return returnEntry
  }

  public async getWeightLog(userId: string) {
    const logEntries = await prisma.weightActivityLog.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return logEntries.map((l) => {
      return {
        weightActivityLogId: l.weightActivityLogId,
        weight: l.weight,
        createdAt: l.createdAt,
        userId: l.userId,
      }
    })
  }

  public async deleteWeightLog(userId: string, weightActivityLogId: string) {
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

    const deletedLogEntry = await prisma.weightActivityLog.delete({
      where: {
        weightActivityLogId: existingWeightLogEntry.weightActivityLogId,
      },
    })

    const returnEntry: WeightLogEntry = {
      weightActivityLogId: deletedLogEntry.weightActivityLogId,
      weight: deletedLogEntry.weight,
      createdAt: deletedLogEntry.createdAt,
      userId: deletedLogEntry.userId,
    }

    return returnEntry
  }
}
