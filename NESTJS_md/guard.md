# 8. Guards:

Guard là một lớp bảo vệ được chú thích bằng decorator @Injectable() và implement interface CanActivate.

![img](https://docs.nestjs.com/assets/Guards_1.png)

Các `Guards` có một single responsibility. Nó xác định xem một request nhất định sẽ được xử lý bởi route handler hay không, tùy thuộc vào các điều kiện nhất định (như quyền/permissons, vai trò/roles, ACLs, v.v.) hiện có tại thời điểm chạy. Điều này thường được gọi là ủy quyền/authorization. Ủy quyền/Authorization thường được xử lý bởi middleware trong các ứng dụng Express truyền thống. Middleware là một lựa chọn tốt để xác thực/authentication, vì những thứ như token validation thông báo và đính kèm thuộc tính vào request object không được kết nối chặt chẽ với ngữ cảnh route cụ thể.

Nhưng `middleware` không biết handler nào sẽ được thực thi sau khi gọi hàm `next()`. Mặt khác, Guards có quyền truy cập vào instance ExecutionContext và do đó biết chính xác những gì sẽ được thực thi tiếp theo. Chúng được thiết kế, giống như exception filters, pipes và interceptors, để cho phép sử dụng logic xử lý chính xác vào đúng điểm trong chu kỳ request/response và làm như vậy một cách khai báo. Điều này giúp giữ cho code của bạn trong gọn và dễ khai báo.

<ins>Chú ý</ins>: `Guards` được thực thi sau mỗi middleware, nhưng trước bất kỳ interceptor hoặc pipe.

## Authorization guard:

Authorization/ủy quyền là một trường hợp sử dụng tuyệt vời cho các Guards vì các route cụ thể chỉ khả dụng khi người gọi (thường là người dùng được authenticated/xác thực cụ thể) có đủ quyền/permissions. AuthGuard mà chúng ta sẽ xây dựng bây giờ giả định một người dùng đã được xác thực/authenticated (và do đó, một token được đính kèm với các request headers). Nó sẽ trích xuất và validate token, đồng thời sử dụng thông tin được trích xuất để xác định xem liệu request có thể tiếp tục hay không.

```TypeScript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

Logic bên trong hàm `validateRequest()` có thể đơn giản hoặc phức tạp nếu cần. Điểm chính của ví dụ này là chỉ ra cách các guards phù hợp với chu trình request/response.

Mọi guard phải implement một hàm `canActivate()`. Hàm này sẽ trả về một boolean, cho biết request hiện tại có được phép hay không. Nó có thể trả về response đồng bộ hoặc không đồng bộ (thông qua Promise hoặc Observable). Nest sử dụng giá trị trả về để kiểm soát hành động tiếp theo:

- Nếu trả về true, request sẽ được thực hiện.
- Nếu trả về false, Nest sẽ từ chối request.

## Execution context:

Hàm `canActivate()` nhận một đối số duy nhất là instance ExecutionContext. ExecutionContext kế thừa từ ArgumentsHost. Trong ví dụ trên, chúng tôi chỉ đang sử dụng cùng một phương thức helper được định nghĩa trên ArgumentsHost mà chúng tôi đã sử dụng trước đó, để nhận tham chiếu đến Request object.

Bằng cách mở rộng ArgumentsHost, ExecutionContext cũng bổ sung một số phương thức helper mới cung cấp chi tiết bổ sung về quy trình thực thi hiện tại. Những chi tiết này có thể hữu ích trong việc xây dựng nhiều guards chung hơn có thể hoạt động trên nhiều controllers, phương thức và execution contexts.

## Role-based authentication:

Xây dựng một function guard nhiều chức năng hơn chỉ cho phép truy cập vào những người dùng có vai trò cụ thể. Bắt đầu một mẫu guard cơ bản và dần dần hoàn thiện ở các phần tiếp theo.

```TypeScript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

## Binding guards:

Giống như các pipes và exception filters, các guards có thể là phạm vi controller, phạm vi phương thức hoặc phạm vi toàn cục. Dưới đây, chúng tôi thiết lập bộ phận bảo vệ có phạm vi controller bằng cách sử dụng decorator @UseGuards(). Decorator này này có thể nhận một đối số duy nhất hoặc một danh sách các đối số được phân tách bằng dấu phẩy. Điều này cho phép bạn dễ dàng áp dụng nhóm guards thích hợp với một tuyên bố.

```TypeScript
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

Cấu trúc bên trên gắn guard vào mọi handler do controller này khai báo. Nếu chúng ta muốn guard chỉ áp dụng cho một phương thức, chúng ta áp dụng decorator `@UseGuards()` ở cấp phương thức.

Để thiết lập bảo vệ toàn cục, hãy sử dụng phương thức `useGlobalGuards()` của instance ứng dụng Nest:

```TypeScript
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

Guards toàn cục được sử dụng trên toàn bộ ứng dụng, cho mọi controller và mọi route handler. Về mặt dependency injection, các guards toàn cầu được đăng ký từ bên ngoài của bất kỳ mô-đun nào (với useGlobalGuards() như trong ví dụ trên) không thể inject dependencies vì điều này được thực hiện bên ngoài ngữ cảnh của bất kỳ mô-đun nào. Để giải quyết vấn đề này, bạn có thể thiết lập bảo vệ trực tiếp từ bất kỳ mô-đun nào bằng cách sử dụng cấu trúc sau:

```TypeScript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

## Setting roles per handler:

`RolesGuard` của chúng tôi đang hoạt động, nhưng nó chưa thông minh lắm. Chúng tôi vẫn chưa tận dụng tính năng guard quan trọng nhất – execution context. Nó vẫn chưa biết về các roles, hoặc những roles nào được phép cho mỗi handler. Ví dụ, CatsController có thể có các sơ đồ quyền khác nhau cho các route khác nhau. Một số có thể chỉ có sẵn cho người dùng quản trị và những cái khác có thể mở cho tất cả mọi người. Làm thế nào chúng ta có thể kết hợp các role với các routes một cách linh hoạt và có thể tái sử dụng?

Đây là nơi metadata tùy chỉnh phát huy tác dụng. Nest cung cấp khả năng đính kèm metadata tùy chỉnh để route handlers thông qua decorator `@SetMetadata()`. Metadata này cung cấp dữ liệu vai trò còn thiếu của chúng tôi, mà một guard thông minh cần đưa ra quyết định.

```TypeScript
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

Với cách xây dựng ở trên, chúng tôi đã đính kèm metadata roles (roles là một khóa, trong khi [‘admin’] là một giá trị cụ thể) vào phương thức create(). Mặc dù điều này hoạt động, nhưng thực tế không tốt nếu sử dụng `@SetMetadata()` trực tiếp trong các routes của bạn. Thay vào đó, hãy decorator của riêng bạn, như được hiển thị bên dưới:

```TypeScript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

Cách tiếp cận này rõ ràng hơn và dễ đọc hơn, và được kiểu mạnh mẽ. Bây giờ chúng ta đã có một decorator @Roles() tùy chỉnh, chúng ta có thể sử dụng nó để decorator cho phương thức `create()`.

```TypeScript
@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

## Putting it all together:

Bây giờ chúng ta hãy quay lại và liên kết điều này với RolesGuard của chúng ta. Hiện tại, nó chỉ trả về true trong mọi trường hợp, cho phép mọi request được tiến hành. Chúng tôi muốn đặt giá trị trả về có điều kiện dựa trên việc so sánh các vai trò được chỉ định cho người dùng hiện tại với các vai trò thực tế được yêu cầu bởi route hiện tại đang được xử lý. Để truy cập (các) vai trò của route (metadata tùy chỉnh), chúng tôi sẽ sử dụng lớp helper Reflector, được cung cấp bên ngoài bởi framework và được lấy từ gói @nestjs/core.

```TypeScript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
```

Khi người dùng không có đủ đặc quyền yêu cầu một endpoint. Nest sẽ tự động trả về response sau:

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

Nếu bạn muốn trả về một response lỗi khác, bạn nên đưa ra ngoại lệ cụ thể của riêng mình. Ví dụ:

```TypeScript
throw new UnauthorizedException();
```
