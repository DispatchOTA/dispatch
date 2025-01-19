import { IsEnum, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// TODO validate size of keys and values
class ConfigDataDto {
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => String)
  data: Record<string, string>;
}

enum ModeEnum {
  MERGE = 'merge',
  REPLACE = 'replace',
  REMOVE = 'remove',
}

export class ConfigReqDto {
  @ValidateNested()
  @Type(() => ConfigDataDto)
  data: ConfigDataDto;

  @IsOptional()
  @IsEnum(ModeEnum)
  @Transform(({ value }) => (value === null || value === undefined ? ModeEnum.MERGE : value))
  mode?: ModeEnum;
}
