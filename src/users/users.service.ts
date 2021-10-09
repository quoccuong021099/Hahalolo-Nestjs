import { HttpException, Inject, Injectable, Optional } from '@nestjs/common';
import { response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService<T> {
  constructor(
    @Optional() @Inject('USERS_SERVICE_OPTIONS') private httpClient: T,
  ) {}

  private readonly users: User[] = [
    { id: 1, name: 'xanh', age: 15 },
    { id: 2, name: 'Tao', age: 29 },
    { id: 3, name: 'Bao', age: 20 },
  ];

  create(createUserDto: CreateUserDto) {
    const newUser = { id: Date.now(), ...createUserDto };
    this.users.push(newUser);
    return newUser;
  }

  findAll(): User[] {
    return this.users;
  }

  findByName(name?: string): User[] {
    if (name) {
      return this.users.filter((user) => user.name === name);
    }
    return this.users;
  }

  findById(userId: number) {
    return this.users.find((user) => user.id === userId);
  }

  updateUser(newName: string, newAge: number, userId: number) {
    const user = this.users.find((item) => item.id == userId);
    if (user) {
      user.age = newAge;
      user.name = newName;
      user.update = 'Mới Update';
    }
    return this.users;
  }

}
