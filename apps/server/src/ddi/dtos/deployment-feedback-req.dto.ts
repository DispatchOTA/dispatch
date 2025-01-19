import { IsOptional, IsString, IsEnum, IsNumber, ValidateNested, IsArray, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export enum FinishedEnum {
  SUCCESS = 'success',
  FAILURE = 'failure',
  NONE = 'none',
}

export enum ExecutionEnum {
  CLOSED = 'closed',
  PROCEEDING = 'proceeding',
  CANCELED = 'canceled',
  SCHEDULED = 'scheduled',
  REJECTED = 'rejected',
  RESUMED = 'resumed',
  DOWNLOADED = 'downloaded',
  DOWNLOAD = 'download',
}

class ProgressDto {
  @IsNumber()
  cnt: number;

  @IsOptional()
  @IsNumber()
  of?: number;
}

class ResultDto {
  @IsEnum(FinishedEnum)
  finished: FinishedEnum;

  @IsOptional()
  @ValidateNested()
  @Type(() => ProgressDto)
  progress?: ProgressDto;
}

class StatusDto {
  @IsEnum(ExecutionEnum)
  execution: ExecutionEnum;

  @ValidateNested()
  @Type(() => ResultDto)
  result: ResultDto;

  @IsOptional()
  @IsNumber()
  code?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  details?: string[];
}

export class DeploymentBaseFeedbackDto {
  @IsOptional()
  @IsString()
  time?: string;

  @ValidateNested()
  @Type(() => StatusDto)
  status: StatusDto;
}

