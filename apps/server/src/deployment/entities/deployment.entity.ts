import { ImageVersion } from '../../image-version/entities/image-version.entity';
import { Device } from '../../device/entities/device.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { 
  ActionHistoryDto,
  ChunkDto,
  DeploymentDto,
  DeploymentDDIDto,
  DownloadUpdateEnum,
  MaintenanceWindowEnum,
} from '../../ddi/dtos/deployment-res.dto';
import { Workspace } from '../../workspace/entities/workspace.entity';

export enum DeploymentState {
  FINISHED = 'finished', // finished successfully
  ERROR = 'error', // failed
  WARNING = 'warning', // still runing with warnings
  RUNNING = 'running', // still running
  CANCELED = 'canceled', // cancelled
  CANCELING = 'canceling', // in cancelling state and waiting for cancel confirmation
  RETRIEVED = 'retrieved', // sent to device
  DOWNLOAD = 'download', // device has started downloading
  SCHEDULED = 'scheduled', // scheduled in a rollout but not active
  CANCEL_REJECTED = 'cancel_rejected', // cancelletaion rejected by device
  DOWNLOADED = 'downloaded', // image has been downloaded and waiting to update
  WAIT_FOR_CONFIRMATION = 'wait_for_confirmation', // deployment waiting to be confirmed
}

@Entity()
export class Deployment {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  state: DeploymentState;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Device, (device) => device.deployments)
  device: Device;

  @ManyToOne(() => ImageVersion, (imageVersion) => imageVersion.deployments)
  imageVersion: ImageVersion;
  
  @ManyToOne(() => Workspace, (workspace) => workspace.deployments)
  workspace: Workspace;

  getDownloadType(): DownloadUpdateEnum {
    return DownloadUpdateEnum.ATTEMPT;
  }

  getUpdateType(): DownloadUpdateEnum {
    return DownloadUpdateEnum.ATTEMPT;
  }

  getMaintenanceWindow(): MaintenanceWindowEnum | undefined {
    return undefined;
  }

  toDDiDto(): DeploymentDDIDto {
    const chunkDto = new ChunkDto();
    chunkDto.part = ''; // TODO
    chunkDto.version = this.imageVersion.id;
    chunkDto.name = ''; // TODO
    chunkDto.artifacts = this.imageVersion.artifacts.map(artifact => artifact.toDDIDto(this.device.id));
    chunkDto.metadata = [];

    const deploymentDto = new DeploymentDto();
    deploymentDto.chunks = [
      chunkDto
    ];
    deploymentDto.download = this.getDownloadType()
    deploymentDto.update = this.getUpdateType()
    const maintenanceWindow = this.getMaintenanceWindow();
    if (maintenanceWindow) {
      deploymentDto.maintenanceWindow = maintenanceWindow;
    }

    const actionHistoryDto = new ActionHistoryDto();   
    actionHistoryDto.status = this.state;
    actionHistoryDto.messages = []; // TODO

    const deploymentDDIDto = new DeploymentDDIDto();
    deploymentDDIDto.id = this.uuid;
    deploymentDDIDto.deployment = deploymentDto;
    deploymentDDIDto.actionHistory = actionHistoryDto;
     
    return deploymentDDIDto;
  }
}
