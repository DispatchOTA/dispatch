import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { UpdateImageDto } from './dtos/update-image.dto';
import { CreateImageDto } from './dtos/create-image.dto';

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
    const image = await this.imageRepository.findOne({ where: { uuid } });
    if (!image) {
      this.logger.error(`Image not found: ${uuid}`);
      throw new NotFoundException('Image not found');
    }
    return image;
  }

  async findAll(): Promise<Image[]> {
    return this.imageRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async update(uuid: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findOne(uuid);
    if (!image) {
      this.logger.error(`Image not found: ${uuid}`);
      throw new NotFoundException('Image not found');
    }
    image.id = updateImageDto.id;
    image.description = updateImageDto.description;
    this.logger.log(`Updating image: ${image.id}`);
    return this.imageRepository.save(image);
  }

  async delete(uuid: string): Promise<void> {
    const image = await this.findOne(uuid);
    if (!image) {
      this.logger.error(`Image not found: ${uuid}`);
      throw new NotFoundException('Image not found');
    }
    this.logger.log(`Deleted image: ${uuid}`);
    await this.imageRepository.delete(uuid);
  }
}
