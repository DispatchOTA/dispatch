import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateDeploymentDto {
  @IsUUID()
  @IsNotEmpty()
  deviceUuid: string;
}
