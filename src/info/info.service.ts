import { Injectable } from '@nestjs/common';
import { info } from './interfaces/info.interface';

@Injectable()
export class InfoService {
  private readonly info: info[] = [
    {
      age: 20,
      job: 'dev1',
    },
    {
      age: 30,
      job: 'dev2',
    },
  ];

  getAllInfo(): info[] {
    return this.info;
  }
}
