import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class WeightLogEntry {
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
  userId: string

  constructor(weightActivityLogId: string, weight: number, createdAt: Date, userId: string) {
    this.weightActivityLogId = weightActivityLogId
    this.weight = weight
    this.createdAt = createdAt
    this.userId = userId
  }
}
