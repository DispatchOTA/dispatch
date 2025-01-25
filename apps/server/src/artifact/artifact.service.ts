import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Artifact } from './entities/artifact.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArtifactDto } from './dtos/create-artifact.dto';
import { createHash } from '../common/crypto';
import { ARTIFACTS_BUCKET } from '../common/consts';
import { ObjectStorageService } from '../object-storage/object-storage.service';

@Injectable()
export class ArtifactService {
  private readonly logger = new Logger(ArtifactService.name);

  constructor(
    @InjectRepository(Artifact)
    private artifactsRepository: Repository<Artifact>,
    private objectStorageService: ObjectStorageService,
  ) {}

  async createAndUpload(createArtifactDto: CreateArtifactDto): Promise<Artifact> {
    this.validateArtifactMetadata(createArtifactDto);
    const artifact = this.artifactsRepository.create(createArtifactDto);
    this.logger.log(`Creating artifact ${artifact.uuid}`);
    await this.objectStorageService.putObject(
      ARTIFACTS_BUCKET,
      'artifact.workspaceId', // TODO: use workspaceId
      artifact.uuid,
      createArtifactDto.content,
    );
    return this.artifactsRepository.save(artifact);

  }

  async download(uuid: string): Promise<Buffer> {
    const artifact = await this.artifactsRepository.findOne({ where: { uuid } });
    if (!artifact) {
      this.logger.error(`Artifact with id ${uuid} not found`);
      throw new NotFoundException(`Artifact with id ${uuid} not found`);
    }
    const content = await this.objectStorageService.getObject(
      ARTIFACTS_BUCKET,
      'artifact.workspaceId', // TODO: use workspaceId
      artifact.uuid,
    );
    if (!content) {
      this.logger.error(`Artifact with id ${uuid} not found`);
      throw new NotFoundException(`Artifact with id ${uuid} not found`);
    }
    return content;
  }

  private validateArtifactMetadata(createArtifactDto: CreateArtifactDto): void {
    const content = createArtifactDto.content;
    const sha256 = createHash('sha256', content);
    const sha1 = createHash('sha1', content);
    const md5 = createHash('md5', content);
    const size = content.length;

    if (sha256 !== createArtifactDto.sha256) {
      this.logger.error(`SHA256 mismatch for artifact ${createArtifactDto.filename}`);
      throw new BadRequestException('Artifact SHA256 mismatch');
    }
    if (sha1 !== createArtifactDto.sha1) {
      this.logger.error(`SHA1 mismatch for artifact ${createArtifactDto.filename}`);
      throw new BadRequestException('Artifact SHA1 mismatch');
    }
    if (md5 !== createArtifactDto.md5) {
      this.logger.error(`MD5 mismatch for artifact ${createArtifactDto.filename}`);
      throw new BadRequestException('Artifact MD5 mismatch');
    }
    if (size !== createArtifactDto.size) {
      this.logger.error(`Size mismatch for artifact ${createArtifactDto.filename}`);
      throw new BadRequestException('Artifact size mismatch');
    }
  }

}
