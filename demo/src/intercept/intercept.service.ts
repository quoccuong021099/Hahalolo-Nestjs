import { Injectable } from '@nestjs/common';

@Injectable()
export class InterceptService {
  async getHello(): Promise<string> {
    return new Promise((res) => {
      setTimeout(() => {
        res('Hello world ');
      }, 3000);
    });
  }
}
