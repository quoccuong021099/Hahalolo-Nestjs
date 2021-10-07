========== Platform agnosticism ==========

- Nest là một Platform agnosticism framework. Điều này có nghĩa là bạn có thể phát triển các phần hợp lý có thể tái sử dụng có thể được sử dụng trên các loại ứng dụng khác nhau. Ví dụ: hầu hết các thành phần có thể được sử dụng lại mà không thay đổi trên các khung máy chủ HTTP cơ bản khác nhau (ví dụ: Express và Fastify) và thậm chí trên các loại ứng dụng khác nhau (ví dụ: khung máy chủ HTTP, Microservices có các lớp truyền tải khác nhau và Cổng Web) .

## Build once, use everywhere (Xây dựng một lần, sử dụng mọi nơi)

- Phần Tổng quan của tài liệu chủ yếu hiển thị các kỹ thuật mã hóa bằng cách sử dụng HTTP server frameworks(ví dụ: ứng dụng cung cấp API REST hoặc cung cấp ứng dụng được hiển thị phía máy chủ kiểu MVC). Tuy nhiên, tất cả các khối xây dựng đó có thể được sử dụng trên các lớp truyền tải khác nhau (microservices hoặc websockets).

- Hơn nữa, Nest đi kèm với một GraphQL module chuyên dụng. Bạn có thể sử dụng GraphQL làm lớp API của mình thay thế cho nhau khi cung cấp REST API.

- Ngoài ra, tính năng `application context` giúp tạo bất kỳ loại ứng dụng Node.js nào - bao gồm những thứ như công việc `CRON` và `CLI app` - trên Nest.

- Nest mong muốn trở thành một nền tảng chính thức cho các ứng dụng Node.js mang đến mức độ mô-đun cao hơn và khả năng tái sử dụng cho các ứng dụng của bạn. Xây dựng một lần, sử dụng mọi nơi!
