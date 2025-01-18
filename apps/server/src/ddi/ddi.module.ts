import { Module } from '@nestjs/common';
import { DdiController } from './ddi.controller';

@Module({
  controllers: [DdiController]
})
export class DdiModule {}
