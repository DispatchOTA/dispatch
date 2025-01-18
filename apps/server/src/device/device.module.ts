import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { Device } from './entities/device.entity';
import { Deployment } from '../deployment/entities/deployment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Deployment])],
  controllers: [DeviceController],
  providers: [DeviceService],
})
export class DeviceModule {}
