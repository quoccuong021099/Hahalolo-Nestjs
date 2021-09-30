import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ForbiddenExceptionC } from 'src/customException/forbidden.exception';
import { InfoService } from './info.service';
import { info } from './interfaces/info.interface';

@Controller('info')
export class InfoController {
  // sử dụng DI
  constructor(private infoService: InfoService) {}

  @Get()
  async findAll(): Promise<info[]> {
    return this.infoService.getAllInfo();
  }

  @Get('/2')
  async findAlls() {
    // throw new HttpException('badRequest', HttpStatus.BAD_REQUEST);
    // throw new HttpException(
    //   { status: HttpStatus.BAD_REQUEST, error: 'This is a custom message' },
    //   HttpStatus.BAD_REQUEST,
    // );
    throw new ForbiddenExceptionC();

  }
}
