import { ApiProperty } from '@nestjs/swagger';

export class CreateInfo {
  @ApiProperty()
  job: string;

  @ApiProperty()
  age: number;
}
