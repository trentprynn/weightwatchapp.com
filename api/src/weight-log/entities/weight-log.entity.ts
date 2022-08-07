import { ApiProperty } from '@nestjs/swagger'
import { WeightActivityLog } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'

export class WeightActivityLogEntity implements WeightActivityLog {
  @ApiProperty()
  @IsNotEmpty()
  weightActivityLogId: string

  @ApiProperty()
  @IsNotEmpty()
  weight: number

  @ApiProperty()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty()
  @IsNotEmpty()
  updatedAt: Date

  @ApiProperty()
  @IsNotEmpty()
  userId: string

  constructor(weightActivityLogId: string, weight: number, createdAt: Date, updatedAt: Date, userId: string) {
    this.weightActivityLogId = weightActivityLogId
    this.weight = weight
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.userId = userId
  }
}
