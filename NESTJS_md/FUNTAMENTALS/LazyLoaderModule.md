# Lazy-loading modules

Lazy-loading modules có thể giúp giảm thời gian khởi động bằng cách chỉ tải các mô-đun được yêu cầu bởi lệnh gọi chức năng không máy chủ cụ thể.

Ngoài ra, bạn cũng có thể tải các mô-đun khác không đồng bộ sau chức năng serverless "warm" để tăng tốc thời gian khởi động cho các cuộc gọi tiếp theo hơn nữa (đăng ký mô-đun bị hoãn lại).

## Cách sử dụng

Để tải các mô-đun theo yêu cầu, Nest cung cấp LazyModuleLoaderlớp có thể được đưa vào một lớp theo cách thông thường:

```ts
@Injectable()
export class CatsService {
  constructor(private lazyModuleLoader: LazyModuleLoader) {}
}
```

Ngoài ra, bạn có thể lấy tham chiếu đến LazyModuleLoadernhà cung cấp từ bên trong tệp bootstrap ứng dụng của mình ( main.ts), như sau:

```ts
// "app" represents a Nest application instance
const lazyModuleLoader = app.get(LazyModuleLoader);
```

Sử dụng cấu trúc sau:

```ts
const { LazyModule } = await import("./lazy.module");
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);
```

\* Modules tải chậm vào bộ nhớ đệm (nghĩa là sau mỗi lần thử tải liên tiếp LazyModule tải sẽ nhanh và trả về phiên bản được lưu trong bộ nhớ Cache, thay vì tải lại module)

Giả sử chúng ta có một LazyModulevới định nghĩa sau:

```ts
@Module({
  providers: [LazyService],
  exports: [LazyService],
})
export class LazyModule {}
```

Chúng tôi có thể nhận được tham chiếu đến LazyServicenhà cung cấp, như sau:

```ts
const { LazyModule } = await import("./lazy.module");
const moduleRef = await this.lazyModuleLoader.load(() => LazyModule);

const { LazyService } = await import("./lazy.service");
const lazyService = moduleRef.get(LazyService);
```

=> Mô-đun được tải chậm không thể được đăng ký dưới dạng mô-đun toàn cục vì điều đó đơn giản là vô nghĩa.

## Các trường hợp phổ biến:

Các mô-đun được tải chậm dùng trong các tình huống khi hàm worker / cron job / lambda & serverless / webhook của bạn phải kích hoạt các dịch vụ khác nhau (logic khác nhau) dựa trên các đối số đầu vào (đường dẫn tuyến đường / tham số ngày / truy vấn, v.v.).

Các mô-đun tải chậm có thể không có quá nhiều ý nghĩa đối với các ứng dụng nguyên khối, nơi mà thời gian khởi động khá không liên quan.
