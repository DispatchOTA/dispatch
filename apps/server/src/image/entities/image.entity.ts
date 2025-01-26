import { Workspace } from '../../workspace/entities/workspace.entity';
import { ImageVersion } from '../../image-version/entities/image-version.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Image {
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

  @OneToMany(() => ImageVersion, (imageVersion) => imageVersion.image)
  versions: ImageVersion[];

  @ManyToOne(() => Workspace, (workspace) => workspace.images)
  workspace: Workspace;
}
