import { IsUUID, IsNotEmpty } from 'class-validator';

export class UUIDParamDto {
  @IsUUID()
  @IsNotEmpty()
  uuid: string;
}