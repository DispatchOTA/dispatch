import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DeploymentService } from './deployment.service';
import { Deployment } from './entities/deployment.entity';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';

@Controller()
export class DeploymentController {
  constructor(private readonly deploymentService: DeploymentService) {}

  @Post('/devices/:deviceId/deployments')
  async create(@Param('deviceId') deviceId: string, @Body() createDeploymentDto: CreateDeploymentDto) {
    return this.deploymentService.create(deviceId, createDeploymentDto);
  }

  @Get('deployments')
  findAll(): Promise<Deployment[]> {
    return this.deploymentService.findAll();
  }
}
