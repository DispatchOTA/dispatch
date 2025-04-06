import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { UUIDParamDto } from '../common/dtos/uuid-param.dto';
import { CreateImageDto } from './dtos/create-image.dto';
import { UpdateImageDto } from './dtos/update-image.dto';
import { MessageDto } from '../common/dtos/message.dto';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('images')
  async create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Get('images')
  findAll(): Promise<Image[]> {
    return this.imageService.findAll();
  }

  @Get('images/:uuid')
  async findOne(@Param() params: UUIDParamDto): Promise<Image> {
    return this.imageService.findOne(params.uuid);
  }

  @Put('images/:uuid')
  async update(@Param() params: UUIDParamDto, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(params.uuid, updateImageDto);
  }

  @Get('images/:uuid/deployments')
  async findDeployments(@Param() params: UUIDParamDto) {
    return this.imageService.findDeployments(params.uuid);
  }

}
