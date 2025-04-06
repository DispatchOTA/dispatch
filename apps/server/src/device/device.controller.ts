import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { UUIDParamDto } from '../common/dtos/uuid-param.dto';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';

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

  @Get('devices/:uuid')
  async findOne(@Param() params: UUIDParamDto): Promise<Device> {
    return this.deviceService.findOne(params.uuid);
  }

  @Get('devices/:uuid/deployments')
  async findDeployments(@Param() params: UUIDParamDto) {
    return this.deviceService.findDeployments(params.uuid);
  }

  @Put('devices/:uuid')
  async update(@Param() params: UUIDParamDto, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.deviceService.update(params.uuid, updateDeviceDto);
  }
}
