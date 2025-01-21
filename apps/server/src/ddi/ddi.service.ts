import { GoneException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Deployment, DeploymentState } from '../deployment/entities/deployment.entity';
import { In, Not, Repository } from 'typeorm';
import { ConfigDto, LinkDto, LinksDto, PollingConfigDto, RootDto } from './dtos/root-res.dto';
import { Device } from '../device/entities/device.entity';
import { ConfigService } from '@nestjs/config';
import { ExecutionEnum, FinishedEnum } from './dtos/deployment-feedback-req.dto';
import { DeploymentBaseFeedbackDto } from './dtos/deployment-feedback-req.dto';

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
    const device = await this.getDeviceOrThrow(deviceId);
    const installedDeployment = await this.findInstalledDeployment(deviceId);
    const inFlightDeployment = await this.findInFlightDeployment(deviceId);
    return this.buildRootResponse(
      device.pollingTime,
      device.requestConfig,
      device.uuid,
      installedDeployment?.uuid,
      inFlightDeployment?.uuid,
    );
  }

  async getInstalledDeployment(
    workspaceId: string,
    deviceId: string,
    deploymentId: string,
  ) {
    const installedDeployment = await this.deploymentRepository.findOne({
      where: {
        uuid: deploymentId,
        device: {
          uuid: deviceId,
        },
        state: In([
          // in one of the terminal states
          DeploymentState.FINISHED,
          DeploymentState.ERROR,
          DeploymentState.DOWNLOADED,
        ]),
      },
    });
    if (!installedDeployment) {
      throw new NotFoundException('Installed deployment not found');
    }
    return installedDeployment.toDDiDto();
  }

  async getDeploymentBase(
    workspaceId: string,
    deviceId: string,
    deploymentId: string,
  ) {
    const deployment = await this.deploymentRepository.findOne({
      where: {
        uuid: deploymentId,
        device: {
          uuid: deviceId,
        },
        state: Not(In([
          // returns deployments in a running and terminal states
          DeploymentState.SCHEDULED,
          DeploymentState.CANCELED, 
          DeploymentState.CANCELING,
          DeploymentState.WAIT_FOR_CONFIRMATION,
        ])),
      },
    });
    if (!deployment) {
      throw new NotFoundException('Deployment not found');
    }
    await this.deploymentRepository.update(deployment.uuid, {
      state: DeploymentState.RETRIEVED,
    });
    return deployment.toDDiDto();
  }

  async postDeploymentFeedback(
    workspaceId: string,
    deviceId: string,
    deploymentId: string,
    deploymentBaseFeedback: DeploymentBaseFeedbackDto,
  ) {
    const device = await this.getDeviceOrThrow(deviceId);
    const deployment = await this.getDeploymentOrThrow(deploymentId);

    if(deployment.isInTerminalState()) {
      throw new GoneException('Deployment is in a terminal state');
    }

    const { state, messages } = this.handleDeploymentFeedback(deploymentBaseFeedback);

    await this.deploymentRepository.update(deployment.uuid, {
      state,
    });

    return;
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

  // private

  async getDeviceOrThrow(deviceId: string) {
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

  async getDeploymentOrThrow(deploymentId: string) {
    const deployment = await this.deploymentRepository.findOne({
      where: {
        uuid: deploymentId,
      },
    });
    if (!deployment) {
      throw new NotFoundException('Deployment not found');
    }
    return deployment;
  }

  async findInFlightDeployment(deviceId: string): Promise<Deployment | null> {
    return this.deploymentRepository.findOne({
      where: {
        device: {
          uuid: deviceId,
        },
        state: DeploymentState.RUNNING,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findInstalledDeployment(deviceId: string): Promise<Deployment | null> {
    return this.deploymentRepository.findOne({
      where: {
        device: {
          uuid: deviceId,
        },
        state: DeploymentState.FINISHED,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  private buildRootResponse(
    pollingTime: string,
    requestConfig: boolean,
    deviceId: string,
    installedDeploymentId: string | undefined,
    inFlightDeploymentId: string | undefined,
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
      link.href = this.buildConfigLink(deviceId);
      links.configData = link;
    }
    if (installedDeploymentId) {
      const link = new LinkDto();
      link.href = this.buildInstalledBaseLink(deviceId, installedDeploymentId);
      links.installedBase = link;
    }
    if (inFlightDeploymentId) {
      const link = new LinkDto();
      link.href = this.buildDeploymentBaseLink(deviceId, inFlightDeploymentId);
      links.deploymentBase = link;
    }
    if (requestConfig || installedDeploymentId || inFlightDeploymentId) {
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

  buildConfigLink(deviceId: string) {
    const baseUrl = this.buildBaseUrl(deviceId);
    return `${baseUrl}/configData`;
  }

  buildInstalledBaseLink(deviceId: string, deploymentId: string) {
    const baseUrl = this.buildBaseUrl(deviceId);
    return `${baseUrl}/installedBase/${deploymentId}`;
  }

  buildDeploymentBaseLink(deviceId: string, deploymentId: string) {
    const baseUrl = this.buildBaseUrl(deviceId);
    return `${baseUrl}/deploymentBase/${deploymentId}`;
  }


  handleDeploymentFeedback(deploymentBaseFeedback: DeploymentBaseFeedbackDto): { state: DeploymentState; messages: string[]} {
    let state: DeploymentState;
    const messages: string[] = [];

    const feedbackDetailMessages = deploymentBaseFeedback.status.details;
    if (feedbackDetailMessages && feedbackDetailMessages.length > 0) {
      messages.concat(feedbackDetailMessages);
    }

    switch (deploymentBaseFeedback.status.execution) {
      case ExecutionEnum.CANCELED:
        state = DeploymentState.CANCELED;
        messages.push("Server update: Device confirmed cancelation.");
      break;

      case ExecutionEnum.REJECTED:
        state = DeploymentState.WARNING;
        messages.push("Server update: Device rejected update.");
      break;

      case ExecutionEnum.CLOSED:
        const result = deploymentBaseFeedback.status.result.finished;
        if (result === FinishedEnum.FAILURE) {
          state = DeploymentState.ERROR;
          messages.push("Server update: Device reported result with error.");
        } else {
          state = DeploymentState.FINISHED;
          messages.push("Server update: Device reported result with success.");
        }
      break;

      case ExecutionEnum.DOWNLOAD:
        state = DeploymentState.DOWNLOAD;
        messages.push("Server update: Device confirmed download start.");
      break;

      case ExecutionEnum.DOWNLOADED:
        state = DeploymentState.DOWNLOADED;
        messages.push("Server update: Device confirmed download finished.");
      break;

      default:
        state = DeploymentState.RUNNING;
        messages.push(`Server update: Device reported intermediate feedback ${deploymentBaseFeedback.status.execution}`);
      break;
    }

    return {
      state,
      messages
    };
  }
}

