import { Deployment } from '../../deployment/entities/deployment.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  id: string;

  @Column()
  description: string;

  @Column()
  state: string;

  @Column()
  pollingTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Deployment, (deployment) => deployment.device)
  deployments: Deployment[];
}
