import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateActivityDTO {
  @ApiProperty()
  @IsNotEmpty()
  activityName: string

  @ApiProperty()
  @IsNotEmpty()
  activityIconName: string

  constructor(activityName: string, activityIconName: string) {
    this.activityName = activityName
    this.activityIconName = activityIconName
  }
}
