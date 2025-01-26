import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { MIN_ID_LEN, MAX_ID_LEN, POLLING_TIME_REGEX } from '../../common/consts';


export class CreateWorkspaceDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_ID_LEN)
  @MaxLength(MAX_ID_LEN)
  id: string;

  @IsNotEmpty()
  @IsString()
  @Matches(POLLING_TIME_REGEX, {
    message: 'defaultPollingTime must be in format HH:MM:SS'
  })
  defaultPollingTime: string;
}
