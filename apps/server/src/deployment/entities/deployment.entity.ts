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
  FINISHED, // finished successfully
  ERROR, // failed
  WARNING, // still runing with warnings
  RUNNING, // still running
  CANCELED, // cancelled
  CANCELING, // in cancelling state and waiting for cancel confirmation
  RETRIEVED, // send to device
  DOWNLOAD, // device has started downloading
  SCHEDULED, // scheduled in a rollout but not active
  CANCEL_REJECTED, // cancelletaion rejected by device
  DOWNLOADED, // image has been downloaded and waiting to update
  WAIT_FOR_CONFIRMATION // deployment waiting to be confirmed
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
}
