import { Deployment } from '../../deployment/entities/deployment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Deployment, (deployment) => deployment.device)
  deployments: Deployment[];
}
