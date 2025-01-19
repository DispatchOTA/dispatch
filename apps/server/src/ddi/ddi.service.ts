import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deployment, DeploymentState } from '../deployment/entities/deployment.entity';
import { Repository } from 'typeorm';
import { ConfigDto, LinkDto, LinksDto, PollingConfigDto, RootDto } from './dtos/root-res.dto';
import { Device } from '../device/entities/device.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DdiService {
  private readonly logger = new Logger(DdiService.name);

  constructor(
    @InjectRepository(Deployment)
    private readonly deploymentRepository: Repository<Deployment>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly configService: ConfigService
  ) {}

  async getRoot(
    workspaceId: string,
    deviceId: string,
  ): Promise<RootDto> {
    const device = await this.getDevice(deviceId);
    const installedDeployment = null;
    const inFlightDeployment = null;
    return this.buildRootResponse(
      device.pollingTime,
      false,
      device,
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
        uuid: deviceId,
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
    device: Device,
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
      link.href = this.buildConfigLink(device.uuid);
      links.configData = link;
    }
    if (installedDeployment) {
      const link = new LinkDto();
      link.href = this.buildInstalledBaseLink(device.uuid, installedDeployment.uuid);
      links.installedBase = link;
    }
    if (inFlightDeployment) {
      const link = new LinkDto();
      link.href = this.buildDeploymentBaseLink(device.uuid, inFlightDeployment.uuid);
      links.deploymentBase = link;
    }
    if (requestConfig || installedDeployment || inFlightDeployment) {
      root._links = links;
    }
    return root;
  }

  private getOrigin() {
    return this.configService.get<string>('ORIGIN');
  }

  private buildBaseUrl(deviceId: string) {
    const workspaceId = 'workspace1' // TODO: implement workspaceId
    return `${this.getOrigin()}/ddi/${workspaceId}/controller/v1/${deviceId}`;
  }

  buildConfigLink(deviceId: string): string {
    const baseUrl = this.buildBaseUrl(deviceId);
    return `${baseUrl}/configData`;
  }

  buildInstalledBaseLink(deviceId: string, deploymentId: string): string {
    const baseUrl = this.buildBaseUrl(deviceId);
    return `${baseUrl}/installedBase/${deploymentId}`;
  }

  buildDeploymentBaseLink(deviceId: string, deploymentId: string) {
    const baseUrl = this.buildBaseUrl(deviceId);
    return `${baseUrl}/deploymentBase/${deploymentId}`;
  }
}

