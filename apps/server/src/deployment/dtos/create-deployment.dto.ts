import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateDeploymentDto {
  @IsUUID()
  @IsNotEmpty()
  imageId: string;

  @IsUUID()
  @IsNotEmpty()
  imageVersionId: string;
}
