export interface Device {
  uuid: string;
  id: string;
  description: string;
  state: string;
  pollingTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  uuid: string;
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeviceDto {
  id: string;
  description: string;
}

export interface CreateImageDto {
  id: string;
  description: string;
  file: FileList;
}

export interface CreateImageVersionDto {
  id: string;
  description: string;
  file: FileList;
}

export interface CreateDeploymentDto {
  imageId: string;
  imageVersionId: string;
}

export interface Deployment {
  uuid: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageVersion {
  uuid: string;
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}