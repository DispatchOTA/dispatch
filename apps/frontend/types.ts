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