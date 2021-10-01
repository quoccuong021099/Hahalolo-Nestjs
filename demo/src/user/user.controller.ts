import { CustomRoles } from './../roles.decorator';
import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './../roles.guard';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  // @UseGuards(RolesGuard)
  //   @SetMetadata('roles', 'admin')
  @CustomRoles('admin')
  getAll() {
    // Authorized
    return this.userService.getAll();
  }

  @Get('dog')
  //   @CustomRoles('public')
  //   @SetMetadata('roles', 'public')
  getDogs() {
    // Public Authorized
    return 'Everyone can access this dog';
  }
}
