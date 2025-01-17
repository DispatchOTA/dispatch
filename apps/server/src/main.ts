import { NestFactory } from '@nestjs/core'
import helmet from 'helmet';
import type { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: app.get(ConfigService).get('NODE_ENV') === 'production',
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  app.enableCors({
    origin: '*',
  });
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
