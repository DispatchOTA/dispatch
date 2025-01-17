import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ImageVersionService } from './image-version.service';
import { ImageVersion } from './entities/image-version.entity';
import { UUIDParamDto } from '../common/dtos/uuid-param.dto';
import { CreateImageVersionDto } from './dtos/create-image-version.dto';
import { UpdateImageVersionDto } from './dtos/update-image-version.dto';
import { MessageDto } from '../common/dtos/message.dto';
import { IsUUID } from 'class-validator';

export class ImageVersionParamDto {
  @IsUUID()
  imageUuid: string;

  @IsUUID()
  versionUuid: string;
}

@Controller()
export class ImageVersionController {
  constructor(private readonly imageVersionService: ImageVersionService) {}

  @Post('images/:uuid/versions')
  async create(@Param() params: UUIDParamDto, @Body() createImageVersionDto: CreateImageVersionDto) {
    return this.imageVersionService.create(params.uuid, createImageVersionDto);
  }

  @Get('images/:uuid/versions')
  findAll(@Param() params: UUIDParamDto): Promise<ImageVersion[]> {
    return this.imageVersionService.findAll(params.uuid);
  }

  @Put('images/:imageUuid/versions/:versionUuid')
  async update(
    @Param() params: ImageVersionParamDto,
    @Body() updateImageVersionDto: UpdateImageVersionDto,
  ) {
    return this.imageVersionService.update(params.imageUuid, params.versionUuid, updateImageVersionDto);
  }

  @Delete('images/:imageUuid/versions/:versionUuid')
  async delete(@Param() params: ImageVersionParamDto): Promise<MessageDto> {
    await this.imageVersionService.delete(params.imageUuid, params.versionUuid);
    return new MessageDto('Image version has been deleted');
  }
}
