import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class WorkspaceDeviceParams {
  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;

  @IsUUID()
  @IsNotEmpty()
  deviceId: string;
}

export class WorkspaceDeviceDeploymentParams extends WorkspaceDeviceParams {
  @IsUUID()
  @IsNotEmpty()
  deploymentId: string;
}

export class WorkspaceDeviceImageVersionParams extends WorkspaceDeviceParams {
  @IsUUID()
  @IsNotEmpty()
  imageVersionId: string;
}

export class WorkspaceDeviceImageVersionFilenameParams extends WorkspaceDeviceImageVersionParams {
  @IsString()
  @IsNotEmpty()
  fileName: string;
}