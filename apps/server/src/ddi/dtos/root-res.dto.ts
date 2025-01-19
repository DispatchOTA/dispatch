import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PollingConfigDto {
  @IsString()
  sleep: string;
}

export class ConfigDto {
  @ValidateNested()
  @Type(() => PollingConfigDto)
  polling: PollingConfigDto;
}

export class LinkDto {
  @IsString()
  href: string;
}

export class LinksDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => LinkDto)
  deploymentBase?: LinkDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LinkDto)
  installedBase?: LinkDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LinkDto)
  configData?: LinkDto;
}

export class PollingResDto {
  @ValidateNested()
  @Type(() => ConfigDto)
  config: ConfigDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => LinksDto)
  _links?: LinksDto;
}
