import { Module } from '@nestjs/common';
import { ArtifactService } from './artifact.service';
import { ObjectStorageModule } from 'src/object-storage/object-storage.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artifact } from './entities/artifact.entity';

@Module({
  imports: [
    ObjectStorageModule,
    TypeOrmModule.forFeature([Artifact])
  ],
  providers: [ArtifactService],
  exports: [ArtifactService],
})
export class ArtifactModule {}
