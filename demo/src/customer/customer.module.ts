import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

export const mockCatsService = {
  /* mock implementation
  ...
  */
  getCustomer() {
    console.log('Hello, this is custom provider');
  },
};

@Module({
  controllers: [CustomerController],
  providers: [
    {
      provide: 'CONNECTION',
      useValue: CustomerService,
    },
  ],
})
export class CustomerModule {}
