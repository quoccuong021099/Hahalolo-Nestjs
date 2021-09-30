import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor() {
    super('Đã có lỗi xảy ra', HttpStatus.FORBIDDEN);
  }
}
