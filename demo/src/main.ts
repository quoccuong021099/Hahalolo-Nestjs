import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Starts listening to shutdown hooks
  app.close();
  app.enableShutdownHooks();
  await app.listen(3000);
}
bootstrap();
