========== FUNDAMENTALS ==========

# 1. Custom providers

## DI fundamentals

- Đầu tiên, xác định một provider. `@Injectable()` decorator đánh dấu lớp `CatsService` là một `provider`.

```ts
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  findAll(): Cat[] {
    return this.cats;
  }
}
```

- Sau đó, yêu cầu `Nest inject provider` vào lớp `controller`:

```ts
import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {} // here

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll(); // use
  }
}
```

- Cuối cùng đăng ký `provider` với `Nest IoC container`:

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService], //here
})
export class AppModule {}
```

- Có 3 bước chính trong quy trình:

  - [1] Trong `cats.service.ts`, `@Injectable()` decorator khai báo lớp `CatsService` là lớp có thể được quản lý bởi Nest IoC.

  - [2] Trong `cats.controller.ts`, `CatsController` khai báo dependency vào token CatsService với inject hàm tạo:

    `constructor(private catsService: CatsService)`

  - [3] Trong `app.module.ts`, chúng tôi liên kết `token CatsService` với lớp `CatsService` từ tệp `cat.service.ts`.

- Giải thích:

  - Khi vùng chứa Nest IoC khởi tạo `CatsController`, trước tiên nó sẽ tìm kiếm bất kỳ `dependencies`. Khi thấy phần phụ thuộc `CatsService`, nó sẽ thực hiện tra cứu `token CatsService`, mã này trả về lớp `CatsService`, theo bưới đăng ký [3].

  - Giả sử phạm vi `Singleton` (hành vi mặc định), Nest sau đó sẽ tạo một instance của CatsService, lưu vào bộ nhớ cache và trả về nó hoặc nếu một đối tượng đã được lưu trong bộ nhớ cache, hãy trả về instance hiện có.

## Standard providers

- Hãy xem xét kỹ hơn @Module() decorator. Trong app.module, chúng tôi khai báo:

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
```

- Thuộc tính providers có 1 mảng providers. Trên thực tế, cú pháp providers: [CatsService] ngắn gọn cho cú pháp hoàn chỉnh hơn:

```
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
];
```

- Ở đây, rõ ràng họ đang liên kết `token CatsService` với lớp `CatsService`. Ký hiệu viết tắt chỉ là một sự tiện lợi để đơn giản hóa trường hợp sử dụng phổ biến nhất, trong đó `token` được sử dụng để request một instance của một lớp có cùng tên.

## Custom providers

- Một vài ví dụ khi yêu cầu của ta vượt quá những yêu cầu do các Standard providers đưa ra:

  - Muốn tạo instance tùy chỉnh của nội dung thay vì có Nest tức thời (hoặc trả về instance được lưu trong bộ nhớ cache của) một lớp.

  - Muốn sử dụng lại một lớp hiện có trong dependency thứ hai.

  - Muốn ghi đè một lớp bằng phiên bản giả để testing

- Nest cho phép chúng ta xác định các `providers` tùy chỉnh để xử lý các trường hợp này. Nó cung cấp một số cách để xác định các `providers` tùy chỉnh.

#### Value providers: useValue

- Cú pháp `useValue` hữu ích để inject vào một giá trị không đổi, đưa một thư viện bên ngoài vào vùng chứa Nest hoặc thay thế một triển khai thực bằng một đối tượng giả.

```ts
import { CatsService } from './cats.service';

const mockCatsService = {
  /* mock implementation
  ...
  */
};

@Module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService,
    },
  ],
})
export class AppModule {}
```
