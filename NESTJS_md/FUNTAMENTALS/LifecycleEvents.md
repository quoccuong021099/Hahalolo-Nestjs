========== Lifecycle Events ==========

- NestJS cũng cung cấp các API để chúng ta có thể can thiệp vòng đời của các thành phần trong NestJS. Các API này được xử lý thông qua cơ chế hook. Dứơi đây là 4 lifecyle event cơ bản của NestJS

- `OnModuleInit` được gọi khi một module được khởi tạo, hàm này chỉ được gọi một lần.

```ts
import { Module, OnModuleInit } from "@nestjs/common";
@Module({})
export class UsersModule implements OnModuleInit {
  async onModuleInit() {
    console.log(`The module has been initialized.`);
  }
}
```

- OnModuleDestroy được gọi trước khi một module bị destroy

```ts
import { Module, OnModuleDestroy } from "@nestjs/common";

@Module({})
export class UsersModule implements OnModuleDestroy {
  async onModuleDestroy() {
    console.log(`The module has been destroyed.`);
  }
}
```

- OnApplicationBootstrap được gọi một lần khi application đã hoàn toàn được start.

```ts
import { Module, OnApplicationBootstrap } from "@nestjs/common";

@Module({})
export class AppModule implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log(`The application has been bootstraped.`);
  }
}
```

- OnApplicationShutdown khi application NestJS sẽ gửi một signal đến hệ thống thông qua Hook. Chức năng này của NestJS thường được sử dụng trên Kubernetes, Heroku … Để sử thì chúng ta phải enable chức năng hook khi shutdown của NestJS.

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Starts listening to shutdown hooks
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
```

- Chú ý là khi một application bị shutdown nó gửi một signal đến hàm onApplicationShutdown. Trong trường hợp, hàm onApplicationShutdown trả về một Promise thì application sẽ không shutdown cho đến khi Promise hoàn tất.

```ts
import { Module, OnApplicationShutdown } from "@nestjs/common";

@Module({})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(sigal: string) {
    console.log(`The application has been détroyed ${signal}.`);
  }
}
```

- Cả 4 hàm trên đều có thể implement trong các provider và nhận được event thông qua injection nên chúng ta có thể implement trong module, hoặc service đều được.
