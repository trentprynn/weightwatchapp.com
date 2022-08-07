import { ApiProperty } from '@nestjs/swagger'
import { Activity } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'

export class ActivityEntity implements Activity {
  @ApiProperty()
  @IsNotEmpty()
  activityId: string

  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  iconName: string

  @ApiProperty()
  @IsNotEmpty()
  createdAt: Date

  @ApiProperty()
  @IsNotEmpty()
  updatedAt: Date

  @ApiProperty()
  @IsNotEmpty()
  userId: string

  constructor(activityId: string, name: string, iconName: string, createdAt: Date, updatedAt: Date, userId: string) {
    this.activityId = activityId
    this.name = name
    this.iconName = iconName
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.userId = userId
  }
}
