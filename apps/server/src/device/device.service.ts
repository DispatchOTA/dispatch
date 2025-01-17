import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { CreateDeviceDto } from './dtos/create-device.dto';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const device = new Device();
    device.name = createDeviceDto.name;
    device.description = createDeviceDto.description;
    this.logger.log(`Creating device: ${device.id}`);
    return this.deviceRepository.save(device);
  }

  async findOne(id: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      this.logger.error(`Device not found: ${id}`);
      throw new NotFoundException('Device not found');
    }
    return device;
  }

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find();
  }

  async update(id: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id);
    if (!device) {
      this.logger.error(`Device not found: ${id}`);
      throw new NotFoundException('Device not found');
    }
    device.name = updateDeviceDto.name;
    device.description = updateDeviceDto.description;
    this.logger.log(`Updating device: ${device.id}`);
    return this.deviceRepository.save(device);
  }

  async delete(id: string): Promise<void> {
    const device = await this.findOne(id);
    if (!device) {
      this.logger.error(`Device not found: ${id}`);
      throw new NotFoundException('Device not found');
    }
    this.logger.log(`Deleted device: ${id}`);
    await this.deviceRepository.delete(id);
  }
}
