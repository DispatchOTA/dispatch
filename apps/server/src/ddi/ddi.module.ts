import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DdiController } from './ddi.controller';
import { DdiService } from './ddi.service';
import { Deployment } from '../deployment/entities/deployment.entity';
import { Device } from '../device/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deployment, Device]),
  ],
  controllers: [DdiController],
  providers: [DdiService]
})
export class DdiModule {}
