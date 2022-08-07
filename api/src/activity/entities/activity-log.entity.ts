import { ApiProperty } from '@nestjs/swagger'
import { ActivityLog } from '@prisma/client'
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { ActivityEntity } from './activity.entity'

export class ActivityLogEntity implements ActivityLog {
  @ApiProperty()
  @IsNotEmpty()
  activityLogId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lengthInSeconds: number

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  activityDate: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  createdAt: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  updatedAt: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  activityId: string

  @ApiProperty()
  @IsNotEmpty()
  activity?: ActivityEntity

  constructor(
    activityLogId: string,
    activityId: string,
    lengthInSeconds: number,
    activityDate: Date,
    createdAt: Date,
    updatedAt: Date,
    userId: string,
    activity?: ActivityEntity
  ) {
    this.activityLogId = activityLogId
    this.activityId = activityId
    this.lengthInSeconds = lengthInSeconds
    this.activityDate = activityDate
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.userId = userId
    this.activity = activity
  }
}
