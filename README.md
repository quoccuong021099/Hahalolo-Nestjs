# 5. Middleware

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
      { path: "cats", method: RequestMethod.POST },
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

- Để sử dụng một pipe thì cần liên kết một instance của lớp pipe với ngữ cảnh thích hợp. Trong ví dụ ParseIntPipe, ta  muốn liên kết pipe với một phương thức route handler cụ thể và đảm bảo rằng nó chạy trước khi phương thức được gọi. Làm như vậy với cấu trúc sau thì đó sẽ là ràng buộc pipe ở cấp tham số phương thức:

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
  ```
