import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateWeightLogRequest {
  @ApiProperty()
  @IsNotEmpty()
  weight: number

  constructor(weight: number) {
    this.weight = weight
  }
}
