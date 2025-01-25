import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ImageVersion } from '../../image-version/entities/image-version.entity';
// import { ArtifactDto, HashesDto, LinkDto, LinksDto } from '../ddi/dtos/res/deployment.dto';
// import { Workspace } from '../workspace/workspace.entity';
// import { CommonService } from '../common/common.service';

@Entity()
export class Artifact {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  filename: string;

  @Column()
  size: number;

  @Column()
  md5: string;

  @Column()
  sha1: string;

  @Column()
  sha256: string;

  @Exclude()
  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ImageVersion, (imageVersion) => imageVersion.deployments)
  imageVersion: ImageVersion;

  /*
  toDDIDto(): ArtifactDto {
    const hashes = new HashesDto();
    hashes.sha1 = this.sha1;
    hashes.md5 = this.md5;
    hashes.sha256 = this.sha256;

    const downloadUrl = this.commonService.buildArtifactDownloadLink('tenantId', 'deviceID', 'imageVersionId', 'filename');
    const downloadLinkDto = new LinkDto();
    downloadLinkDto.href = downloadUrl;

    const md5Url = this.commonService.buildArtifactMd5ink(
      this.workspace.id,
      'deviceID', 'imageVersionId', 'filename');
    const md5sumLinkDto = new LinkDto();
    md5sumLinkDto.href = md5Url;

    const links = new LinksDto();
    links.download = downloadLinkDto;
    links['download-http'] = downloadLinkDto;
    links.md5sum = md5sumLinkDto;
    links['md5sum-http'] = md5sumLinkDto;
    
    const artifact = new ArtifactDto();
    artifact.filename = this.filename;
    artifact.hashes = hashes;
    artifact.size = this.size;
    artifact._links = links;

    return artifact;
  }
  */
}
