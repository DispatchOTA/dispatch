import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageVersionService } from './image-version.service';
import { ImageVersionController } from './image-version.controller';
import { ImageVersion } from './entities/image-version.entity';
import { Deployment } from '../deployment/entities/deployment.entity';
import { Image } from '../image/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageVersion, Image, Deployment])],
  controllers: [ImageVersionController],
  providers: [ImageVersionService],
})
export class ImageVersionModule {}
