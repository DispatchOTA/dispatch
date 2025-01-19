import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deployment } from '../deployment/entities/deployment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DdiService {
  private readonly logger = new Logger(DdiService.name);

  constructor(
    @InjectRepository(Deployment)
    private readonly deploymentRepository: Repository<Deployment>,
  ) {}

  async getRoot(
    workspaceId: string,
    deviceId: string,
  ) {
    return {
      hello: 'world',
    }
  }

  async getInstalledDeployment(
    workspaceId: string,
    deviceId: string,
    deploymentId: string,
  ) {
    return {
      hello: 'world',
    }
  }

  async getDeploymentBase(
    workspaceId: string,
    deviceId: string,
    deploymentId: string,
  ) {
    return {
      hello: 'world',
    }
  }

  async postDeploymentFeedback(
    workspaceId: string,
    deviceId: string,
    deploymentId: string,
  ) {
    return {
      hello: 'world',
    }
  }

  async getArtifacts(
    workspaceId: string,
    deviceId: string,
    imageVersionId: string,
  ) {
    return {
      hello: 'world',
    }
  }

  async downloadArtifact(
    workspaceId: string,
    deviceId: string,
    imageVersionId: string,
    fileName: string,
  ) {
    return {
      hello: 'world',
    }
  }

  async downloadArtifactMD5(
    workspaceId: string,
    deviceId: string,
    imageVersionId: string,
    fileName: string,
  ) {
    return {
      hello: 'world',
    }
  }
}
