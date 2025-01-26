import { Exclude } from 'class-transformer';
import { Deployment } from '../../deployment/entities/deployment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Workspace } from '../../workspace/entities/workspace.entity';

export enum DeviceState {
  UNKNOWN = 'unknown',
  IN_SYNC = 'in_sync',
  PENDING = 'pending',
  ERROR = 'error',
}

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  id: string;

  @Column()
  description: string;

  @Column()
  state: DeviceState;

  @Column()
  pollingTime: string;

  @Exclude()
  @Column()
  requestConfig: boolean;

  @Exclude()
  @Column()
  accessToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Deployment, (deployment) => deployment.device)
  deployments: Deployment[];

  @ManyToOne(() => Workspace, (workspace) => workspace.devices)
  workspace: Workspace;
}
