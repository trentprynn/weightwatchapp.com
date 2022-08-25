import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateActivityDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  activityName: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  activityIconName: string

  constructor(activityName: string, activityIconName: string) {
    this.activityName = activityName
    this.activityIconName = activityIconName
  }
}
