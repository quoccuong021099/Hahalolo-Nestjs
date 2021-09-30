========== 😺 NESTJS 🐱 ==========

# 0. DI, IoC

- DI là một mẫu thiết kế trong đó một lớp yêu cầu các phụ thuộc từ các nguồn bên ngoài thay vì tạo chúng.

# 1. Controllers

- Xử lý các requests và trả responses cho client

- ![Controller](https://docs.nestjs.com/assets/Controllers_1.png)

- Mục đích của Controller là nhận các yêu cầu cụ thể cho ứng dụng.

- Mỗi Controller có nhiều hơn 1 route và các route khác nhau có thể thực hiện cách hành động khác nhau.

- Tạo 1 Controller bằng CLI:
  `$ nest g controller cats`

## Routing

- Ví dụ:

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

- `@Controller()` Dùng để xác định một controller cơ bản.

- Xử dụng tiền tố (prefix) trong `@Controller('cats')` cho phép dễ dàng nhóm một tập hợp các route liên quan và giảm thiểu code.

- `@Get()` là request method trước method `findAll()` yêu cầu Nest tạo trình xử lý request đó.

- `route` cho việc xử lý được xác định bằng cách nối tiền tố(prefix) trong `@Controller('cats')` với `route` trong method `@Get()`.

- Trong ví dụ trên, khi một GET request được thực hiện, Nest sẽ route request đến các phương thức `findAll()` do người dùng định nghĩa.

- Method này trả về status code 200 và response liên quan, trong trường hợp này chỉ là một chuỗi.

- ![recommended](https://scontent-hkg4-1.xx.fbcdn.net/v/t1.15752-9/242980366_991039408154973_1958958343245628787_n.png?_nc_cat=103&ccb=1-5&_nc_sid=ae9488&_nc_ohc=ubRehZuhjiEAX-9IkXn&tn=YZFVrhMc4N2U7Dws&_nc_ht=scontent-hkg4-1.xx&oh=210129c0448ce13f367e1a84edbb3259&oe=6177B757)

- ![warning](https://scontent-hkg4-2.xx.fbcdn.net/v/t1.15752-9/243151294_1291706974622239_2776156892433323573_n.png?_nc_cat=111&ccb=1-5&_nc_sid=ae9488&_nc_ohc=IupRiPWhvfUAX8zijua&_nc_ht=scontent-hkg4-2.xx&oh=216c7b9ac64edbf2ea8a9c700befe450&oe=6176A75F)

## Request object

- Handler thường cần truy cập vào các chi tiết `request` của client. Nest cung cấp quyền truy cập vào các request object của platform bên dưới (Express mặc định).

- Ta có thể truy cập vào request object bằng cách cung cấp Nest để inject nó bằng cách thêm @Req() decorator vào signature của handler.

- ```ts
  import { Controller, Get, Req } from '@nestjs/common';
  import { Request } from 'express';
  @Controller('cats')
  export class CatsController {
    @Get()
    findAll(@Req() request: Request): string {
      return 'This action returns all cats';
    }
  }
  ```
- `Request object` đại diện cho request HTTP và các thuộc tính của chuỗi query, request, parameters, HTTP headers, và body.

- Trong hầu hết các trường hợp, không cần thiết phải lấy các thuộc tính theo cách thủ công. Thay vào đó, ta có thể sử dụng các decorator chuyên dụng, chẳng hạn như @Body() hoặc @Query(), sẵn có dùng được luôn.

## Resources

- Khi muốn cung cấp một endpoint để tạo các bản ghi mới. Đối với điều này, hãy tạo POST handler:

- ```ts
  import { Controller, Get, Post } from '@nestjs/common';
  @Controller('cats')
  export class CatsController {
    @Post()
    create(): string {
      return 'This action adds a new cat';
    }
    @Get()
    findAll(): string {
      return 'This action returns all cats';
    }
  }
  ```

## Route wildcards

- Pattern dựa trên route cũng được hỗ trợ. Ví dụ, dấu hình sao `*` được sử dụng làm wildcard (ký tự đại diện), và sẽ khớp với bất kỳ tổ hợp ký tự nào.

- ```ts
  @Get('ab*cd')
  findAll() {
    return 'This route uses a wildcard';
  }
  ```

- Với route trên sẽ khớp với `abcd`, `ab_cd`, `abecd`,...

## Status code

- `status code – response` luôn mặc định là `200`, ngoài trừ các `POST request` sẽ là `201`. Ta có thể dễ dàng thay đổi hành vi này bằng thêm `@HttpCode(…)` decorator ở handler-level.

- ```ts
  @Post()
  @HttpCode(204)
  create() {
    return 'This action adds a new cat';
  }
  ```
- `status code` không tĩnh mà phụ thuộc vào các yếu tố khác nhau.

## Headers

- Để chỉ định một tùy chỉnh `response header`, bạn có thể sử dụng một @Header() decorator hoặc response object thư viện riêng (và gọi trực tiếp res.header()).

- ```ts
  @Post()
  @Header('Cache-Control', 'none')
  create() {
    return 'This action adds a new cat';
  }
  ```

## Redirection

- Để redirect một response tới một URL cụ thể, bạn có thể sử dụng @Redirect() decorator hoặc một thư viện riêng response object (và gọi trực tiếp res.redirect()).

- @Redirect() nhận 2 đối số (arguments), url và statusCode, cả 2 đều là tùy chọn. Giá trị mặc định của statusCode is 302 (Found) nếu bị bỏ qua ko truyền gì.

- ```ts
    @Get()
    @Redirect('https://nestjs.com', 301)
  ```

## Route parameters

- Các route với đường dẫn tĩnh sẽ không hoạt động khi bạn cần chấp nhận dữ liệu động như một phần của request (ví dụ: `GET /cat/1` để nhận cat có `id 1`)

- Ví dụ lấy id từ param

- ```ts
  @Get(':id')
  findOne(@Param() params): string {
      console.log(params); // {id: 12}
    return `This action returns a #${params.id} cat`;
  }
  ```

- Cách lấy trực tiếp

- ```ts
  @Get(':id')
  findOne(@Param('id') id: string): string {
    console.log(id); // 12
    return `This action returns a #${id} cat`;
  }
  ```

## Asynchronicity

- Mọi hàm bất đồng bộ phải trả về một Promise.

- ```ts
  @Get()
  async findAll(): Promise<any[]> {
    return [];
  }
  `
  ```

## Request payloads

### DTO (Data Transfer Object)

- DTO là một đối tượng xác định cách dữ liệu sẽ được gửi qua mạng.

- Có thể xác định lược đồ DTO bằng cách sử dụng các interface TypeScript hoặc bằng các class đơn giản.

- Class là một phần của tiêu chuẩn JavaScript ES6, và do đó chúng được giữ nguyên như các thực thể thực trong JavaScript đã biên dịch.

- Mặt khác, vì các interfaces TypeScript bị xóa trong quá trình chuyển đổi, Nest không thể tham chiếu đến chúng trong thời gian chạy. Điều này rất quan trọng vì các tính năng như Pipes cho phép các khả năng bổ sung khi chúng có quyền truy cập vào metatype của biến trong runtime.

- Tạo một dto

- ```ts
  export class CreateCatDto {
    name: string;
    age: number;
    breed: string;
  }
  ```

- Và trong controller

- ```ts
  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }
  ```

### Getting up and running

- Với controller ở trên được xác định đầy đủ, Nest vẫn không biết rằng CatsController tồn tại và kết quả là sẽ không tạo một instance của lớp này.

- Để tạo được ta cần phải import controller vào module

- ```ts
  import { Module } from '@nestjs/common';
  import { CatsController } from './cats/cats.controller';
  @Module({
    controllers: [CatsController],
  })
  export class AppModule {}
  ```
  ==========================================

# 2. Provider

- Nhiều Class Nest cơ bản có thể được coi như một provider như service, repository, factory, helpers,... Ý tưởng chính của một provider là nó có thể `inject dependencies` điều này có nghĩa là các đối tượng có thể tạo ra nhiều mối quan hệ khác nhau với nhau, và việc tạo các instance của các object được Nest thực hiện tự động. Một provider đơn giản là 1 class được liên kết với 1 decorator @Injectable().

## Services

- Để tạo môt service sử dụng CLI, câu lệnh thực thi là `$ nest g service cats`

- Service sẽ chịu trách nhiệm lưu trữ và truy xuất dữ liệu và được thiết kế để sử dụng bởi Controller.

- ```ts
  import { Injectable } from '@nestjs/common';
  import { Cat } from './interfaces/cat.interface';
  @Injectable()
  export class CatsService {
    private readonly cats: Cat[] = [];

    create(cat: Cat) {
      this.cats.push(cat);
    }

    findAll(): Cat[] {
      return this.cats;
    }
  }
  ```

- `@Injectable()` decorator đính kèm `metadata`, `metadata` này tuyên bố rằng `CatsService` là một class có thể được quản lý bởi `Nest IoC container`.

- Để truy xuất CatsService, chúng ta sử dụng nó bên trong CatsController:

```ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

- `CatsService` được injected vào thông qua constructor của lớp. Lưu ý việc sử dụng cú pháp private. Cách viết tắt này cho phép chúng ta vừa khai báo vừa khởi tạo thực thể catService cùng 1 lúc.

## Dependency injection

- Nest sẽ giải quyết các catsService bằng cách tạo và trả về 1 instance của CatsService (hoặc, trong trường hợp bình thường là một singleton, trả về instance hiện có nếu nó đã được yêu cầu ở nơi khác).

- Dependency này được resolved và truyền tới constructor của controller của bạn (hoặc được gán thuộc tính được chỉ định):

- ```ts
  constructor(private catsService: CatsService) {}
  ```

## Scopes

- Các Providers thường có vòng đời (`scope`) được đồng bộ hóa với vòng đời ứng dụng. Khi ứng dụng được khởi động, mọi dependency phải được resolved và do đó mọi Provider phải được khởi tạo. Tương tự, khi ứng dụng tắt, mỗi Provider sẽ bị hủy.

## Optional providers

- Đôi khi, có thể có các dependency không nhất thiết phải được `resolved`.

- Ví dụ: Class có thể phụ thuộc vào một đối tượng cấu hình, nhưng nếu không có đối tượng nào được truyền, thì các giá trị mặc định sẽ được sử dụng.

- Trong trường hợp như vậy, phần phụ thuộc trở thành tùy chọn, vì thiếu Provider cấu hình sẽ không dẫn đến lỗi.

- Để chỉ ra Provider là tùy chọn, hãy sử dụng `@Optional()` decorator trong signature của Provider.

- ```ts
  import { Injectable, Optional, Inject } from '@nestjs/common';
  @Injectable()
  export class HttpService<T> {
    constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
  }
  ```

## Property-based injection

- Kỹ thuật mà chúng tôi đã sử dụng cho đến nay được gọi là inject dựa trên constructor, vì các Provider được đưa vào thông qua constructor. Trong một số trường hợp rất cụ thể, inject dựa trên thuộc tính có thể hữu ích. Ví dụ: nếu top-level class của bạn phụ thuộc vào một hoặc nhiều Provider, việc chuyển chúng lên bằng cách gọi super() trong các lớp con từ constructor có thể rất tẻ nhạt. Để tránh điều này, bạn có thể sử dụng trình @Inject() decorator ở cấp thuộc tính.

- ```ts
  import { Injectable, Inject } from '@nestjs/common';
  @Injectable()
  export class HttpService<T> {
    @Inject('HTTP_OPTIONS')
    private readonly httpClient: T;
  }
  ```
- Nếu class không mở rộng Provider khác` thì nên sử dụng inject dựa trên constructor.

## Provider registration

- Chúng ta cần đăng ký Service với Nest để nó có thể thực hiện việc inject. Để thực hiện việc này bằng cách chỉnh sửa tệp module (app.module.ts) và thêm Service vào mảng providers của @Module() decorator.

- ```ts
  import { Module } from '@nestjs/common';
  import { CatsController } from './cats/cats.controller';
  import { CatsService } from './cats/cats.service';
  @Module({
    controllers: [CatsController],
    providers: [CatsService],
  })
  export class AppModule {}
  ```

==========================================

# 3. Module

- Module là một class được chú thích bằng `@Module()` decorator. @Module() decorator cung cấp metadata mà Nest sử dụng để tổ chức cấu trúc ứng dụng.

- ![module](https://i0.wp.com/docs.nestjs.com/assets/Modules_1.png?resize=640%2C347&ssl=1)

- Mỗi ứng dụng có ít nhất một module, một module gốc.

- Module gốc là điểm khởi đầu Nest sử dụng để xây dựng biểu đồ ứng dụng – cấu trúc dữ liệu nội bộ mà Nest sử dụng để giải quyết các mối quan hệ và phụ thuộc của Module và các Providers.

- @Module() decorator nhận một đối tượng duy nhất có thuộc tính mô tả module:

- ![các thuộc tính của module](https://scontent-hkg4-2.xx.fbcdn.net/v/t1.15752-9/243130598_1177457572779074_497548146018270622_n.png?_nc_cat=111&ccb=1-5&_nc_sid=ae9488&_nc_ohc=VYUwiuqZfw8AX_-LXOB&_nc_oc=AQm7OZiEumevjPKpteRXO0Pbca5v6yunRSi1b7AQNZYsUJYoiBgyEBEMIUgCCzU0QGo&_nc_ht=scontent-hkg4-2.xx&oh=08a2b79cc95e0924be7f2b3cb1548902&oe=617636B7)

## Feature modules

- CatsController và CatsService thuộc cùng một miền ứng dụng. Vì chúng có liên quan chặt chẽ với nhau, nên chuyển chúng vào một Feature modules sẽ rất hợp lý. Feature modules chỉ đơn giản là tổ chức mã phù hợp với một tính năng cụ thể, giữ cho mã có tổ chức và thiết lập ranh giới rõ ràng.

## Shared modules

- Chúng ta có thể chia sẻ cùng một thực thể của bất kỳ provider nào giữa nhiều module một cách dễ dàng.

- Ví dụ: chúng ta muốn chia sẻ một thực thể của CatsService giữa một số module khác. Để làm điều đó, trước tiên chúng ta cần `export provider CatsService` bằng cách thêm nó vào mảng exports của module, như được hiển thị bên dưới:

- ```ts
  import { Module } from '@nestjs/common';
  import { CatsController } from './cats.controller';
  import { CatsService } from './cats.service';
  @Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService], // export để chia sẻ
  })
  export class CatsModule {}
  ```
- Bây giờ bất kỳ module nào import CatsModule đều có quyền truy cập vào CatsService và sẽ chia sẻ cùng một instance với tất cả các module khác cũng import nó.

## Module re-exporting

- Chúng ta có thể re-import các module đã import.

- Ví dụ:

- ```ts
  @Module({
    imports: [CommonModule], // import CommonModule
    exports: [CommonModule], // Xong export nó lại
  })
  export class CoreModule {}
  ```

## Dependency injection

- Một class module cũng có thể inject các providers.

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

## Global modules

- Khi muốn cung cấp một tập hợp các providers nên có sẵn ở mọi nơi ngay lập tức, hãy đặt module toàn cục với @Global() decorator.

```ts
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

- @Global() làm cho module có phạm vi toàn cục. Module toàn cục chỉ nên được đăng ký một lần, thường là module gốc hoặc module lõi.

## Dynamic modules (module động)

- Chưa rõ

==========================================

# 4. Middleware

- `Middleware` là một hàm được gọi trước khi tới `handler route`.

- Các hàm middleware có quyền truy cập vào các object `request` và `response` cũng như hàm middleware `next()` trong chu trình `request-response` của ứng dụng. Hàm middlware `next()` thường được ký hiệu bằng một biến có tên là next.

- ![Midlleware](https://i2.wp.com/docs.nestjs.com/assets/Middlewares_1.png?resize=640%2C145&ssl=1)

- Các hàm Middleware có thể thực hiện các nhiệm vụ sau:

  - Thực thi bất kỳ mã nào.

  - Thực hiện các thay đổi đối với request và response object.

  - Kết thúc chu kỳ request-response.

  - Gọi hàm middleware tiếp theo trong ngăn xếp.

  - Nếu hàm middleware hiện tại không kết thúc chu kỳ request-response, nó phải gọi next() để chuyển quyền điều khiển cho hàm middleware tiếp theo. Nếu không, request sẽ bị treo.

## Dependency injection

- Middleware Nest hỗ trợ đầy đủ Dependency Injection. Cũng như với các provider và controller, họ có thể inject dependencies có sẵn trong cùng một mô-đun. Như thường lệ, điều này được thực hiện thông qua construstor.

## Applying middleware

- Không có chỗ cho middleware trong `@Module() decorator`. Thay vào đó, chúng ta phải thiết lập chúng bằng phương thức `configure()` của lớp module. Các module bao gồm middleware phải triển khai interface NestModule. Hãy thiết lập LoggerMiddleware ở cấp AppModule.

```ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
```

## Middleware consumer

- MiddlewareConsumer là một class helper. Nó cung cấp một số phương pháp tích hợp middleware. Tất cả chúng có thể được xâu chuỗi 1 cách đơn giản trôi chảy.

- Phương thức forRoutes() có thể nhận được 1 chuỗi đơn, nhiều chuỗi, 1 đối tượng RouteInfo, 1 lớp controller và thậm chí nhiều lớp controller.

- Trong hầu hết các trường hợp, ta có thể sẽ chỉ chuyển 1 danh sách các controller được phân tách bằng dấu phẩy. Dưới đây là 1 ví dụ với 1 controller duy nhất.

- ```ts
  export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes(CatsController);
    }
  }
  ```

## Excluding routes

- Chúng ta muốn loại trừ một số route nhất định khỏi việc áp dụng middleware.

- Để làm việc đó chúng ta sử dụng method `exclude()`.

- ```ts
  consumer
    .apply(LoggerMiddleware)
    .exclude(
      { path: 'cats', method: RequestMethod.GET },
      { path: 'cats', method: RequestMethod.POST },
      'cats/(.*)',
    )
    .forRoutes(CatsController);
  ```

## Functional middleware

```ts
import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

## Multiple middleware

- Để liên kết nhiều middleware được thực thi tuần tự, chỉ cần cung cấp một danh sách được phân tách bằng dấu phẩy bên trong phương thức apply():

- ```ts
  consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
  ```

## Global middleware

- Nếu muốn liên kết middleware với mọi route đã đăng ký cùng một lúc, có thể sử dụng phương thức use() được cung cấp bởi thực thể INestApplication:

- ```ts
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  await app.listen(3000);
  ```

- Ngoài ra có thể sử dụng với `.forRoutes('*')` trong AppModule (hoặc bất kỳ module nào khác).

==========================================

# 5. Exception filters

- Nest đi kèm với một lớp exception tích hợp, lớp này chịu trách nhiệm xử lý tất cả các trường hợp exception chưa được xử lý trên một ứng dụng.

- Khi một exception không được mã ứng dụng của bạn xử lý, nó sẽ bị lớp này bắt giữ, lớp này sau đó sẽ tự động gửi một phản hồi thân thiện với người dùng thích hợp.

- ![Exception filter](https://i0.wp.com/docs.nestjs.com/assets/Filter_1.png?resize=640%2C364&ssl=1)

- Ngoài ra, hành động này được thực hiện bởi một bộ lọc exception chung tích hợp sẵn, bộ lọc này xử lý các exception của kiểu HttpException (và các lớp con của nó).

- Khi một ngoại lệ không được công nhận (không phải là HttpException cũng không phải là một lớp kế thừa từ HttpException), bộ lọc exception tích hợp sẽ tạo ra phản hồi JSON mặc định sau:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Throwing standard exceptions

- Nest cung cấp lớp HttpException tích hợp sẵn, được hiển thị từ gói @nestjs/common. Đối với các ứng dụng dựa trên API HTTP REST / GraphQL điển hình, cách tốt nhất là gửi các đối tượng response HTTP tiêu chuẩn khi các điều kiện lỗi nhất định xảy ra.

- Ví dụ, trong CatsController, chúng ta có một phương thức findAll() (một route handler GET). Giả sử rằng route hander này ném ra một exception vì một số lý do. Để chứng minh điều này, chúng tôi sẽ sửa nó như sau:

```ts
@Get()
async findAll() {
  throw new HttpException('Lỗiiiii', HttpStatus.FORBIDDEN);
}
```

- Lúc đó sẽ có response như sau:

```json
{
  "statusCode": 403,
  "message": "Lỗiiiii"
}
```

- Hàm tạo HttpException nhận hai đối số bắt buộc để xác định phản hồi:

  - Đối số response xác định body response JSON. Nó có thể là 1 string hoặc 1 object như mô tả bên dưới.

  - Đối số status được định nghĩa như ở HTTP status code.

- Theo mặc định, body response JSON chứa hai thuộc tính:

  - statusCode: mặc định thành HTTP status code được cung cấp ở đối số status

  - message: một đoạn mô ta ngắn về lỗi HTTP dựa trên status

- Để chỉ ghi đè phần thông báo của body response JSON, hãy cung cấp một string trong đối số response.

- Để ghi đè toàn bộ body response JSON, hãy chuyển một đối tượng vào đối số response. Nest sẽ chuyển hóa đối tượng và trả về nó dưới dạng body response JSON.

```ts
@Get()
async findAll() {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  }, HttpStatus.FORBIDDEN);
}
```

- response sẽ là:

```ts
{
  "status": 403,
  "error": "This is a custom message"
}
```

## Custom exceptions

- Nếu cần tạo các exception tùy chỉnh, chúng ta nên tạo hệ thống phân cấp exception của riêng mình, nơi các exception tùy chỉnh của bạn kế thừa từ lớp HttpException cơ sở.

```ts
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

- Và sử dụng nó

```ts
@Get()
async findAll() {
  throw new ForbiddenException();
}
```

## Built-in HTTP exceptions

- Nest cung cấp một tập hợp các exception tiêu chuẩn kế thừa từ HttpException cơ sở. Chúng được hiển thị từ gói @nestjs/common và đại diện cho nhiều exception HTTP phổ biến nhất:

  - BadRequestException

  - UnauthorizedException

  - NotFoundException

  - ForbiddenException

  - NotAcceptableException

  - RequestTimeoutException

  - ConflictException

  - GoneException

  - HttpVersionNotSupportedException

  - PayloadTooLargeException

  - UnsupportedMediaTypeException

  - UnprocessableEntityException

  - InternalServerErrorException

  - NotImplementedException

  - ImATeapotException

  - MethodNotAllowedException

  - BadGatewayException

  - ServiceUnavailableException

  - GatewayTimeoutException

  - PreconditionFailedException

## Exception filters

- Chưa rõ lắm

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

## Binding filters

- Sử dụng @UseFilters() decorator

```ts
@Post()
@UseFilters(new HttpExceptionFilter())
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

- Chưa rõ lắm

==========================================

# 6. Pipes

- Một Pipe là một lớp được chú thích bằng @Injectable(). Pipes nên triển khai interface PipeTransform.

- ![Pipes](https://i0.wp.com/docs.nestjs.com/assets/Pipe_1.png?resize=640%2C364&ssl=1)

- Pipes có hai trường hợp sử dụng điển hình:

  - Transformation: chuyển đổi dữ liệu đầu vào sang dạng mong muốn (ví dụ: từ chuỗi thành số nguyên)

  - Validation: đánh giá dữ liệu đầu vào và nếu hợp lệ, chỉ cần chuyển nó qua không thay đổi; nếu không, hãy ném một exception khi dữ liệu không chính xác

- Trong cả hai trường hợp, các pipes hoạt động dựa trên các anguments đang được xử lý bởi controller route handler.

- Nest lồng vào một pipe ngay trước khi một phương thức được gọi và pipe nhận các đối số dành cho phương thức đó và hoạt động trên chúng.

- Bất kỳ hoạt động transformation hoặc validation nào diễn ra tại thời điểm đó, sau đó route handler được gọi với bất kỳ đối số (có khả năng) được chuyển đổi nào.

- Các Pipes chạy bên trong vùng exception.

- Điều này có nghĩa là khi một Pipe ném một exception, nó sẽ được xử lý bởi lớp exception (exception filters chung và bất kỳ exception filters nào được áp dụng cho ngữ cảnh hiện tại).

- Với những điều trên, cần rõ ràng rằng khi một exception được ném vào trong một Pipe, không có phương thức controller nào được thực thi sau đó.

## Built-in pipes

- Nest đi kèm với 6 pipes có sẵn dùng được ngay:

  - ValidationPipe

  - ParseIntPipe

  - ParseBoolPipe

  - ParseArrayPipe

  - ParseUUIDPipe

  - DefaultValuePipe

## Binding pipes

- Để sử dụng một pipe, chúng ta cần liên kết một instance của lớp pipe với ngữ cảnh thích hợp.

- Trong ví dụ ParseIntPipe của chúng tôi, chúng tôi muốn liên kết pipe với một phương thức route handler cụ thể và đảm bảo rằng nó chạy trước khi phương thức được gọi. Chúng tôi làm như vậy với cấu trúc sau, mà chúng tôi sẽ gọi là ràng buộc pipe ở cấp tham số phương thức:

- ```ts
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }
  ```

- Điều này đảm bảo rằng một trong 2 điều kiện sau là đúng: hoặc tham số chúng tôi nhận được trong phương thức findOne() là một số (như mong đợi trong lệnh gọi this.catsService.findOne()) của chúng tôi hoặc một exception được ném ra trước route handler được gọi.

- Nếu id truyền vào là 1 giá trị không phải là số thì sẽ:

- ```json
  {
    "statusCode": 400,
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request"
  }
  ```

- Truyền một instance tại chỗ rất hữu ích nếu chúng ta muốn tùy chỉnh hành vi của pipe tích hợp sẵn bằng cách truyền các tùy chọn:

```ts
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

## Custom pipes

- Một ValidationPipe đơn giản. Ban đầu, chúng ta sẽ chỉ cần lấy một giá trị đầu vào và ngay lập tức trả về cùng một giá trị, hoạt động giống như một hàm nhận dạng.

```ts
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

- PipeTransform<T, R> là một interface chung phải được implement bằng bất kỳ pipe nào đó. Interface chung sử dụng T để chỉ ra loại value đầu vào và R để chỉ ra kiểu trả về của phương thức transform().

- Mọi pipes implement phải có phương thức transform() để đúng với việc đã implement interface PipeTransform. Phương thức này có hai tham số:

  - value
  - metadata

- Tham số value là đối số phương thức hiện đang được xử lý (trước khi nó được phương thức route handler nhận) và metadata là metadata của đối số phương thức hiện được xử lý. Đối tượng metadata có các thuộc tính sau:

```ts
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype?: Type<unknown>;
  data?: string;
}
```

![pipe](https://scontent.xx.fbcdn.net/v/t1.15752-9/p206x206/243014008_980322706148291_3828644855994943776_n.png?_nc_cat=100&ccb=1-5&_nc_sid=aee45a&_nc_ohc=yen_DyS9VRwAX-7MZfm&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=46bcf9a7f5657fad4b4df3b9df555112&oe=61776E40)

- Interface TypeScript biến mất trong quá trình chuyển đổi. Do đó, nếu kiểu của 1 tham số phương thức được khai báo là interface thay vì một class, giá trị metatype sẽ là Object.

## Class validator

- Nest hoạt động tốt với thư viện class-validator.

- Thư viện mạnh mẽ này cho phép bạn sử dụng decorator-based validation.

- Decorator-based validation cực kỳ mạnh mẽ, đặc biệt khi được kết hợp với các khả năng của Nest’s Pipe vì chúng tôi có quyền truy cập vào metatype của thuộc tính đã xử lý.

- Trước khi bắt đầu, chúng ta cần cài đặt các gói bắt buộc:
  `$ npm i --save class-validator class-transformer`

- Sau khi cài đặt, chúng ta có thể thêm một vài decorator vào lớp `CreateCatDto`. Ở đây chúng ta thấy một lợi thế đáng kể của kỹ thuật này: lớp CreateCatDto vẫn là nguồn duy nhất đúng cho đối tượng Post body của chúng ta (thay vì phải tạo một lớp validation riêng).

## Global scoped pipes

- Thiết lập nó như một phạm vi toàn cục để nó được áp dụng cho mọi route handler trên toàn bộ ứng dụng.

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

- Các Pipes toàn cục được sử dụng trên toàn bộ ứng dụng, cho mọi controller và mọi route handler.

==========================================

# 7. Guards

![Guard](https://i1.wp.com/docs.nestjs.com/assets/Guards_1.png?resize=640%2C190&ssl=1)

- Guards kiểm tra xem có quyền khi truy cập vào 1 route được định nghĩa hay không

- Guards được thực thi sau mỗi middleware, nhưng trước bất kỳ interceptor hoặc pipe.

==========================================

# 8. Interceptors

![Interceptors](https://i1.wp.com/docs.nestjs.com/assets/Interceptors_1.png?resize=640%2C302&ssl=1)

- Các Interceptors có một tập hợp các khả năng hữu ích được lấy cảm hứng từ kỹ thuật lập trình hướng khía cạnh Aspect Oriented Programming (AOP). Họ làm cho nó có thể:

  - ràng buộc logic bổ sung trước / sau khi thực thi phương thức

  - biến đổi kết quả trả về từ một hàm

  - biến đổi exception được ném ra từ một hàm

  - mở rộng hành vi function cơ bản

  - ghi đè hoàn toàn một function tùy thuộc vào các điều kiện cụ thể (ví dụ: cho mục đích lưu vào bộ nhớ đệm)

- Với mỗi interceptor triển khai phương thức `intercept()`, phương thức này nhận 2 đối số:

  - ExecutionContext

  - CallHandler

==========================================

# 9. Custom route decorators

- Một decorator ES2016 là một biểu thức trả về một hàm và có thể lấy một bộ mô tả đích, tên và thuộc tính làm đối số. Bạn áp dụng nó bằng cách đặt tiền tố cho decorator bằng ký tự @ và đặt ký tự này ở trên cùng của những gì bạn đang cố gắng trang trí. Decorators có thể được định nghĩa cho một lớp, một phương thức hoặc một thuộc tính.

## Param decorators

- Nest cung cấp một tập hợp param decorators hữu ích mà bạn có thể sử dụng cùng với các route hander HTTP.

- Dưới đây là danh sách các decorators được cung cấp và các đối tượng Express (hoặc Fastify) đơn giản mà chúng đại diện

![decorator param](https://scontent-hkg4-1.xx.fbcdn.net/v/t1.15752-9/243487587_547851199841683_589304013680892579_n.png?_nc_cat=100&ccb=1-5&_nc_sid=ae9488&_nc_ohc=kERhr8QbTbIAX8putdq&_nc_ht=scontent-hkg4-1.xx&oh=c6fc8bcd2945e7fa62c2050792ff594c&oe=61790C92)
