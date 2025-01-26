import { Workspace } from '../../workspace/entities/workspace.entity';
import { Artifact } from '../../artifact/entities/artifact.entity';
import { Deployment } from '../../deployment/entities/deployment.entity';
import { Image } from '../../image/entities/image.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class ImageVersion {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  id: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Image, (image) => image.versions)
  image: Image;

  @OneToMany(() => Deployment, (deployment) => deployment.imageVersion)
  deployments: Deployment[];

  @OneToMany(() => Artifact, (artifact) => artifact.imageVersion)
  artifacts: Artifact[];

  @ManyToOne(() => Workspace, (workspace) => workspace.imageVersions)
  workspace: Workspace;
}
