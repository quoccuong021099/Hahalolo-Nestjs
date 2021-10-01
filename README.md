<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# **NEST JS**

## Nest Js là gì?

- Nest Js là một framework để xây dựng các ứng dụng server side bằng Node.js hiệu quả. Sử dụng ngôn ngữ bậc cao của JS là TypeScript kết hợp với các tính chất OOP [hướng đối tượng][object oriented programming], FP [Lập trình chức năng] và FRP [Lập trình phản ứng chức năng].

## Cách tạo new project

```
 npm i -g @nestjs/cli
 nest new project-name
```

#### - Khi tạo thành công ta được 3 file chính cần xem:

1. app.controller.ts: : Chứa các router để xử lý các request và trả về response cho client.
2. app.module.ts: Root module của ứng dụng.
3. app.service.ts: Service chứa các logic mà controller sẽ dùng đến.
4. main.ts: Sử dụng NestFactory để khởi tạo ứng dụng.

## **Dependency Injection là gì?**

- Dependency Injection là kỹ thuật tách một class độc lập với các biến phụ thuộc. Trong lập trình hướng đối tượng, chúng ta luôn phải làm việc với nhiều class. Dependency là một loại quan hệ giữa hai class mà trong đó một class hoạt động độc lập và class còn lại phụ thuộc vào class kia.

## **Controller**

![controller](https://docs.nestjs.com/assets/Controllers_1.png)

- Controller chịu trách nhiệm xừ lí những request từ client side gửi lên và trả về lại response cho client
- @Controller() có nhiệm vụ liên kết các class Controller đó với request tương ứng.
- Tạo 1 controller :

```
nest g controller users
```

- Bộ decorator trong Nest JS giúp ta có thể thực hiện truy vấn vào các request cũng như xử lý response data trả về cho client

![controller](https://images.viblo.asia/01989a88-739d-407d-8c52-10d8633d8b18.png)

- Đặc biệt Nest cho phép ràng buộc dữ liệu gửi lên từ request giúp ngăn chặn những dữ liệu không hợp lệ trước khi thực hiện xử lý, đó là **DTO** [Data Transfer Object].

### **Routing**

- Sử dụng decorator @Controller() để dễ dang nhóm một tập các route liên quan.

```ts
  @Controller('users')
  export class UsersController {
      // /user
      @Get()
      findAll() {
        return 'Day la router user';
      }

```

### **Request object**

- Handler thường cần truy cập vào các chi tiết request của client. Ta có thể truy cập vào request object bằng cách inject nó bằng cách thêm @Req() vào signature của handler

```ts
  @Controller('users')
  export class UsersController {
      // /user
      @Get()
      findAll(@Req(): request: Request): string {
        return `request`;
      }

```

### **Resources**

- Để tạo các bản ghi mới ta dùng @Post()
- Nest cung cấp decorate cho tất cả các phương thức HTTP tiêu chuẩn: **@Get(), @Post(), @Put(), @Delete(), @Patch(), @Options(), and @Head()**. Ngoài ra **@All()** xác định một endpoint-handle tất cả chúng.

```ts
  @Post()
  create(): string {
    return 'This action adds a new user';
  }
```

### **Route wildcards**

- Pattern dựa trên route cũng được hỗ trợ. Ví dụ, dấu hình sao (\*) được sử dụng làm wildcard (ký tự đại diện), và sẽ khớp với bất kỳ tổ hợp ký tự nào.

```ts
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
```

### **Status code**

- Status code – response luôn mặc định là 200, ngoài trừ các POST request sẽ là 201. Ta có thể dễ dàng thay đổi hành vi này bằng thêm @HttpCode(…) decorator ở handler-level.

```ts
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new user';
}
```

### **Headers**

- Để chỉ định một tùy chỉnh response header, bạn có thể sử dụng một @Header() decorator

```ts
 @Get()
  @Header('Cache-Control', 'none')
  findAll(@Req() request: Request): string {
    return `REQUEST ${request.body.name}`;
  }
```

### **Redirection**

- Để redirect một response tới một URL cụ thể, bạn có thể sử dụng @Redirect() decorator
- @Redirect() nhận 2 đối số (arguments), url và statusCode, cả 2 đều là tùy chọn. Giá trị mặc định của statusCode is 302 (Found) nếu bị bỏ qua không truyền gì.

```ts
 @Get('/red')
  @Redirect('http://localhost:3000/info', 302)
  redirect(@Query('id') id) {
    if (id && id == 1) {
      return { url: 'http://localhost:3000/users/1' };
    }
  }
```

### **Route parameters**

- Các route với đường dẫn tĩnh sẽ không hoạt động khi bạn cần chấp nhận dữ liệu động như một phần của request (ví dụ: GET /cat/1 để nhận cat có id 1). Để xác định các route với các tham số, ta có thể thêm các token route parameter trong đường dẫn của route để nắm bắt giá trị động tại vị trí đó URL request. Token route parameter trong @Get() decorator ví dụ dưới thể hiện cách sử dụng này. Các tham số route được khai báo theo cách này có thể được truy cập bằng cách sử dụng @Param() decorator, cần được thêm vào method signature.

- @Param() được sử dụng để decorate một phương thức tham số và làm cho các tham số route có sẵn dưới dạng thuộc tính của tham số phương thức được decorated đó bên trong phần thân của phương thức.

```ts
  @Get(':id')
  findOne(
    @Param(
      'id',
    )
    id: number,
  ): User {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
```

### **Request payloads**
- DTO là một đối tượng xác định cách dữ liệu sẽ được gửi qua mạng

## **Module**

![controller](https://images.viblo.asia/13526c5b-6edc-481e-a040-3e9a0639d178.png)

- Module có nhiệm vụ đóng gói những logic liên quan của các chức năng cần triển khai đến client một cách độc lập. Một module trong Nest là class được define với **@Module ()**. **@Module ()** sẽ cung cấp metadata mà Nest sử dụng để tổ chức cấu trúc ứng dụng. Một file module cơ bản sẽ như sau:

```TypeScript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

- Trong một module sẽ bao gồm các thành phần chính sau đây:

  - **providers**: Có nhiệm vụ khởi tạo và cung cấp các service mà sẽ được controller trong module sẽ sử dụng đến.
  - **controllers**: Có nhiệm vụ khởi tạo những controller đã được xác định trong module.
  - **imports**: Có nhiệm vụ import những thành phần của một module khác mà module sẽ sử dụng.
  - **exports**: Có nhiệm vụ export các thành phần của provider và các module khác sẻ import để sử dụng.

- Cách tạo 1 module

```
 nest g module users
```

#### **Share Module**

- Bạn có thể chia sẻ bất kì provider nào trong module hiện tại cho các module khác
- Ví dụ bạn có thể chia sẻ UserService cho các module khác sử dụng bằng cách thêm nó vào mảng exports trong users.module.ts như sau.

```TypeScript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
```

- Sau khi export, các module khác đều có thể import UsersModule và truy cập vào UsersService để sử dụng.

#### **Global Module**

- Nếu bạn không muốn phải import một module nào đó quá nhiều lần thì Nest cung cấp @Global() cho phép bạn sử một module từ module khác mà không cần import. Như vậy chúng ta có thể sử dụng service của các module khác rất dễ dàng . Chỉ cần thêm @Global() như dưới đây là có thể biến nó trở thành global module.

```TypeScript
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

## **Providers**

![Providers](https://images.viblo.asia/51c7a63b-07cc-4585-b610-3aa8386c0bd1.png)

- **Provider** là nơi cung cấp các serivce, repositories, factories, helpers,... cho controller trong một module sử dụng. Đây cũng là nơi sẽ chứa những logic xử lý đã được tách biệt với controller. Để tạo ra một provider chúng ta chỉ cần khai báo @Injectable () trước một class đã định nghĩa. Việc sử dụng @Injectable() sẽ cho Nest biết đây là một class thuộc provider. Để tạo ra một service nơi mà chứa các logic xử lý của UserController, chúng ta hãy tạo ra một UserService trong file user.service.ts dưới đây hoặc sử dụng

```
nest g service users
```

```TypeScript
import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(user: User) {
    this.users.push(users);
  }

  findAll(): User[] {
    return this.users;
  }
```

## **Middleware**

![middleware](https://images.viblo.asia/ae44463f-3823-4768-ab76-cb2aec197a76.png)

- Middleware là 1 function được gọi trước router handler. Middleware có thể truy cập vào đối tượng **request** và **response**, và gọi **next()** để gọi đến **middlewave** tiếp theo trong chu kì request-response của ứng dụng.

#### **- Nhiệm vụ middleware**

- Thực thi một đoạn code bất kì.
- Thay đổi đối tượng request và response.
- Kết thúc chu kì request-response.
- Gọi middlewave tiếp theo trong chuổi middleware.
- Nếu middlewave hiện tại không kết thúc chu kỳ request-response, thì nó cần phải gọi next() để chuyển quyền điều kiển đến middlewave tiếp theo. Nếu không request sẽ bị treo.

#### **- Triển khai middeware bằng class hoặc function**

- **Class**

  - Bạn triển khai middleware Nest tùy chỉnh trong một hàm hoặc trong một class với @Injectable() decorator. Lớp nên implement interface NestMiddleware.

    ```TypeScript
      @Injectable()
      export class DemoClassMiddeWare implements NestMiddleware {
      use(req: Request, res: Response, next: NextFunction) {
        const user: User = req.body;
        if (user.age > 15) {
          user.nameMid = 'class middleware';
        }
        next();
      }
      }
    ```

- **Function**

  - Chúng ta cũng có thể sử dụng hàm để viết Middeware

    ```TypeScript
        export function loggerMiddleware(
        req: Request,
        res: Response,
        next: NextFunction,
      ) {
        console.log(req.body);

        const users: User = req.body;
        users.isAdult = false;
        if (users.age > 15) {
          users.isAdult = true;
        }
        // console.log('res', res);
        console.log(`Call MDW`);
        next();
      }
    ```

#### **- Applying middleware**

- Cách thêm middleware đối với một phương thức yêu cầu cụ thể bằng cách chuyển một đối tượng chứa đường dẫn route và phương thức request đến phương thức forRoutes() khi định cấu hình middleware

  ```TypeScript
  export class AppModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(loggerMiddleware, DemoClassMiddeWare)
        .forRoutes({ path: 'users', method: RequestMethod.POST });
    }
  }
  ```

#### **- Middleware consumer**

- **MiddlewareConsumer** là một class helper. Nó cung cấp một số phương pháp tích hợp middleware.
- Phương thức **forRoutes()** có thể nhận được 1 chuỗi đơn, nhiều chuỗi, 1 đối tượng RouteInfo, 1 lớp controller và thậm chí nhiều lớp controller
- Phương thức **apply()** có thể lấy 1 middleware duy nhất hoặc nhiều đối số để chỉ định nhiều middlewares

#### **- Excluding routes**

- Đôi khi chúng tôi muốn loại trừ một số route nhất định khỏi việc áp dụng middleware. Chúng ta có thể dễ dàng loại trừ các route nhất định bằng phương thức **exclude()**. Phương pháp này có thể lấy một chuỗi đơn, nhiều chuỗi hoặc một đối tượng RouteInfo xác định các route bị loại trừ, như được hiển thị bên dưới:

  ```TypeScript
  export class AppModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(loggerMiddleware, DemoClassMiddeWare)
        .exclude({
          path: 'users',
          method: RequestMethod.GET,
        })
        .forRoutes(UsersController);
    }
  }
  ```

#### **- Global middleware**

- Nếu chúng tôi muốn liên kết middleware với mọi route đã đăng ký cùng một lúc, chúng tôi có thể sử dụng phương thức **use()** được cung cấp bởi thực thể INestApplication:
  ```TypeScript
  // sử dụng ở file main.ts
    app.use(loggerMiddleware);
  ```

## **Exception filters**

- Nest đi kèm với một lớp **exception tích hợp**, lớp này chịu trách nhiệm xử lý tất cả các trường hợp exception chưa được xử lý trên một ứng dụng. Khi một exception không được mã ứng dụng của bạn xử lý, nó sẽ bị lớp này bắt giữ, lớp này sau đó sẽ tự động gửi một phản hồi thân thiện với người dùng thích hợp.

```TypeScript
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

#### **Throwing standard exceptions**

- Nest cung cấp lớp HttpException tích hợp sẵn, được hiển thị từ gói @nestjs/common. Đối với các ứng dụng dựa trên API HTTP REST / GraphQL điển hình, cách tốt nhất là gửi các đối tượng response HTTP tiêu chuẩn khi các điều kiện lỗi nhất định xảy ra.

```TypeScript
@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
=> {
  "statusCode": 403,
  "message": "Forbidden"
}
```

- Để chỉ ghi đè phần thông báo của body response JSON ta dùng error.
  ra.

```TypeScript
@Get()
async findAll() {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error:"This is a custom message!!!"
  }, HttpStatus.FORBIDDEN);
}
=> {
  "statusCode": 403,
  "message": "Forbidden"
}
```

#### **- Custom exceptions**

- Trong nhiều trường hợp, bạn sẽ không cần phải viết các exception tùy chỉnh và có thể sử dụng exception Nest HTTP tích hợp sẵn, như được mô tả trong phần tiếp theo. Nếu bạn cần tạo các exception tùy chỉnh, bạn nên tạo hệ thống phân cấp exception của riêng mình, nơi các exception tùy chỉnh của bạn kế thừa từ lớp HttpException cơ sở.

```TypeScript
export class ForbiddenExceptionC extends HttpException {
  constructor() {
    super('Custom Exception', HttpStatus.FORBIDDEN);
  }
}

throw new ForbiddenExceptionC();

```

#### **- Built-in HTTP exceptions**

- Nest cung cấp một tập hợp các exception tiêu chuẩn kế thừa từ HttpException cơ sở. Chúng được hiển thị từ gói @nestjs/common và đại diện cho nhiều exception HTTP phổ biến nhất:
  https://docs.nestjs.com/exception-filters#built-in-http-exceptions

## **Pipe**

- **Pipe** được định nghĩa là một class được chú thích bởi một **@Injectable()** **decorator**, và **implement** từ **PipeTransform interface**
- **Pipes** thường được sử dụng trong hai trường hợp cơ bản sau:

  - **transformation**: chuyển đổi dữ liệu đầu vào thành dạng dữ liệu mong muốn, ví dụ chuyển đổi từ dạng string sang integer.

    - Ở ví dụng e sử dụng những Binding pipes để demo như là **ParseIntPipe, ParseFloatPipe**

    ```TypeScript
    @Get(':id')
    findOne(
    @Param(
      'id',
      ParseIntPipe,
    )
    id: number,
    ): User {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
    }
    ```

    - Điều này đảm bảo rằng một trong 2 điều kiện sau là đúng: hoặc tham số chúng tôi nhận được trong phương thức findById() là một số (như mong đợi trong lệnh gọi this.usersService.findById(id) hoặc một exception được ném ra trước route handler được gọi.
    - Exception sẽ ngăn body của phương thức findById() thực thi.
    - Ví dụ: http://localhost:3000/users/lll
    - Kết quả:
      ```TypeScript
        {
        "statusCode": 406,
        "message": "Validation failed (numeric string is expected)",
        "error": "Bad Request"
        }
      ```
    - Chúng ta có thể chuyển một instance tại chỗ. Truyền một instance tại chỗ rất hữu ích nếu chúng ta muốn tùy chỉnh hành vi của pipe tích hợp sẵn bằng cách truyền các tùy chọn:

    ```TypeScript
     @Get(':id')
    findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    ): User {
    const user = this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
    }
    ```

  - **validation**: Kiểm tra dữ liệu đầu vào và báo lỗi nếu như dữ liệu đó không thoả mãn điều kiện.
    - Ở ví dụ e sử dụng class-validator để demo pipes global
    - https://github.com/typestack/class-validator

## **Guards**

- Một **Guard** là một lớp được chú thích bằng decorator **@Injectable()**. Các Guards phải implement interface **CanActivate**.
  ![guards](https://i1.wp.com/docs.nestjs.com/assets/Guards_1.png?resize=640%2C190&ssl=1)
- Các Guards có một single responsibility. Họ xác định xem một request nhất định sẽ được xử lý bởi route handler hay không, tùy thuộc vào các điều kiện nhất định (như quyền/permissons, vai trò/roles, ACLs, v.v.) hiện có tại thời điểm chạy. Điều này thường được gọi là ủy quyền/authorization. Ủy quyền/Authorization (và người anh em họ của nó, xác thực/authentication, mà nó thường cộng tác) thường được xử lý bởi middleware trong các ứng dụng Express truyền thống. Middleware là một lựa chọn tốt để xác thực/authentication, vì những thứ như token validation thông báo và đính kèm thuộc tính vào request object không được kết nối chặt chẽ với ngữ cảnh route cụ thể (và metadata của nó).

- Nhưng middleware, về bản chất, là ngu ngốc. Nó không biết handler nào sẽ được thực thi sau khi gọi hàm next(). Mặt khác, Guards có quyền truy cập vào instance ExecutionContext và do đó biết chính xác những gì sẽ được thực thi tiếp theo. Chúng được thiết kế, giống như exception filters, pipes và interceptors, để cho phép bạn sử dụng logic xử lý chính xác vào đúng điểm trong chu kỳ request/response và làm như vậy một cách khai báo. Điều này giúp giữ cho code của bạn DRY và dễ khai báo.
- Guards được thực thi sau mỗi middleware, nhưng trước bất kỳ interceptor hoặc pipe.

## **- Interceptors**

- Một Interceptor là một lớp được chú thích bằng decorator @Injectable(). Các Interceptors phải implement interface NestInterceptor.
  ![Interceptors](https://i1.wp.com/docs.nestjs.com/assets/Interceptors_1.png?resize=640%2C302&ssl=1)
- Các Interceptors có một tập hợp các khả năng hữu ích được lấy cảm hứng từ kỹ thuật lập trình hướng khía cạnh Aspect Oriented Programming (AOP). Họ làm cho nó có thể:
  - Ràng buộc logic bổ sung trước / sau khi thực thi phương thức
  - Biến đổi kết quả trả về từ một hàm
  - Biến đổi exception được ném ra từ một hàm
  - Mở rộng hành vi function cơ bản
  - Ghi đè hoàn toàn một function tùy thuộc vào các điều kiện cụ thể (ví dụ: cho mục đích lưu vào bộ nhớ đệm)

## Custom providers

























<!-- Những thứ k hiểu
- Controller 
  - Sub-Domain Routing
  - Scopes


 -->