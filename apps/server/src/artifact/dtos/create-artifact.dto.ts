import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { MIN_FILENAME_LEN, MAX_FILENAME_LEN, MIN_FILE_SIZE, MAX_FILE_SIZE} from '../../common/consts';

export class CreateArtifactDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_FILENAME_LEN)
  @MaxLength(MAX_FILENAME_LEN)
  filename: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(MIN_FILE_SIZE)
  @Max(MAX_FILE_SIZE)
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
