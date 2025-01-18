import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Deployment, DeploymentState } from './entities/deployment.entity';
import { Repository } from 'typeorm';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';

@Injectable()
export class DeploymentService {
  private readonly logger = new Logger(DeploymentService.name);

  constructor(
    @InjectRepository(Deployment)
    private readonly deploymentRepository: Repository<Deployment>,
  ) {}

  async create(createDeploymentDto: CreateDeploymentDto): Promise<Deployment> {
    const deployment = new Deployment();
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
