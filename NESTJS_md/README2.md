========== FUNDAMENTALS ==========

# 1. Custom providers

## DI fundamentals

- Đầu tiên, xác định một provider. `@Injectable()` decorator đánh dấu lớp `CatsService` là một `provider`.

```ts
import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

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
import { Controller, Get } from "@nestjs/common";
import { CatsService } from "./cats.service";
import { Cat } from "./interfaces/cat.interface";

@Controller("cats")
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
import { Module } from "@nestjs/common";
import { CatsController } from "./cats/cats.controller";
import { CatsService } from "./cats/cats.service";

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
import { CatsService } from "./cats.service";

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

- Trong ví dụ này, `token CatsService` sẽ phân giải thành đối tượng giả `mockCatsService`. useValue yêu cầu một giá trị – trong trường hợp này là một đối tượng theo nghĩa đen có giao diện giống với lớp `CatsService` mà nó đang thay thế. Do kiểu gõ cấu trúc của TypeScript, bạn có thể sử dụng bất kỳ đối tượng nào có interface tương thích, bao gồm một đối tượng theo nghĩa đen hoặc một instance lớp được khởi tạo bằng new.

### Non-class-based provider tokens

- Đôi khi, chúng ta có thể muốn sự linh hoạt khi sử dụng chuỗi hoặc ký hiệu làm token DI. Ví dụ:

```ts
import { connection } from "./connection";

@Module({
  providers: [
    {
      provide: "CONNECTION",
      useValue: connection,
    },
  ],
})
export class AppModule {}
```

- Trong ví dụ này, chúng tôi đang liên kết một token có giá trị chuỗi (‘CONNECTION’) với một đối tượng connection đã có từ trước mà chúng tôi đã nhập từ một tệp bên ngoài.

### Class providers: useClass

- Cú pháp useClass cho phép bạn xác định động một lớp mà token sẽ phân giải. Ví dụ, giả sử chúng ta có một lớp ConfigService trừu tượng (hoặc mặc định). Tùy thuộc vào môi trường hiện tại, chúng tôi muốn Nest cung cấp cách triển khai dịch vụ cấu hình khác nhau. Đoạn mã sau thực hiện một chiến lược như vậy.

```ts
const configServiceProvider = {
  provide: ConfigService,
  useClass:
    process.env.NODE_ENV === "development"
      ? DevelopmentConfigService
      : ProductionConfigService,
};

@Module({
  providers: [configServiceProvider],
})
export class AppModule {}
```

- Sử dụng tên lớp ConfigService làm token của chúng tôi. Đối với bất kỳ lớp nào phụ thuộc vào ConfigService, Nest sẽ inject một instance của lớp được provided (DevelopmentConfigService hoặc ProductionConfigService) ghi đè bất kỳ triển khai mặc định nào có thể đã được khai báo ở nơi khác (ví dụ: một ConfigService được khai báo với @Injectable() decorator).

### Factory providers: useFactory

```ts
const connectionFactory = {
  provide: "CONNECTION",
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
})
export class AppModule {}
```

- Cú pháp useFactory cho phép tạo động các providers. Provider thực tế sẽ được cung cấp bởi giá trị trả về từ một function của factory. Factory function có thể đơn giản hoặc phức tạp nếu cần. Một factory đơn giản có thể không phụ thuộc vào bất kỳ provider nào khác. Một factory phức tạp hơn có thể tự inject các provider khác mà nó cần để tính toán kết quả của nó. Đối với trường hợp thứ hai, cú pháp của provider gốc có một cặp cơ chế liên quan:

  - Factory function có thể chấp nhận các đối số (tùy chọn).

  - Thuộc tính inject (tùy chọn) chấp nhận một mảng các providers mà Nest sẽ phân giải và truyền làm đối số cho factory function trong quá trình khởi tạo. Hai danh sách phải tương quan với nhau: Nest sẽ chuyển các instances từ danh sách inject làm đối số cho factory function theo cùng một thứ tự.

### Alias providers: useExisting

- Cú pháp useExisting cho phép bạn tạo aliases cho các providers hiện có. Điều này tạo ra hai cách để truy cập cùng một provider. Trong ví dụ bên dưới, token (dựa trên chuỗi) ‘AliasedLoggerService‘ là bí danh cho token (dựa trên lớp) LoggerService. Giả sử chúng ta có hai dependencies khác nhau, một cho ‘AliasedLoggerService‘ và một cho LoggerService. Nếu cả hai phần dependencies đều được chỉ định với phạm vi SINGLETON, cả hai đều sẽ giải quyết cho cùng một instance.

```ts
@Injectable()
class LoggerService {
  /* implementation details */
}

const loggerAliasProvider = {
  provide: "AliasedLoggerService",
  useExisting: LoggerService,
};

@Module({
  providers: [LoggerService, loggerAliasProvider],
})
export class AppModule {}
```

### Non-service based providers

- Trong khi các providers thường cung cấp services, họ không giới hạn việc sử dụng đó. Một provider có thể cung cấp bất kỳ giá trị nào. Ví dụ: một provider có thể cung cấp một loạt các đối tượng cấu hình dựa trên môi trường hiện tại, như được hiển thị bên dưới:

```ts
const configFactory = {
  provide: "CONFIG",
  useFactory: () => {
    return process.env.NODE_ENV === "development" ? devConfig : prodConfig;
  },
};

@Module({
  providers: [configFactory],
})
export class AppModule {}
```

### Export custom provider

- Giống như bất kỳ provider nào, provider tùy chỉnh được xác định phạm vi đến mô-đun khai báo của nó. Để hiển thị nó với các mô-đun khác, nó phải được exported. Để xuất một provider tùy chỉnh, chúng tôi có thể sử dụng token của nó hoặc đối tượng provider đầy đủ.

- Ví dụ exported bằng token

```ts
const connectionFactory = {
  provide: "CONNECTION",
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
  exports: ["CONNECTION"],
})
export class AppModule {}
```

- Ngoài ra, export với đối tượng provider đầy đủ:

```ts
const connectionFactory = {
  provide: "CONNECTION",
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
  exports: [connectionFactory],
})
export class AppModule {}
```

==========================================

# 2. Asynchronous providers

- Đôi khi, việc khởi động ứng dụng sẽ bị trì hoãn cho đến khi hoàn thành một hoặc nhiều tác vụ không đồng bộ. Ví dụ, bạn có thể không muốn bắt đầu chấp nhận các requests cho đến khi kết nối với cơ sở dữ liệu đã được thiết lập. Bạn có thể đạt được điều này bằng cách sử dụng các providers không đồng bộ.

- Cú pháp cho điều này là sử dụng async / await với cú pháp useFactory. Factory trả về một Promise và factory function có thể await các tác vụ không đồng bộ. Nest sẽ chờ giải quyết lời hứa trước khi khởi tạo bất kỳ lớp nào phụ thuộc vào (injects) một provider như vậy.

```ts
{
  provide: 'ASYNC_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection(options);
    return connection;
  },
}
```

==========================================

# 3. Dynamic modules

# Note

- Sử dụng useValue (custom provider)

- Non-class-based provider tokens

- useFactory
