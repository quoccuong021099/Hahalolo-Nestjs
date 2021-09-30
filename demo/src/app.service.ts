import { Injectable } from '@nestjs/common';
import { CreateCatDto } from './create-cat.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  findOne(id: number): string {
    return `id: ${id}`;
  }
  create(createCatDto: CreateCatDto): string {
    return `createCatDto: ${JSON.stringify(createCatDto)}`;
  }
}
