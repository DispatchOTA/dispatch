import { IsUUID } from "class-validator";

export class ImageVersionParamDto {
  @IsUUID()
  imageUuid: string;

  @IsUUID()
  versionUuid: string;
}