import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageVersionService } from './image-version.service';
import { ImageVersionController } from './image-version.controller';
import { ImageVersion } from './entities/image-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImageVersion])],
  controllers: [ImageVersionController],
  providers: [ImageVersionService],
})
export class ImageVersionModule {}
