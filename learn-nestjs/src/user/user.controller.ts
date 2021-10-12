import { Controller, Get, UseGuards } from '@nestjs/common';
import { CustomRoles } from './../roles.decorator';
import { RolesGuard } from './../roles.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @CustomRoles('admin')
  getAll() {
    // Authorized
    return this.userService.getAll();
  }

  @Get('dog')
  getDogs() {
    // Public Authorized
    return 'Everyone can access this dog';
  }
}
