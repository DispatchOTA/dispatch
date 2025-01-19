import {
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArtifactDto } from './artifacts.res.dto';

export enum StatusEnum {
  CANCELED = 'canceled',
  WARNING = 'warning',
  ERROR = 'error',
  FINISHED = 'finished',
  DOWNLOAD = 'download',
  DOWNLOADED = 'downloaded',
  RUNNING = 'running',
}

export enum DownloadUpdateEnum {
  SKIP = 'skip',
  ATTEMPT = 'attempt',
  FORCED = 'forced',
}

export enum MaintenanceWindowEnum {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

class MetadataDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class ChunkDto {
  @IsString()
  part: string;

  @IsString()
  version: string;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArtifactDto)
  artifacts: ArtifactDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetadataDto)
  metadata: MetadataDto[];
}

export class DeploymentDto {
  @IsEnum(DownloadUpdateEnum)
  download: DownloadUpdateEnum;

  @IsEnum(DownloadUpdateEnum)
  update: DownloadUpdateEnum;

  @IsEnum(MaintenanceWindowEnum)
  maintenanceWindow: MaintenanceWindowEnum;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChunkDto)
  chunks: ChunkDto[];
}

export class ActionHistoryDto {
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsArray()
  @IsString({ each: true })
  messages: string[];
}

export class DeploymentDDIDto {
  @IsString()
  id: string;

  @ValidateNested()
  @Type(() => DeploymentDto)
  deployment: DeploymentDto;

  @ValidateNested()
  @Type(() => ActionHistoryDto)
  actionHistory: ActionHistoryDto;
}
