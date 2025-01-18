import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { MAX_DESC_LEN, MAX_ID_LEN, MIN_DESC_LEN, MIN_ID_LEN } from '../../common/consts';

export class UpdateImageDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_ID_LEN)
  @MaxLength(MAX_ID_LEN)
  id: string;

  @IsOptional()
  @IsString()
  @MinLength(MIN_DESC_LEN)
  @MaxLength(MAX_DESC_LEN)
  description: string;
}
