import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNumber, max, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsAlphanumeric()
  @MaxLength(5)
  name: string;

  @ApiProperty()
  @IsNumber()
  age: number;
}
