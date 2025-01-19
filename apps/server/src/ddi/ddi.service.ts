import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deployment } from '../deployment/entities/deployment.entity';
import { Repository } from 'typeorm';
import { ConfigDto, LinkDto, LinksDto, PollingConfigDto, RootDto } from './dtos/root-res.dto';
import { Device } from '../device/entities/device.entity';

@Injectable()
export class DdiService {
  private readonly logger = new Logger(DdiService.name);

  constructor(
    @InjectRepository(Deployment)
    private readonly deploymentRepository: Repository<Deployment>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async getRoot(
    workspaceId: string,
    deviceId: string,
  ): Promise<RootDto> {
    const device = await this.getDevice(deviceId);
    const installedDeployment = null;
    const inFlightDeployment = null;
    return this.buildRootResponse(
      '00:10:00',
      false,
      installedDeployment,
      inFlightDeployment,
    );
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


  private async getDevice(deviceId: string) {
    const device = await this.deviceRepository.findOne({
      where: {
        id: deviceId,
      },
    });
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    return device;
  }

  private buildRootResponse(
    pollingTime: string,
    requestConfig: boolean,
    installedDeployment: Deployment | null,
    inFlightDeployment: Deployment | null,
  ): RootDto {
    const root = new RootDto();

    // config
    const pollingConfig = new PollingConfigDto();
    pollingConfig.sleep = pollingTime;
    const config = new ConfigDto();
    config.polling = pollingConfig;
    root.config = config;

    // links
    const links = new LinksDto();
    if (requestConfig) {
      const link = new LinkDto();
      link.href = 'http://example.com/config';
      links.configData = link;
    }
    if (installedDeployment) {
      const link = new LinkDto();
      link.href = 'http://example.com/installedDeployment';
      links.installedBase = link;
    }
    if (inFlightDeployment) {
      const link = new LinkDto();
      link.href = 'http://example.com/inFlightDeployment';
      links.deploymentBase = link;
    }
    if (requestConfig || installedDeployment || inFlightDeployment) {
      root._links = links;
    }
    return root;
  }
}

