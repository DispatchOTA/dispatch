import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { ImageVersion } from './entities/image-version.entity';
import { Repository } from 'typeorm';
import { UpdateImageVersionDto } from './dtos/update-image-version.dto';
import { CreateImageVersionDto } from './dtos/create-image-version.dto';
import { Image } from '../image/entities/image.entity';

@Injectable()
export class ImageVersionService {
  private readonly logger = new Logger(ImageVersionService.name);

  constructor(
    @InjectRepository(ImageVersion)
    private readonly imageVersionRepository: Repository<ImageVersion>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create(imageUuid: string, createImageVersionDto: CreateImageVersionDto): Promise<ImageVersion> {
    const image = await this.imageRepository.findOne({ where: { uuid: imageUuid } });
    if (!image) {
      this.logger.error(`Image not found: ${imageUuid}`);
      throw new NotFoundException('Image not found');
    }
    const imageVersion = new ImageVersion();
    imageVersion.id = createImageVersionDto.id;
    imageVersion.description = createImageVersionDto.description;
    imageVersion.image = image;
    this.logger.log(`Creating image version: ${imageVersion.id}`);
    return this.imageVersionRepository.save(imageVersion);
  }

  async findAll(imageUuid: string): Promise<ImageVersion[]> {
    const image = await this.imageRepository.findOne({ where: { uuid: imageUuid } });
    if (!image) {
      this.logger.error(`Image not found: ${imageUuid}`);
      throw new NotFoundException('Image not found');
    }
    return this.imageVersionRepository.find({
      where: { image },
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async update(imageUuid: string, versionUuid: string, updateImageVersionDto: UpdateImageVersionDto): Promise<ImageVersion> {
    const image = await this.imageRepository.findOne({ where: { uuid: imageUuid } });
    if (!image) {
      this.logger.error(`Image not found: ${imageUuid}`);
      throw new NotFoundException('Image not found');
    }
    const imageVersion = await this.imageVersionRepository.findOne({ where: { uuid: versionUuid, image } });
    if (!imageVersion) {
      this.logger.error(`Image version not found: ${versionUuid}`);
      throw new NotFoundException('Image version not found');
    }
    imageVersion.id = updateImageVersionDto.id;
    imageVersion.description = updateImageVersionDto.description;
    this.logger.log(`Updating image version: ${imageVersion.id}`);
    return this.imageVersionRepository.save(imageVersion);
  }

  async delete(imageUuid: string, versionUuid: string): Promise<void> {
    const image = await this.imageRepository.findOne({ where: { uuid: imageUuid } });
    if (!image) {
      this.logger.error(`Image not found: ${imageUuid}`);
      throw new NotFoundException('Image not found');
    }
    const imageVersion = await this.imageVersionRepository.findOne({ where: { uuid: versionUuid, image } });
    if (!imageVersion) {
      this.logger.error(`Image version not found: ${versionUuid}`);
      throw new NotFoundException('Image version not found');
    }
    this.logger.log(`Deleted image version: ${versionUuid}`);
    await this.imageVersionRepository.delete(versionUuid);
  }
}