import { Workspace } from '../entities/workspace.entity';

export class WorkspaceDetailDto {
  uuid: string;
  id: string;
  defaultPollingTime: string;
  createdAt: Date;
  updatedAt: Date;
  numDevices: number;
  numImages: number;

  constructor(workspace: Workspace) {
    Object.assign(this, {
      ...workspace,
      numDevices: workspace.devices?.length || 0,
      numImages: workspace.images?.length || 0
    });
  }
} 