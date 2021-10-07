import { Controller, Get, Inject } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customer')
export class CustomerController {
  [x: string]: any;
  constructor(@Inject('CONNECTION') connection: CustomerService) {}

  @Get()
  getDemo() {
    return this.connection.getCustomer();
  }
}
