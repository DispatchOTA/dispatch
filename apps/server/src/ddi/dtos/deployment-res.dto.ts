import {
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArtifactDto } from './artifacts.res.dto';
import { DeploymentState } from '../../deployment/entities/deployment.entity';

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
  @IsEnum({
    FINISHED: 'finished',
    ERROR: 'error',
    WARNING: 'warning',
    RUNNING: 'running',
    CANCELED: 'canceled',
    CANCELING: 'canceling',
    RETRIEVED: 'retrieved',
    DOWNLOAD: 'download',
    SCHEDULED: 'scheduled',
    CANCEL_REJECTED: 'cancel_rejected',
    DOWNLOADED: 'downloaded',
    WAIT_FOR_CONFIRMATION: 'wait_for_confirmation',
  })
  status: DeploymentState;

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
