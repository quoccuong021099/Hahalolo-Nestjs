import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenExceptionC extends HttpException {
  constructor() {
    super('Custom Exception', HttpStatus.FORBIDDEN);
  }
}
