import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { IDParamDto } from '../common/dtos/id-param.dto';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { MessageDto } from '../common/dtos/message.dto';

@Controller()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('devices')
  async create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

  @Get('devices')
  findAll(): Promise<Device[]> {
    return this.deviceService.findAll();
  }

  @Get('devices/:id')
  async findOne(@Param() params: IDParamDto): Promise<Device> {
    return this.deviceService.findOne(params.id);
  }

  @Put('devices/:id')
  async update(@Param() params: IDParamDto, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.deviceService.update(params.id, updateDeviceDto);
  }

  @Delete('devices/:id')
  async delete(@Param() params: IDParamDto): Promise<MessageDto> {
    await this.deviceService.delete(params.id);
    return new MessageDto('Device has been deleted');
  }
}
