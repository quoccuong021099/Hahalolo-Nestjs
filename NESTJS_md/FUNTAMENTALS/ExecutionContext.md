# Execution Context

Nest cung cấp một số lớp tiện ích để xây dựng các bộ `guards , filters và interceptors` chung có thể hoạt động trên một loạt các bộ `controllers, methods, và execution contexts`.

## ArgumentsHost class

- Các lớp ArgumentsHost cung cấp phương pháp để lấy các đối số được truyền cho một handler.

- Nó cho phép chọn ngữ cảnh thích hợp để truy xuất các đối số từ đó.

- ArgumentsHost chỉ hoạt động như một sự trừu tượng hóa đối với các đối số của trình xử lý.

Ví dụ:

    + Host Express: [request, response, next]
    + Host GraphQL: [root, args, context, info]

## Current application context

Sử dụng method getType() để xác định loại ứng dụng mà method đang chạy.

```js
if (host.getType() === 'http') {
  // do something that is only important in the context of regular HTTP requests (REST)
} else if (host.getType() === 'rpc') {
  // do something that is only important in the context of Microservice requests
} else if (host.getType<GqlContextType>() === 'graphql') {
  // do something that is only important in the context of GraphQL requests
}
```

## Host handler arguments

- Method getArgs():dùng để truy xuất mảng đối số được chuyển đến trình xử lý.

```ts
const [req, res, next] = host.getArgs();
```

- Method getArgByIndex(): dùng để truy xuất đối số cụ thể theo chỉ mục

```ts
const request = host.getArgByIndex(0);
```

- Để code mạnh mẽ hơn và có thể tái sử dụng, ta dùng một trong các host phương thức tiện ích của đối tượng để chuyển sang ngữ cảnh ứng dụng thích hợp.

```ts
/**
 * Switch context to RPC.
 */
switchToRpc(): RpcArgumentsHost;
/**
 * Switch context to HTTP.
 */
switchToHttp(): HttpArgumentsHost;
/**
 * Switch context to WebSockets.
 */
switchToWs(): WsArgumentsHost;
```

- Phương pháp HttpArgumentsHost: (ngữ cảnh express)

```ts
const ctx = host.switchToHttp();
const request = ctx.getRequest<Request>();
const response = ctx.getResponse<Response>();
```

- Phương pháp WsArgumentsHost: (ngữ cảnh microservices)

```ts
export interface WsArgumentsHost {
  /**
   * Returns the data object.
   */
  getData<T>(): T;
  /**
   * Returns the client object.
   */
  getClient<T>(): T;
}
```

- Phương pháp RpcArgumentsHost: (ngữ cảnh WebSockets)

```ts
export interface RpcArgumentsHost {
  /**
   * Returns the data object.
   */
  getData<T>(): T;
  /**
   * Returns the client object.
   */
  getContext<T>(): T;
}
```

## ExecutionContext class

- ExecutionContext extends ArgumentsHost, cung cấp thêm thông tin chi tiết về quy trình thực thi hiện tại.

```ts
export interface ExecutionContext extends ArgumentsHost {
  /**
   * Returns the type of the controller class which the current handler belongs to.
   */
  getClass<T>(): Type<T>;
  /**
   * Returns a reference to the handler (method) that will be invoked next in the
   * request pipeline.
   */
  getHandler(): Function;
}
```

```ts
// Ví dụ request POST dùng create() của CatsController

const methodKey = ctx.getHandler().name; // "create"
const className = ctx.getClass().name; // "CatsController"
```

## Reflection and metadata

Nest cung cấp khả năng đính kèm siêu dữ liệu tùy chỉnh để định tuyến trình xử lý thông qua decorator @SetMetadata(). Và có thể truy cập siêu dữ liệu này từ bên trong lớp để đưa ra các xử lý tiếp theo.

Ví dụ về Reflection and metadata trong Guard

- Tạo ra decorator của riêng biệt
- Tiêm vào Controller
- Trong Guard, dùng get() để lấy ra Metadata

Một vài phương thức khác để reflection:

- `getAllAndOverride()`: ghi đè một cách có chọn lọc.
- `getAllAndMerge()`: lấy siêu dữ liệu cho cả hai và hợp nhất chúng
