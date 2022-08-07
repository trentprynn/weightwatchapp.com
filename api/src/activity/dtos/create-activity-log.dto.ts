import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateActivityLogDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  activityId: string

  @ApiProperty()
  @IsNotEmpty()
  activityDate: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  activityLengthSeconds: number

  constructor(activityId: string, activityDate: Date, activityLengthSeconds: number) {
    this.activityId = activityId
    this.activityDate = activityDate
    this.activityLengthSeconds = activityLengthSeconds
  }
}
