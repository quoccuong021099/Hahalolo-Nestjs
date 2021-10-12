import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenExceptions extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
