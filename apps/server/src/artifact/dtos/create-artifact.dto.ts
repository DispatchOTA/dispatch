import { IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { MIN_FILENAME_LEN, MAX_FILENAME_LEN } from '../../common/consts';

export class CreateArtifactDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_FILENAME_LEN)
  @MaxLength(MAX_FILENAME_LEN)
  filename: string;

  @IsNotEmpty()
  @IsNumber()
  // VALIDATE
  size: number;

  @IsNotEmpty()
  @IsString()
  md5: string;

  @IsNotEmpty()
  @IsString()
  sha1: string;

  @IsNotEmpty()
  @IsString()
  sha256: string;

  @IsNotEmpty()
  content: Buffer;

}
