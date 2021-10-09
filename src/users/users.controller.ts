import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Redirect,
  Req,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { request, Request } from 'express';

import { ForbiddenExceptionC } from 'src/customException/forbidden.exception';
import { info } from 'src/info/interfaces/info.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUser } from './dto/update-user.dto';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService<info[]>) {}

  // @Get()
  // @Header('Cache-Control', 'none')
  // findAll(@Req() request: Request): string {
  //   // return 'Đây là router user ';

  //   console.log(request.headers);

  //   return `REQUEST ${request.body.name}`;
  // }

  // @Post()
  // // @HttpCode(208)
  // createNewUser(): string {
  //   return 'This action adds a new user ';
  // }

  @Get('/a*cd')
  demoWildCards(): string {
    return 'This route uses a wildcard';
  }

  @Get('/red')
  @Redirect('http://localhost:3000/info', 302)
  redirect(@Query('id') id) {
    if (id && id == 1) {
      return { url: 'http://localhost:3000/users/1' };
    }
  }

  // @Get(':id')
  // findOne(@Param() params): string {
  //   console.log(params);
  //   return `This action returns a #${params.id} cat`;
  // }

  // @Post()
  // async create(@Body() createUserDto: CreateUserDto) {
  //   try {
  //     return 'this action adds a new user';
  //   } catch (error) {
  //     throw new BadRequestException();
  //   }
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string): User {
  //   const user = this.usersService.findById(Number(id));
  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //   return user;
  // }

  // pipe ParseIntPipe

  // @Get(':id')
  // findOne(
  //   @Param(
  //     'id',
  //     new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
  //   )
  //   id: number,
  // ): User {
  //   const user = this.usersService.findById(id);
  //   if (!user) {
  //     throw new NotFoundException();
  //   }
  //   return user;
  // }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    try {
      this.usersService.create(createUserDto);
      console.log('data', createUserDto);

      console.log('Tạo user thành công');
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get()
  findAll(): User[] {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @ApiQuery({ name: 'name', required: false })
  @Get()
  getUsers(@Query('name') name: string): User[] {
    const user = this.usersService.findByName(name);
    if (!user) {
      throw new BadRequestException();
    }
    return user;
  }

  @Put('/update/:id')
  demoPut(
    @Param('id') id: number,
    @Body() @Body() updateUser: UpdateUser,
  ): User[] {
    return this.usersService.updateUser(updateUser.name, updateUser.age, id);
  }

 
}
