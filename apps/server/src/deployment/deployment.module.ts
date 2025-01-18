import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeploymentService } from './deployment.service';
import { DeploymentController } from './deployment.controller';
import { Deployment } from './entities/deployment.entity';
import { Device } from '../device/entities/device.entity';
import { ImageVersion } from '../image-version/entities/image-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deployment, Device, ImageVersion])],
  controllers: [DeploymentController],
  providers: [DeploymentService],
})
export class DeploymentModule {}
