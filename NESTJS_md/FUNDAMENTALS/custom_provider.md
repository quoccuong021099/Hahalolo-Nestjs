========== CUSTOM PROVIDER ==========

- Điều gì xảy ra khi các yêu cầu của bạn vượt quá những yêu cầu mà các nhà cung cấp Tiêu chuẩn đưa ra? Đây là vài ví dụ:

  - Bạn muốn tạo một phiên bản tùy chỉnh thay vì có Nest khởi tạo (hoặc trả về một phiên bản được lưu trong bộ nhớ cache của) một lớp

  - Bạn muốn sử dụng lại một lớp hiện có trong phụ thuộc thứ hai

  - Bạn muốn ghi đè một lớp bằng phiên bản giả để thử nghiệm

- Nest cho phép bạn xác định Custom providers để xử lý các trường hợp này. Nó cung cấp một số cách để xác định Custom providers. Hãy đi qua chúng.

## 1) Value providers: useValue

- Cú pháp `useValue` hữu ích để đưa vào một giá trị không đổi, đưa một thư viện bên ngoài vào vùng chứa Nest hoặc thay thế một triển khai thực bằng một đối tượng giả. Giả sử bạn muốn buộc Nest sử dụng CatsService giả cho mục đích thử nghiệm.

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

## 2. Non-class-based provider tokens


