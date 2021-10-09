<!-- # 5. Middleware

- Middleware là một hàm được gọi trước khi tới handler route. Các hàm middleware có quyền truy cập vào các object request và response cũng như hàm middleware next() trong chu trình request-response của ứng dụng. Hàm middlware next thường được ký hiệu bằng một biến có tên là next.

  ![Middleware](https://docs.nestjs.com/assets/Middlewares_1.png)

- Các hàm Middleware có thể thực hiện các nhiệm vụ sau:

  - Thực thi bất kỳ mã nào.
  - Thực hiện các thay đổi đối với request và response object.
  - Kết thúc chu kỳ request-response.
  - Gọi hàm middleware tiếp theo trong ngăn xếp.
  - Nếu hàm middleware hiện tại không kết thúc chu kỳ request-response, nó phải gọi next() để chuyển quyền điều khiển cho hàm middleware tiếp theo. Nếu không, request sẽ bị treo.

- Triển khai middleware trong một hàm hoặc trong một class với @Injectable() decorator. Lớp nên implement interface NestMiddleware, trong khi hàm này không có bất kỳ yêu cầu đặc biệt nào.

- Triển khai một tính năng middleware đơn giản bằng cách sử dụng phương thức lớp:

  ```ts
  import { Injectable, NestMiddleware } from "@nestjs/common";
  import { Request, Response, NextFunction } from "express";

  @Injectable()
  export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      console.log("Request...");
      next();
    }
  }
  ```

## Dependency injection:

- Middleware hỗ trợ đầy đủ Dependency Injection. Cũng như với các provider và controller, có thể inject dependencies có sẵn trong cùng một mô-đun. Như thường lệ, điều này được thực hiện thông qua construstor.

## Applying middleware:

- Không có chỗ cho middleware trong @Module() decorator. Thay vào đó thiết lập chúng bằng phương thức configure() của lớp mô-đun. Các mô-đun bao gồm middleware phải triển khai interface NestModule.

- Thiết lập LoggerMiddleware ở cấp AppModule:

  ```ts
  import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
  import { LoggerMiddleware } from "./common/middleware/logger.middleware";
  import { CatsModule } from "./cats/cats.module";

  @Module({
    imports: [CatsModule],
  })
  export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes("cats");
    }
  }
  ```

- Có thể hạn chế thêm middleware đối với một phương thức yêu cầu cụ thể bằng cách chuyển một đối tượng chứa đường dẫn route và phương thức request đến phương thức forRoutes() khi định cấu hình middleware.

  ```ts
  import {
    Module,
    NestModule,
    RequestMethod,
    MiddlewareConsumer,
  } from "@nestjs/common";
  import { LoggerMiddleware } from "./common/middleware/logger.middleware";
  import { CatsModule } from "./cats/cats.module";

  @Module({
    imports: [CatsModule],
  })
  export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(LoggerMiddleware)
        .forRoutes({ path: "cats", method: RequestMethod.GET });
    }
  }
  ```

## Route wildcards:

- Pattern dựa trên route cũng được hỗ trơ. Ví dụ, dấu sao (\*) được sử dụng làm ký tự đại diện và sẽ khớp với bất kỳ tổ hợp ký tự nào:

  ```ts
  forRoutes({ path: "ab*cd", method: RequestMethod.ALL });
  ```

- Đường dẫn route 'ab*cd' sẽ khớp với abcd, ab_cd, abecd và vân vân. Những ký tự ?, -, *, và () có thể được sử dụng trong đường dẫn route, và là các tập con của các regular expression counterparts của chúng.

## Middleware consumer:

- MiddlewareConsumer là một class helper. Nó cung cấp một số phương pháp tích hợp middleware. Tất cả chúng có thể được xâu chuỗi 1 cách đơn giản. Phương thức forRoutes() có thể nhận được 1 chuỗi đơn, nhiều chuỗi, 1 đối tượng RouteInfo, 1 lớp controller và thậm chí nhiều lớp controller.Trong hầu hết các trường hợp, có thể sẽ chỉ chuyển 1 danh sách các controller được phân tách bằng dấu phẩy.
  Dưới đây là 1 ví dụ với 1 controller duy nhất:

  ```ts
  import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
  import { LoggerMiddleware } from "./common/middleware/logger.middleware";
  import { CatsModule } from "./cats/cats.module";
  import { CatsController } from "./cats/cats.controller.ts";

  @Module({
    imports: [CatsModule],
  })
  export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(LoggerMiddleware).forRoutes(CatsController);
    }
  }
  ```

## Excluding routes:

- Loại trừ một số route nhất định khỏi việc áp dụng middleware. Loại trừ các route nhất định bằng phương thức exclude(). Phương pháp này có thể lấy một chuỗi đơn, nhiều chuỗi hoặc một đối tượng RouteInfo xác định các route bị loại trừ, như được hiển thị bên dưới:

  ```ts
  consumer
    .apply(LoggerMiddleware)
    .exclude(
      { path: "cats", method: RequestMethod.GET },
      { path: "cats", method: RequestMethod.POST }
    )
    .forRoutes(CatsController);
  ```

## Functional middleware:

```ts
import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

## Multiple middleware:

- Như đã đề cập ở trên, để liên kết nhiều middleware được thực thi tuần tự, chỉ cần cung cấp một danh sách được phân cách bằng dấu phẩy bên trong phương thức apply():

  ```ts
  consumer.apply(cors(), helmet()).forRoutes(CatsController);
  ```

## Global middleware:

- Nếu muốn liên kết middleware với mọi route đã đăng ký cùng một lúc, có thể sử dụng phương thức use() được cung cấp bởi INestApplication:

  ```ts
  const app = await NestFactory.create(AppModule);
  app.use(logger);
  await app.listen(3000);
  ```

# 6. Exception filters

- Nest đi kèm với một lớp exception tích hợp, lớp này chịu trách nhiệm xử lý tất cả các trường hợp exception chưa được xử lý trên một ứng dụng. Khi một exception không được ứng dụng xử lý, nó sẽ bị lớp này bắt giữ, lớp này sau đó sẽ tự động gửi một phản hồi với người dùng.

![Exceptionfilters](https://docs.nestjs.com/assets/Filter_1.png)

- Ngoài ra, hành động này được thực hiện bởi một bộ lọc exception chung tích hợp sẵn, bộ lọc này xử lý các exception của kiểu HttpException. Khi một ngoại lệ không được công nhận (không phải là HttpException cũng không phải là một lớp kế thừa từ HttpException), bộ lọc exception tích hợp sẽ tạo ra phản hồi JSON mặc định sau:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Throwing standard exceptions

- Nest cung cấp lớp HttpException tích hợp sẵn, được hiển thị từ gói @nestjs/common. Đối với các ứng dụng dựa trên API HTTP REST / GraphQL điển hình, cách tốt nhất là gửi các đối tượng response HTTP tiêu chuẩn khi các điều kiện lỗi nhất định xảy ra.

- Hàm tạo HttpException nhận hai đối số bắt buộc để xác định phản hồi:

  - Đối số response xác định body response JSON. Nó có thể là 1 string hoặc 1 object.
  - Đối số status được định nghĩa như ở HTTP status code.

- Theo mặc định, body response JSON chứa hai thuộc tính:

  - statusCode: mặc định thành HTTP status code được cung cấp ở đối số status
  - message: một đoạn mô ta ngắn về lỗi HTTP dựa trên status

- Để chỉ ghi đè phần thông báo của body response JSON, hãy cung cấp một string trong đối số response. Để ghi đè toàn bộ body response JSON, hãy chuyển một đối tượng vào đối số response. Nest sẽ chuyển hóa đối tượng và trả về nó dưới dạng body response JSON.

- Đối số phương thức khởi tạo thứ hai – status – phải là HTTP status code hợp lệ. Cách tốt nhất là sử dụng enum HttpStatus được nhập từ @nestjs/common.

  ```ts
  @Get()
  async findAll() {
      throw new HttpException({
          status: HttpStatus.FORBIDDEN,
          error: 'This is a custom message',
      }, HttpStatus.FORBIDDEN);
  }
  ```

- Response sẽ trông như này:

  ```json
  {
    "status": 403,
    "error": "This is a custom message"
  }
  ```

## Custom exceptions:

- Trong nhiều trường hợp sẽ không cần phải viết các exception tùy chỉnh và có thể sử dụng exception Nest HTTP tích hợp sẵn, như được mô tả trong phần tiếp theo. Nếu cần tạo các exception tùy chỉnh thì nên tạo hệ thống phân cấp exception của riêng mình, nơi các exception tùy chỉnh kế thừa từ lớp HttpException cơ sở. Với cách tiếp cận này, Nest sẽ nhận ra các trường hợp exception và tự động xử lý các response lỗi.

- Custom Exception như vậy:

  ```ts
  export class ForbiddenException extends HttpException {
    constructor() {
      super("Forbidden", HttpStatus.FORBIDDEN);
    }
  }
  ```

- Vì ForbiddenException mở rộng HttpException cơ sở, nó sẽ hoạt động liền mạch với exception handler được tích hợp sẵn và do đó chúng ta có thể sử dụng nó bên trong phương thức findAll().

  ```ts
  @Get()
  async findAll() {
      throw new ForbiddenException();
  }
  ```

## Built-in HTTP exceptions:

- Nest cung cấp một tập hợp các exception tiêu chuẩn kế thừa từ HttpException. Chúng được hiển thị từ gói @nestjs/common.

- Các exception HTTP phổ biến nhất:
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

## Exception filters:

- Mặc dù exception filters cơ sở có thể tự động xử lý nhiều trường hợp, ta có thể muốn toàn quyền kiểm soát lớp exception.

- Hãy tạo một exception filters chịu trách nhiệm bắt các exception là một instance của lớp HttpException và triển khai logic response tùy chỉnh cho chúng. Để làm điều này thì sẽ cần truy cập vào các đối tượng Request và Respose của nền tảng cơ bản. Truy cập đối tượng Request để có thể lấy ra url ban đầu và đưa url đó vào thông tin ghi nhật ký. Sử dụng đối tượng Response để kiểm soát trực tiếp response được gửi bằng cách sử dụng phương thức response.json().

  ```ts
  import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from "@nestjs/common";
  import { Request, Response } from "express";

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

- @Catch(HttpException) decorator liên kết metadata bắt buộc với bộ lọc exception, cho Nest biết rằng bộ lọc cụ thể này đang tìm kiếm các exception của loại HttpException và không có gì khác. @Catch() decorator có thể nhận một tham số duy nhất hoặc một danh sách được phân tách bằng dấu phẩy. Điều này cho phép thiết lập bộ lọc cho một số loại exception cùng một lúc.

## Arguments host:

- Hãy xem các tham số của phương thức catch(). Tham số exception là đối tượng exception hiện đang được xử lý. Tham số máy chủ lưu trữ là một đối tượng ArgumentsHost. ArgumentsHost là một đối tượng tiện ích mạnh mẽ mà chúng ta sẽ xem xét kỹ hơn trong chương ngữ cảnh thực thi. Trong mẫu mã này, chúng tôi sử dụng nó để lấy tham chiếu đến các đối tượng Request và Response đang được chuyển đến response handler ban đầu.

## Binding filters:

- Hãy liên kết HttpExceptionFilter với phương thức create() của CatsController.

  ```ts
  @Post()
  @UseFilters(new HttpExceptionFilter())
  async create(@Body() createCatDto: CreateCatDto) {
    throw new ForbiddenException();
  }
  ```

- Ở trên đã sử dụng @UseFilters() decorator ở đây. Tương tự như @Catch() decorator, nó có thể sử dụng một instance bộ lọc duy nhất hoặc một danh sách các instance bộ lọc được phân tách bằng dấu phẩy. Ở đây đã tạo instance HttpExceptionFilter tại chỗ. Ngoài ra có thể truyền qua lớp (thay vì một instance), để lại trách nhiệm khởi tạo cho khung và cho phép dependency injection.

- Thiết lập bộ lọc dưới dạng phạm vi controller:

  ```ts
  @UseFilters(new HttpExceptionFilter())
  export class CatsController {}
  ```

- Cấu trúc này thiết lập HttpExceptionFilter cho mọi route handler được xác định bên trong CatsController.

- Tạo bộ lọc phạm vi toàn cục:

  ```ts
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.listen(3000);
  }
  bootstrap();
  ```

- Bộ lọc phạm vi toàn cục được sử dụng trên toàn bộ ứng dụng, cho mọi controller và mọi route handler.

## Catch everything:

- Để bắt mọi exception chưa được xử lý (bất kể loại exception), hãy để trống danh sách tham số của @Catch() decorator.
- Ví dụ: @Catch()

  ```ts
  import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from "@nestjs/common";

  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();

      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
  ```

- Trong ví dụ trên, bộ lọc sẽ bắt từng exception được ném ra, bất kể loại (lớp) của nó.

## Inheritance:

- Thông thường sẽ tạo các bộ lọc exception hoàn toàn tùy chỉnh được tạo thủ công để đáp ứng các yêu cầu ứng dụng. Tuy nhiên, có thể có các trường hợp sử dụng khi chỉ muốn mở rộng bộ lọc exception chung mặc định được tích hợp sẵn và ghi đè hành vi dựa trên các yếu tố nhất định.

- Để ủy quyền xử lý exception cho bộ lọc cơ sở, cần mở rộng BaseExceptionFilter và gọi phương thức catch() được kế thừa.

  ```ts
  import { Catch, ArgumentsHost } from "@nestjs/common";
  import { BaseExceptionFilter } from "@nestjs/core";

  @Catch()
  export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
      super.catch(exception, host);
    }
  }
  ```

# 7. Pipe

- Một Pipe là một lớp được chú thích bằng @Injectable(). Pipes nên triển khai interface PipeTransform.

![Pipe](https://docs.nestjs.com/assets/Pipe_1.png)

- Pipes có hai trường hợp sử dụng điển hình:

  - Transformation: chuyển đổi dữ liệu đầu vào sang dạng mong muốn (ví dụ: từ chuỗi thành số nguyên)
  - Validation: đánh giá dữ liệu đầu vào và nếu hợp lệ, chỉ cần chuyển nó qua không thay đổi; nếu không ném một exception khi dữ liệu không chính xác

## Built-in pipes:

- Nest đi kèm với 6 pipes có sẵn dùng được ngay:

  - ValidationPipe
  - ParseIntPipe
  - ParseBoolPipe
  - ParseArrayPipe
  - ParseUUIDPipe
  - DefaultValuePipe

## Binding pipes:

- Để sử dụng một pipe thì cần liên kết một instance của lớp pipe với ngữ cảnh thích hợp. Trong ví dụ ParseIntPipe, ta muốn liên kết pipe với một phương thức route handler cụ thể và đảm bảo rằng nó chạy trước khi phương thức được gọi. Làm như vậy với cấu trúc sau thì đó sẽ là ràng buộc pipe ở cấp tham số phương thức:

  ```ts
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
      return this.catsService.findOne(id);
  }
  ```

- Giả sử route được gọi như sau:

  ```
  GET localhost:3000/abc
  ```

- Nest sẽ đưa ra một exception như thế này:

  ```json
  {
    "statusCode": 400,
    "message": "Validation failed (numeric string is expected)",
    "error": "Bad Request"
  }
  ```

- Exception sẽ ngăn body của phương thức findOne() thực thi.

## Custom pipes:

- Có thể xây dựng các pipes tùy chỉnh của riêng mình. Mặc dù Nest cung cấp ParseIntPipe và ValidationPipe tích hợp mạnh mẽ.

  ```ts
  import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

  @Injectable()
  export class ValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      return value;
    }
  }
  ```

- Mọi pipes implement phải có phương thức transform() để đúng với việc đã implement interface PipeTransform. Phương thức này có hai tham số:

  - value: là đối số phương thức hiện đang được xử lý (trước khi nó được phương thức route handler nhận).
  - metadata: là đối số phương thức hiện được xử lý

  - Đối tượng metadata có các thuộc tính sau:
    - type: Cho biết đối số là body @Body(), truy vấn @Query(), param @Param(),...
    - metatype: Cung cấp metatype của đối số, ví dụ: String, [Function: String].
    - data: String được truyền tới decorator, ví dụ @Body(‘string’).

## Schema based validation:

- Làm cho pipe validation hữu ích hơn. Hãy xem xét kỹ hơn phương thức create() của CatsController, ta có thể muốn đảm bảo rằng đối tượng post body là hợp lệ trước khi cố gắng chạy phương thức service.

  ```ts
  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
      this.catsService.create(createCatDto);
  }
  ```

- Tham số body createCatDto loại của nó là CreateCatDto:

  ```ts
  export class CreateCatDto {
    name: string;
    age: number;
    breed: string;
  }
  ```

- Để đảm bảo rằng bất kỳ request nào đến phương thức tạo (createCatDto) đều chứa một body hợp lệ. Vì vậy phải validate ba thành phần của đối tượng createCatDto.

## Object schema validation:

- Thư viện Joi cho phép tạo các lược đồ một cách đơn giản, với một API có thể đọc được. Xây dựng một pipe valiodation sử dụng các lược đồ dựa trên Joi.

- Bắt đầu bằng cách cài đặt thư viện Joi:

  ```npm
  $ npm install --save joi
  $ npm install --save-dev @types/joi
  ```

- Tạo một lớp đơn giản lấy một lược đồ làm đối số phương thức khởi tạo. Sau đó áp dụng phương thức schema.validate(), phương thức này xác thực đối số đến so với lược đồ đã cung cấp.

- Một pipe validation trả về giá trị không thay đổi hoặc ném một exception.

  ```ts
  import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
  } from "@nestjs/common";
  import { ObjectSchema } from "joi";

  @Injectable()
  export class JoiValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    transform(value: any, metadata: ArgumentMetadata) {
      const { error } = this.schema.validate(value);
      if (error) {
        throw new BadRequestException("Validation failed");
      }
      return value;
    }
  }
  ```

## Binding validation pipes:

- Trong trường hợp này muốn liên kết pipe ở cấp độ gọi phương thức. Cần làm như sau để sử dụng JoiValidationPipe:

  - Tạo một instance của JoiValidationPipe.
  - Truyền lược đồ theo ngữ cảnh cụ thể trong hàm tạo của Pipe.
  - Ràng buộc pipe với phương thức.

- Làm điều đó bằng cách sử dụng @UsePipes() decorator như được hiển thị bên dưới:

  ```ts
  @Post()
  @UsePipes(new JoiValidationPipe(createCatSchema))
  async create(@Body() createCatDto: CreateCatDto) {
      this.catsService.create(createCatDto);
  }
  ```

## Class validator:

- Nest hoạt động tốt với thư viện class-validator. Thư viện mạnh mẽ này cho phép sử dụng decorator-based validation.

- Cài đặt:

  ```
  $ npm i --save class-validator class-transformer
  ```

- Sau khi cài đặt thì có thể thêm một vài decorator vào lớp CreateCatDto.

  ```ts
  import { IsString, IsInt } from "class-validator";

  export class CreateCatDto {
    @IsString()
    name: string;

    @IsInt()
    age: number;

    @IsString()
    breed: string;
  }
  ```

- Có thể tạo một lớp ValidationPipe sử dụng các chú thích này.

  ```ts
  import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
  } from "@nestjs/common";
  import { validate } from "class-validator";
  import { plainToClass } from "class-transformer";

  @Injectable()
  export class ValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }
      const object = plainToClass(metatype, value);
      const errors = await validate(object);
      if (errors.length > 0) {
        throw new BadRequestException("Validation failed");
      }
      return value;
    }

    private toValidate(metatype: Function): boolean {
      const types: Function[] = [String, Boolean, Number, Array, Object];
      return !types.includes(metatype);
    }
  }
  ```

- Bước cuối cùng là liên kết ValidationPipe. Các pipes có thể là phạm vi tham số, phạm vi phương pháp, phạm vi controller hoặc phạm vi toàn cục.

  ```ts
  @Post()
  async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto,
  ) {
  this.catsService.create(createCatDto);
  }
  ```

## Global scoped pipes:

- Vì ValidationPipe được tạo ra có thể dùng chung nên thiết lập nó phạm vi toàn cục để được áp dụng cho mọi route handler trên toàn bộ ứng dụng.

  ```ts
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
  }
  bootstrap();
  ```

## Providing defaults:

- Parse* pipes mong đợi giá trị của một tham số được xác định. Nó ném một ngoại lệ khi nhận các giá trị null hoặc undefined. Để cho phép một endpoint xử lý các giá trị tham số chuỗi truy vấn bị thiếu, phải cung cấp một giá trị mặc định được đưa vào trước khi các Parse* pipes hoạt động trên các giá trị này. DefaultValuePipe phục vụ mục đích đó. Chỉ cần khởi tạo một DefaultValuePipe trong @Query() decorator trước Parse\* pipe có liên quan:

  ```ts
  @Get()
  async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {
  return this.catsService.findAll({ activeOnly, page });
  }
  ``` -->

# FUNDAMENTALS

## 1. Injection scopes

### 1.1. Provider scope

Một provider có thể có bất kỳ phạm vi nào sau đây:

- `DEFAULT`: Một instance duy nhất của provider được chia sẻ trên toàn bộ ứng dụng. Thời gian tồn tại của instance được gắn trực tiếp với vòng đời của ứng dụng. Khi ứng dụng đã được khởi động, tất cả các provider singleton đã được khởi tạo. Phạm vi Singleton được sử dụng theo mặc định.

- `REQUEST`: Một instance mới của provider được tạo riêng cho mỗi request đến. Instance được thu thập sau khi request hoàn tất quá trình xử lý.

- `TRANSIENT`: Các providers transient không được chia sẻ cho người dùng. Mỗi người injects vào một transient provider sẽ nhận được một instance mới.

### 1.2. Usage

Chỉ định phạm vi inject bằng cách truyền thuộc tính `Scope` cho đối tượng tùy chọn decorator @Injectable():

```ts
import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

Tương tự, đối với các custom providers, hãy đặt thuộc tính `Scope` trong biểu mẫu dài hạn cho đăng ký provider:

```ts
{
  provide: 'CACHE_MANAGER',
  useClass: CacheManager,
  scope: Scope.TRANSIENT,
}
```

Phạm vi Singleton được sử dụng theo mặc định và không cần khai báo. Nếu bạn muốn khai báo một provider là phạm vi singleton, hãy sử dụng giá trị Scope.DEFAULT cho thuộc tính scope.

### 1.3. Controller scope

Controllers cũng có thể có phạm vi, áp dụng cho tất cả các phương thức request handlers được khai báo trong controller đó. Giống như phạm vi provider, phạm vi của controller khai báo thời gian tồn tại của nó. Đối với controller phạm vi request, một instance mới được tạo cho mỗi request gửi đến và được thu thập khi request đã hoàn tất xử lý.

Khai báo phạm vi controller với thuộc tính scope của đối tượng ControllerOptions:

```ts
@Controller({
  path: "cats",
  scope: Scope.REQUEST,
})
export class CatsController {}
```

### 1.4. Scope hierarchy

Một controller phụ thuộc vào provider phạm vi request, bản thân nó, sẽ được xác định phạm vi request.

Đồ thị phụ thuộc sau: CatsController <- CatsService <- CatsRepository. Nếu CatsService nằm trong phạm vi request (và những cái khác là singletons mặc định), CatsController sẽ trở thành phạm vi request vì nó phụ thuộc vào service được đưa vào. CatsRepository, không phụ thuộc, sẽ vẫn ở phạm vi singleton.

### 1.5. Request provider

Trong ứng dụng dựa trên máy chủ HTTP (ví dụ: sử dụng @nestjs/platform-express hoặc @nestjs/platform-fastify), có thể muốn truy cập tham chiếu đến đối tượng request ban đầu khi sử dụng các providers phạm vi request. Có thể làm điều này bằng cách inject đối tượng REQUEST.

```ts
import { Injectable, Scope, Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  constructor(@Inject(REQUEST) private request: Request) {}
}
```

Do sự khác biệt cơ bản về platform/protocol, truy cập vào request gửi đến hơi khác đối với các ứng dụng Microservice hoặc GraphQL. Trong các ứng dụng GraphQL, inject CONTEXT thay vì REQUEST:

```ts
import { Injectable, Scope, Inject } from "@nestjs/common";
import { CONTEXT } from "@nestjs/graphql";

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  constructor(@Inject(CONTEXT) private context) {}
}
```

Sau đó, cấu hình giá trị context của mình (trong GraphQLModule) để chứa request làm thuộc tính của nó.

### 1.6. Performance

Việc sử dụng các providers theo phạm vi request sẽ có tác động đến hiệu suất ứng dụng. Mặc dù Nest cố gắng lưu vào bộ nhớ cache càng nhiều metadata càng tốt, Nest vẫn phải tạo một instance lớp theo từng request. Do đó, nó sẽ làm chậm thời gian phản hồi trung bình và kết quả đo điểm chuẩn tổng thể. Trừ khi provider phải có phạm vi request, bạn nên sử dụng phạm vi singleton mặc định.

## 2. Circular dependency

Sự phụ thuộc vòng tròn xảy ra khi hai lớp phụ thuộc vào nhau. Ví dụ: lớp A cần lớp B và lớp B cũng cần lớp A. Các phụ thuộc vòng tròn có thể phát sinh trong Nest giữa các mô-đun và giữa các providers.

Mặc dù nên tránh các phụ thuộc vòng tròn nếu có thể, nhưng không phải lúc nào cũng có thể làm như vậy. Trong những trường hợp như vậy, Nest cho phép giải quyết sự phụ thuộc vòng tròn giữa các providers theo các cách.

### 2.1. Forward reference

Tham chiếu chuyển tiếp cho phép Nest tham chiếu đến các lớp chưa được xác định bằng cách sử dụng hàm forwardRef().

Ví dụ: nếu CatsService và CommonService phụ thuộc vào nhau, cả hai bên của mối quan hệ có thể sử dụng @Inject() và forwardRef() để giải quyết circular dependency. Nếu không, Nest sẽ không khởi tạo chúng vì tất cả metadata cần thiết sẽ không khả dụng.

```ts
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService
  ) {}
}
```

```ts
@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService
  ) {}
}
```

### 2.2. ModuleRef class alternative

Một giải pháp thay thế cho việc sử dụng forwardRef() là cấu trúc lại code và sử dụng lớp ModuleRef để truy xuất provider ở một phía của mối quan hệ vòng tròn.

### 2.3. Module forward reference

Để giải quyết circular dependencie giữa các mô-đun, sử dụng cùng một hàm forwardRef() trên cả hai phía của liên kết mô-đun.

```ts
@Module({
  imports: [forwardRef(() => CatsModule)],
})
export class CommonModule {}
```

## 3. Module reference

Nest cung cấp lớp ModuleRef để điều hướng danh sách nội bộ của các providers và lấy tham chiếu đến bất kỳ provider nào bằng cách sử dụng token inject của nó làm khóa tra cứu. Lớp ModuleRef cũng cung cấp một cách để khởi tạo động cho cả provider tĩnh và phạm vi. ModuleRef có thể được đưa vào một lớp theo cách thông thường:

```ts
@Injectable()
export class CatsService {
  constructor(private moduleRef: ModuleRef) {}
}
```

### 3.1. Retrieving instances

ModuleRef có phương thức get(). Phương thức này truy xuất provider, controller hoặc injectable tồn tại trong mô-đun hiện tại bằng cách inject token/class name của nó.

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private service: Service;
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.service = this.moduleRef.get(Service);
  }
}
```

Để truy xuất provider từ ngữ cảnh chung (nếu provider đã được injected trong một mô-đun khác), hay truyền { strict: false } làm đối số thứ 2 cho get().

```ts
this.moduleRef.get(Service, { strict: false });
```

### 3.2. Resolving scoped providers

Để giải quyết resolve a scoped provider, hãy sử dụng phương thức resolve(), truyền token inject của provider làm đối số.

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private transientService: TransientService;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.transientService = await this.moduleRef.resolve(TransientService);
  }
}
```

### 3.3. Registering REQUEST provider

Các mã nhận dạng ngữ cảnh được tạo theo cách thủ công (với ContextIdFactory.create()) đại diện cho DI sub-trees trong đó provider REQUEST không được xác định vì chúng không được hệ thống dependency injection Nest khởi tạo và quản lý.

Để đăng ký đối tượng REQUEST tùy chỉnh cho DI sub-tree được tạo thủ công, hãy sử dụng phương thức ModuleRef#registerRequestByContextId() như sau:

```ts
const contextId = ContextIdFactory.create();
this.moduleRef.registerRequestByContextId(/* YOUR_REQUEST_OBJECT */, contextId);
```

### 3.4. Getting current sub-tree

Đôi khi có thể muốn giải quyết một instance của request-scoped provider trong request context. Giả sử rằng CatsService là phạm vi request và muốn giải quyết instance CatsRepository cũng được đánh dấu là provider phạm vi request. Để chia sẻ cùng một cây con vùng chứa DI, bạn phải lấy mã nhận dạng ngữ cảnh hiện tại thay vì tạo một mã mới (ví dụ: với hàm ContextIdFactory.create(), như được hiển thị ở trên). Để có được định danh ngữ cảnh hiện tại, hãy bắt đầu bằng cách đưa vào đối tượng yêu cầu bằng cách sử dụng decorator @Inject().

```ts
@Injectable()
export class CatsService {
  constructor(@Inject(REQUEST) private request: Record<string, unknown>) {}
}
```

Hãy sử dụng phương thức getByRequest()của lớp ContextIdFactory để tạo một id ngữ cảnh dựa trên request object, truyền nó vào lệnh gọi resolve():

### 3.5. Instantiating custom classes dynamically

Để khởi tạo động một lớp chưa được đăng ký trước đó làm nhà cung cấp, hãy sử dụng phương thức create() của tham chiếu module.

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private catsFactory: CatsFactory;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.catsFactory = await this.moduleRef.create(CatsFactory);
  }
}
```

Kỹ thuật này cho phép khởi tạo có điều kiện các lớp khác nhau bên ngoài vùng chứa khung.

## 4. Lazy-loading modules

Theo mặc định, các module được tải nhanh, có nghĩa là ngay sau khi ứng dụng tải, tất cả các module cũng vậy, cho dù chúng có cần thiết ngay lập tức hay không. Mặc dù điều này là tốt cho hầu hết các ứng dụng, nhưng nó có thể trở thành một nút cổ chai cho các ứng dụng, nơi mà độ trễ khởi động là rất quan trọng.

Tải chậm có thể giúp giảm thời gian khởi động bằng cách chỉ tải các module được yêu cầu bởi lệnh gọi chức năng không máy chủ cụ thể. Ngoài ra, cũng có thể tải các module khác một cách không đồng bộ sau khi chức năng serverless "ấm" để tăng tốc thời gian khởi động cho các cuộc gọi tiếp theo hơn nữa.

### 4.1. Getting started

Để tải các module theo yêu cầu, Nest cung cấp lớp LazyModuleLoader có thể được đưa vào một lớp:

```ts
@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}
}
```

Ngoài ra, có thể lấy tham chiếu đến LazyModuleLoadernhà cung cấp từ bên trong tệp bootstrap ứng dụng( main.ts), như sau:

```ts
// "app" represents a Nest application instance
const lazyModuleLoader = app.get(LazyModuleLoader);
```

Với điều này tại chỗ, bây giờ có thể tải bất kỳ module nào bằng cách sử dụng cấu trúc sau:

```ts
const { LazyModule } = await import("./lazy.module");
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);
```

Trong đó lazy.module.ts là tệp TypeScript xuất module Nest thông thường. Phương thức tải LazyModuleLoader trả về tham chiếu module (của LazyModule) cho phép bạn điều hướng danh sách nội bộ của các nhà cung cấp và lấy tham chiếu đến bất kỳ nhà cung cấp nào bằng cách sử dụng mã thông báo tiêm của nó làm khóa tra cứu.

Ví dụ: giả sử chúng ta có một LazyModule với định nghĩa sau:

```ts
@Module({
  providers: [LazyService],
  exports: [LazyService],
})
export class LazyModule {}
```

Với điều này, có thể nhận được một tham chiếu đến LazyService, như sau:

```ts
const { LazyModule } = await import("./lazy.module");
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);

const { LazyService } = await import("./lazy.service");
const lazyService = moduleRef.get(LazyService);
```

### 4.2 Lazy-loading controllers, gateways, and resolvers

Giả sử bạn đang xây dựng một REST API với một trình điều khiển Fastify bên dưới. Fastify không cho phép bạn đăng ký lộ trình sau khi ứng dụng đã sẵn sàng / nghe tin nhắn thành công. Điều đó có nghĩa là ngay cả khi chúng tôi phân tích ánh xạ tuyến được đăng ký trong bộ điều khiển của module, tất cả các tuyến được tải chậm sẽ không thể truy cập được vì không có cách nào để đăng ký chúng trong thời gian chạy.

Tương tự như vậy, một số chiến lược truyền tải mà chúng tôi cung cấp như một phần của @nestjs/microservices (bao gồm Kafka, gRPC hoặc RabbitMQ) yêu cầu đăng ký / nghe các chủ đề / kênh cụ thể trước khi kết nối được thiết lập. Khi ứng dụng của bạn bắt đầu nghe tin nhắn, khuôn khổ sẽ không thể đăng ký / nghe các chủ đề mới.

Cuối cùng, @nestjs/graphql có bật phương pháp tiếp cận mã đầu tiên tự động tạo lược đồ GraphQL một cách nhanh chóng dựa trên siêu dữ liệu. Điều đó có nghĩa là, nó yêu cầu tất cả các lớp phải được tải trước. Nếu không, sẽ không thể tạo lược đồ hợp lệ, thích hợp.

### 4.3. Common use-cases

Thông thường nhất, sẽ thấy các module được tải chậm trong các tình huống khi hàm worker / cron job / lambda & serverless / webhook của bạn phải kích hoạt các dịch vụ khác nhau (logic khác nhau) dựa trên các đối số đầu vào (đường dẫn tuyến đường / tham số ngày / truy vấn, v.v.). Mặt khác, các module lười tải có thể không có quá nhiều ý nghĩa đối với các ứng dụng nguyên khối, nơi mà thời gian khởi động khá không liên quan.
