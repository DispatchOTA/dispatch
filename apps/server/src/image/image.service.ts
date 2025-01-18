import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { UpdateImageDto } from './dtos/update-image.dto';
import { CreateImageDto } from './dtos/create-image.dto';
import { ImageVersion } from '../image-version/entities/image-version.entity';

@Injectable()
export class ImageService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async create(createImageDto: CreateImageDto): Promise<Image> {
    const image = new Image();
    image.id = createImageDto.id;
    image.description = createImageDto.description;
    this.logger.log(`Creating image: ${image.id}`);
    return this.imageRepository.save(image);
  }

  async findOne(uuid: string): Promise<Image> {
    return this.findImage(uuid);
  }

  async findAll(): Promise<Image[]> {
    return this.imageRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async update(uuid: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findImage(uuid);
    image.id = updateImageDto.id;
    image.description = updateImageDto.description;
    this.logger.log(`Updating image: ${image.id}`);
    return this.imageRepository.save(image);
  }

  async delete(uuid: string): Promise<void> {
    const image = await this.findImage(uuid);
    this.logger.log(`Deleted image: ${uuid}`);
    await this.imageRepository.manager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(ImageVersion, { image: { uuid: image.uuid } });
      await transactionalEntityManager.delete(Image, image.uuid);
    });
  }

  private async findImage(imageUuid: string): Promise<Image> {
    const image = await this.imageRepository.findOne({ where: { uuid: imageUuid } });
    if (!image) {
      this.logger.error(`Image not found: ${imageUuid}`);
      throw new NotFoundException('Image not found');
    }
    return image;
  }
}
