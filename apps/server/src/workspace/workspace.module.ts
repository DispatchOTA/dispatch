import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './entities/workspace.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
  ],
})
export class WorkspaceModule {}
