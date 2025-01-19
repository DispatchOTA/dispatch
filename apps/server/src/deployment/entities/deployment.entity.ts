import { ImageVersion } from '../../image-version/entities/image-version.entity';
import { Device } from '../../device/entities/device.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

export enum DeploymentState {
  FINISHED = 'finished', // finished successfully
  ERROR = 'error', // failed
  WARNING = 'warning', // still runing with warnings
  RUNNING = 'running', // still running
  CANCELED = 'canceled', // cancelled
  CANCELING = 'canceling', // in cancelling state and waiting for cancel confirmation
  RETRIEVED = 'retrieved', // send to device
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
}
