# Interceptors

Một Interceptor là một lớp đánh chặn được chú thích bằng decorator @Injectable(). Các Interceptors phải implement interface NestInterceptor.

![img](https://docs.nestjs.com/assets/Interceptors_1.png)

Các Interceptors có một tập hợp các khả năng hữu ích được lấy cảm hứng từ kỹ thuật lập trình hướng khía cạnh Aspect Oriented Programming (AOP). Họ làm cho nó có thể:

- ràng buộc logic bổ sung trước / sau khi thực thi phương thức
- biến đổi kết quả trả về từ một hàm
- biến đổi exception được ném ra từ một hàm
- mở rộng hành vi function cơ bản
- ghi đè hoàn toàn một function tùy thuộc vào các điều kiện cụ thể (ví dụ: cho mục đích lưu vào bộ nhớ đệm)

## Basics

Mỗi interceptor triển khai phương thức `intercept()`, phương thức này nhận 2 đối số. Đầu tiên là instance `ExecutionContext`. ExecutionContext kế thừa từ `ArgumentsHost`. Thứ hai là một `CallHandler`. CallHandler interface implements phương thức `handle()`.

## Execution context

Bằng cách extends ArgumentsHost, ExecutionContext cũng bổ sung một số phương thức helper mới cung cấp chi tiết bổ sung về quy trình thực thi hiện tại. Những chi tiết này có thể hữu ích trong việc xây dựng các interceptors chung chung hơn có thể hoạt động trên nhiều controllers, methods và execution contexts.

## Call handler

CallHandler interface implements phương thức `handle()`, bạn có thể sử dụng phương thức này để gọi phương thức route handler tại một số điểm trong interceptor của bạn. Nếu bạn không gọi phương thức handle() khi triển khai phương thức intercept(), thì phương thức route handler sẽ không được thực thi.

Cách tiếp cận này có nghĩa là phương thức intercept() bao bọc luồng request/response một cách hiệu quả. Do đó, bạn có thể triển khai logic tùy chỉnh cả trước và sau khi thực thi route handler cuối cùng. Rõ ràng là bạn có thể viết mã trong phương thức intercept() thực thi trước khi gọi handle(), nhưng làm thế nào để bạn ảnh hưởng đến những gì xảy ra sau đó? Vì phương thức handle() trả về một Observable, chúng ta có thể sử dụng các toán tử RxJS mạnh mẽ để thao tác sâu hơn với response. Sử dụng thuật ngữ Lập trình hướng theo khía cạnh, lệnh gọi của route handler (tức là gọi handler()) được gọi là Pointcut, cho biết rằng đó là điểm mà tại đó logic bổ sung của chúng ta được chèn vào.

## Aspect interception

Trường hợp sử dụng đầu tiên mà chúng ta sẽ xem xét là sử dụng một interceptor ghi lại tương tác của người dùng (ví dụ: lưu trữ các cuộc gọi của người dùng, điều phối không đồng bộ các sự kiện hoặc tính toán dấu thời gian). Chúng ta hiển thị một LoggingInterceptor đơn giản bên dưới:

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Before...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

<ins>Chú ý</ins>:

- NestInterceptor<T, R> là một interface chung ở đó T chỉ ra kiểu của một Observable<T> (hỗ trợ luồng response), và R là kiểu value được bao bọc bởi Observable<R>.

- Interceptors, giống như controllers, providers, guards, v.v, có thể inject dependencies qua hàm constructor.

Vì `handle()` trả về một RxJS Observable, chúng ta có nhiều lựa chọn toán tử mà chúng ta có thể sử dụng để thao tác luồng. Trong ví dụ trên, chúng ta đã sử dụng toán tử tap(), gọi chức năng ghi nhật ký ẩn danh của chúng ta khi kết thúc nhưng không can thiệp vào chu kỳ phản hồi.

## Binding interceptors

Để thiết lập interceptor, chúng ta sử dụng decorator `@UseInterceptors()` được nhập từ gói @nestjs/common. Giống như pipes và guards, các interceptors có thể là phạm vi controller, phạm vi phương thức hoặc phạm vi toàn cục.

```ts
@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```

Sử dụng cấu trúc trên, mỗi route handler được xác định trong CatsController sẽ sử dụng LoggingInterceptor. Khi ai đó gọi endpoint GET /cats, bạn sẽ thấy đầu ra sau trong đầu ra chuẩn của mình:

```
Before...
After... 1ms
```

<ins>Lưu ý</ins>: chúng ta đã chuyển kiểu LoggingInterceptor (thay vì một instance), để lại trách nhiệm khởi tạo cho framework và cho phép chèn dependency injection. Giống như với pipes, guards, và exception filters, chúng ta cũng có thể truyền một instance tại chỗ:

```ts
@UseInterceptors(new LoggingInterceptor())
export class CatsController {}
```

Để thiết lập một interceptor toàn cục, chúng ta sử dụng phương thức useGlobalInterceptors() của instance ứng dụng Nest:

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

Các interceptor toàn cục được sử dụng trên toàn bộ ứng dụng, cho mọi controler và mọi route hander. Về mặt dependency injection, các interceptor toàn cục được đăng ký từ bên ngoài của bất kỳ mô-đun nào (với useGlobalInterceptors(), như trong ví dụ trên) không thể inject dependencies vì điều này được thực hiện bên ngoài ngữ cảnh của bất kỳ mô-đun nào. Để giải quyết vấn đề này, bạn có thể thiết lập một interceptor trực tiếp từ bất kỳ mô-đun nào bằng cách sử dụng cấu trúc sau:

```ts
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

## Response mapping

Chúng ta đã biết rằng handle() trả về một Observable. Luồng chứa giá trị được trả về từ route hander và do đó chúng ta có thể dễ dàng thay đổi nó bằng cách sử dụng toán tử map() của RxJS.

<ins>Lưu ý</ins>: Tính năng response mapping không hoạt động với thư viện riêng response strategy (sử dụng @Res() trực tiếp đối tượng bị cấm).

Chúng ta tạo TransformInterceptor, điều này sẽ sửa đổi từng response theo cách nhỏ để chứng minh quy trình. Nó sẽ sử dụng toán tử RxJS’s map() để gán đối tượng response cho thuộc tính dữ liệu của một đối tượng mới được tạo, trả lại đối tượng mới cho client.

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
```

Với cách xây dựng ở trên, khi ai đó gọi endpoint GET /cats, response sẽ giống như sau (giả sử rằng route hander trả về một mảng trống []):

```Json
{
  "data": []
}
```

Interceptors có giá trị lớn trong việc tạo ra các giải pháp có thể tái sử dụng cho các yêu cầu xảy ra trên toàn bộ ứng dụng. Ví dụ, hãy tưởng tượng chúng ta cần chuyển đổi mỗi lần xuất hiện của giá trị null thành một chuỗi rỗng ”. Chúng ta có thể làm điều đó bằng cách sử dụng một dòng mã và liên kết Interceptors trên toàn cục để nó sẽ tự động được sử dụng bởi mỗi handler đã đăng ký.

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((value) => (value === null ? "" : value)));
  }
}
```

## Exception mapping

Một trường hợp sử dụng thú vị khác là tận dụng toán tử catchError() của RxJS để ghi đè các ngoại lệ đã ném:

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError((err) => throwError(new BadGatewayException())));
  }
}
```

## Stream overriding

Có một số lý do tại sao đôi khi chúng ta có thể muốn ngăn chặn hoàn toàn việc gọi handler và thay vào đó trả về một giá trị khác. Một ví dụ rõ ràng là triển khai bộ nhớ cache để cải thiện thời gian phản hồi. Chúng ta hãy xem xét một interceptor bộ nhớ cache đơn giản trả về phản hồi của nó từ bộ nhớ cache. Trong một ví dụ thực tế, chúng ta muốn xem xét các yếu tố khác như TTL, vô hiệu bộ nhớ cache, kích thước bộ nhớ cache, v.v., nhưng điều đó nằm ngoài phạm vi của cuộc thảo luận này. Ở đây chúng ta sẽ cung cấp một ví dụ cơ bản thể hiện khái niệm chính.

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, of } from "rxjs";

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}
```

CacheInterceptor của chúng ta có biến isCached được mã hóa cứng và response được mã hóa cứng []. Điểm quan trọng cần lưu ý là chúng ta trả về một luồng mới ở đây, được tạo bởi toán tử RxJS of(), do đó route handler sẽ không được gọi. Khi ai đó gọi một endpoint sử dụng CacheInterceptor, phản hồi (một mảng trống, được mã hóa cứng) sẽ được trả về ngay lập tức. Để tạo giải pháp chung, bạn có thể tận dụng Reflector và tạo decorator tùy chỉnh. Reflector được mô tả kỹ trong chương guards.

## More operators

Khả năng thao tác luồng bằng toán tử RxJS cho chúng ta nhiều khả năng. Hãy xem xét một trường hợp sử dụng phổ biến khác. Hãy tưởng tượng bạn muốn xử lý thời gian chờ theo request route. Khi endpoint của bạn không trả lại bất kỳ thứ gì sau một khoảng thời gian, bạn muốn kết thúc bằng response lỗi. Cấu trúc sau cho phép điều này:

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from "@nestjs/common";
import { Observable, throwError, TimeoutError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      })
    );
  }
}
```

Sau 5 giây, quá trình xử lý request sẽ bị hủy. Bạn cũng có thể thêm logic tùy chỉnh trước khi ném RequestTimeoutException (ví dụ: giải phóng tài nguyên).
