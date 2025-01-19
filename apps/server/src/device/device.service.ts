import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Device, DeviceState } from './entities/device.entity';
import { Repository } from 'typeorm';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { DEFAULT_POLLING_TIME } from '../common/consts';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DeviceService.name);

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const device = new Device();
    device.id = createDeviceDto.id;
    device.description = createDeviceDto.description;
    device.pollingTime = DEFAULT_POLLING_TIME;
    device.state = DeviceState.UNKNOWN;
    device.requestConfig = false;
    this.logger.log(`Creating device: ${device.uuid}`);
    return this.deviceRepository.save(device);
  }

  async findOne(uuid: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({ where: { uuid } });
    if (!device) {
      this.logger.error(`Device not found: ${uuid}`);
      throw new NotFoundException('Device not found');
    }
    return device;
  }

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async findDeployments(uuid: string) {
    const device = await this.deviceRepository.findOne({
      where: { uuid },
      relations: ['deployments'],
      relationLoadStrategy: 'query',
      order: {
        deployments: {
          createdAt: 'DESC'
        }
      }
    });
    if (!device) {
      this.logger.error(`Device not found: ${uuid}`);
      throw new NotFoundException('Device not found');
    }
    return device.deployments;
  }

  async update(uuid: string, updateDeviceDto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(uuid);
    if (!device) {
      this.logger.error(`Device not found: ${uuid}`);
      throw new NotFoundException('Device not found');
    }
    device.id = updateDeviceDto.id;
    device.description = updateDeviceDto.description;
    this.logger.log(`Updating device: ${device.uuid}`);
    return this.deviceRepository.save(device);
  }
}
