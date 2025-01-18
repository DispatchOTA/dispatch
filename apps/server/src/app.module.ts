import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { ENV_DEVELOPMENT, envValidationSchema } from './common';
import { DeviceModule } from './device/device.module';
import { ImageVersionModule } from './image-version/image-version.module';
import { DeploymentModule } from './deployment/deployment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: 'db.sqlite',
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') === ENV_DEVELOPMENT,
      }),
    }),
    DeviceModule,
    ImageVersionModule,
    DeploymentModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
