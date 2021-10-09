import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCatDto } from './create-cat.dto';
import { ForbiddenException } from './forbidden.exception';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from './validation.pipe';

@Controller('cats')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Param(new ValidationPipe()) params): string {
    console.log('params', params);
    return 'a';
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    // ghi đè thông báo
    // throw new HttpException(
    //   {
    //     status: HttpStatus.FORBIDDEN,
    //     error: 'This is a custom message',
    //   },
    //   HttpStatus.FORBIDDEN,
    // );

    // custorm
    // throw new ForbiddenException();

    // Built-in HTTP exceptions
    // throw new BadRequestException();

    // Exception filters
    // throw new HttpExceptionFilter();

    // return this.appService.getHello();
  }

  @Get(':id')
  @UsePipes(new ValidationPipe())
  async findOne(@Param('id') id: number) {
    return this.appService.findOne(id);
  }

  // Truyền instance
  // @Get(':id')
  // async findOne(
  //   @Param(
  //     'id',
  //     new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
  //   )
  //   id: number,
  // ) {
  //   return this.appService.findOne(id);
  // }

  // custom pipe
  // @Get(':id')
  // async findOne(@Param('id', ValidationPipe) id: number) {
  //   return this.appService.findOne(id);
  // }

  // @Post()
  // @UseFilters(new HttpExceptionFilter())
  // async create(@Body() body) {
  //   console.log('AppController ~ body', body);
  //   throw new ForbiddenException();
  // }

  // @Post()
  // async create(@Body() createCatDto: CreateCatDto) {
  //   this.appService.create(createCatDto);
  // }

  // validation pipe với class-validator
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createCatDto: CreateCatDto) {
    return this.appService.create(createCatDto);
  }
}
