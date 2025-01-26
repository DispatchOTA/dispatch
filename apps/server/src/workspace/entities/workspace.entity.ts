import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Device } from '../../device/entities/device.entity';
import { Deployment } from '../../deployment/entities/deployment.entity';
import { Image } from '../../image/entities/image.entity';
import { ImageVersion } from '../../image-version/entities/image-version.entity';
import { Artifact } from '../../artifact/entities/artifact.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  id: string;

  @Column()
  defaultPollingTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @OneToMany(() => User, (user) => user.workspace)
  // users: User[];

  @OneToMany(() => Device, (device) => device.workspace)
  devices: Device[];

  @OneToMany(() => Deployment, (deployment) => deployment.workspace)
  deployments: Deployment[];

  @OneToMany(() => Image, (image) => image.workspace)
  images: Image[];

  @OneToMany(() => ImageVersion, (imageVersion) => imageVersion.workspace)
  imageVersions: ImageVersion[];

  @OneToMany(() => Artifact, (artifact) => artifact.workspace)
  artifacts: Artifact[];
}
