import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { ImageVersion } from '../../image-version/entities/image-version.entity';
import { ArtifactDto, HashesDto, LinkDto, LinksDto } from '../../ddi/dtos/artifacts.res.dto'
import { ConfigService } from '@nestjs/config';

@Entity()
export class Artifact {
  // constructor(private readonly configService: ConfigService) {}

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ImageVersion, (imageVersion) => imageVersion.artifacts)
  imageVersion: ImageVersion;

  toDDIDto(deviceId: string): ArtifactDto {
    const hashes = new HashesDto();
    hashes.sha1 = this.sha1;
    hashes.md5 = this.md5;
    hashes.sha256 = this.sha256;

    const downloadUrl = this.buildDownloadLink(deviceId);
    const downloadLinkDto = new LinkDto();
    downloadLinkDto.href = downloadUrl;

    const md5Url = this.buildMd5SumLink(deviceId);
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

  getOrigin() {
    // return this.configService.get<string>('ORIGIN');
    return 'http://localhost:3000';
  }

  buildBaseUrl(deviceId: string) {
    const workspaceId = 'workspace1' // TODO: implement workspaceId
    return `${this.getOrigin()}/ddi/${workspaceId}/controller/v1/${deviceId}`;
  }

  buildDownloadLink(deviceId: string) {
    const baseUrl = this.buildBaseUrl(deviceId);
    const imageVersionId = this.imageVersion.id;
    const filename = this.filename;
    return `${baseUrl}/softwaremodules/${imageVersionId}/filename/${filename}`;
  }

  buildMd5SumLink(deviceId: string) {
    const baseUrl = this.buildBaseUrl(deviceId);
    const imageVersionId = this.imageVersion.id;
    const filename = this.filename;
    return `${baseUrl}/softwaremodules/${imageVersionId}/filename/${filename}.MD5SUM`;
  }  
}
