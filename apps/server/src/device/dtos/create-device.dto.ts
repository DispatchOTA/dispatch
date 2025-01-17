import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { MAX_DESC_LEN, MAX_NAME_LEN, MIN_DESC_LEN, MIN_NAME_LEN } from '../../common/consts';

export class CreateDeviceDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_NAME_LEN)
  @MaxLength(MAX_NAME_LEN)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(MIN_DESC_LEN)
  @MaxLength(MAX_DESC_LEN)
  description: string;
}
