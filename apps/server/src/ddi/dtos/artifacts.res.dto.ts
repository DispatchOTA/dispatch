import {
  IsString,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HashesDto {
  @IsString()
  sha1: string;

  @IsString()
  md5: string;

  @IsString()
  sha256: string;
}

export class LinkDto {
  @IsString()
  href: string;
}

export class LinksDto {
  @ValidateNested()
  @Type(() => LinkDto)
  download: LinkDto;

  @ValidateNested()
  @Type(() => LinkDto)
  'download-http': LinkDto;

  @ValidateNested()
  @Type(() => LinkDto)
  md5sum: LinkDto;

  @ValidateNested()
  @Type(() => LinkDto)
  'md5sum-http': LinkDto;
}

export class ArtifactDto {
  @IsString()
  filename: string;

  @ValidateNested()
  @Type(() => HashesDto)
  hashes: HashesDto;

  @IsNumber()
  size: number;

  @ValidateNested()
  @Type(() => LinksDto)
  _links: LinksDto;
}

