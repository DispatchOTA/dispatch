import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { Deployment } from './entities/deployment.entity';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';

@Controller()
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Post('deployments')
  async create(@Body() createDeploymentDto: CreateDeploymentDto) {
    return this.deploymentService.create(createDeploymentDto);
  }

  @Get('deployments')
  findAll(): Promise<Deployment[]> {
    return this.deploymentService.findAll();
  }
}
