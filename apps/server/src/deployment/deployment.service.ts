import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Deployment, DeploymentState } from './entities/deployment.entity';
import { Repository } from 'typeorm';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';
import { Device } from '../device/entities/device.entity';
import { ImageVersion } from '../image-version/entities/image-version.entity';

@Injectable()
export class DeploymentService {
  private readonly logger = new Logger(DeploymentService.name);

  constructor(
    @InjectRepository(Deployment)
    private readonly deploymentRepository: Repository<Deployment>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(ImageVersion)
    private readonly imageVersionRepository: Repository<ImageVersion>,
  ) {}

  async create(deviceId: string, createDeploymentDto: CreateDeploymentDto): Promise<Deployment> {
    const device = await this.deviceRepository.findOne({
      where: { uuid: deviceId }
    });
    if (!device) {
      this.logger.error(`Device not found: ${deviceId}`);
      throw new NotFoundException(`Device not found`);
    }
    const imageVersion = await this.imageVersionRepository.findOne({
      where: { uuid: createDeploymentDto.imageVersionId, image: { uuid: createDeploymentDto.imageId } }
    });
    if (!imageVersion) {
      this.logger.error(`Image version not found: ${createDeploymentDto.imageVersionId}`);
      throw new NotFoundException(`Image version not found`);
    }
    const deployment = new Deployment();
    deployment.device = device;
    deployment.imageVersion = imageVersion;
    deployment.state = DeploymentState.SCHEDULED;
    this.logger.log(`Creating deployment: ${deployment.uuid}`);
    return this.deploymentRepository.save(deployment);
  }

  async findAll(): Promise<Deployment[]> {
    return this.deploymentRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }
}
