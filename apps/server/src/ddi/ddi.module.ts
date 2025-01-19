import { Module } from '@nestjs/common';
import { DdiController } from './ddi.controller';
import { DdiService } from './ddi.service';

@Module({
  controllers: [DdiController],
  providers: [DdiService]
})
export class DdiModule {}
