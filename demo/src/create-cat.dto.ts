// export class CreateCatDto {
//   name: string;
//   age: number;
//   breed: string;
// }

import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
