import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Cat } from './cat.interface';
import { CatsService } from './cats.service';
import { CreateCatDto } from './create-cat.dto';
import { ValidationPipe } from './validation.pipe';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  // @Post()
  // async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
  //   console.log('controller create cat');
  //   this.catsService.create(createCatDto);
  // }
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // throw new ForbiddenException();
    return this.catsService.findAll();
  }

  @Get(':age')
  async findOne(@Param('age', ParseIntPipe) age: number) {
    return this.catsService.findOne(age);
  }
}
