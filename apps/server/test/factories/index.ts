import { Artifact } from "src/artifact/entities/artifact.entity";
import { Deployment, DeploymentState } from "../../src/deployment/entities/deployment.entity";
import { Device, DeviceState } from "../../src/device/entities/device.entity";
import { ImageVersion } from "../../src/image-version/entities/image-version.entity";
import { Image } from "../../src/image/entities/image.entity";

export const createMockDevice = (overrides?: Partial<Device>): Device => ({
  uuid: 'device-uuid-1',
  id: 'device-id-1',
  description: 'device-description-1',
  state: DeviceState.UNKNOWN,
  pollingTime: '01:00:00',
  requestConfig: false,
  accessToken: 'access-token-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  deployments: [],
  ...overrides
});

export const createMockImage = (overrides?: Partial<Image>): Image => ({
  uuid: 'image-uuid-1',
  id: 'image-id-1',
  description: 'image-description-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  versions: [],
  ...overrides
});

export const createMockImageVersion = (overrides?: Partial<ImageVersion>): ImageVersion => ({
  uuid: 'image-version-uuid-1',
  id: '1.0.0',
  description: 'image-version-description-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  image: createMockImage(),
  deployments: [],
  artifacts: [],
  ...overrides
});

export const createMockDeployment = (overrides?: Partial<Deployment>): Deployment => ({
  uuid: 'deployment-uuid-1',
  state: DeploymentState.FINISHED,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  device: createMockDevice(),
  imageVersion: createMockImageVersion(),
  getDownloadType: jest.fn(),
  getUpdateType: jest.fn(),
  getMaintenanceWindow: jest.fn(),
  toDDiDto: jest.fn(),
  ...overrides
});

export const createMockArtifact = (overrides?: Partial<Artifact>): Artifact => ({
  uuid: 'artifact-uuid-1',
  filename: 'artifact-filename-1',
  size: 100,
  md5: 'md5-1',
  sha1: 'sha1-1',
  sha256: 'sha256-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  imageVersion: createMockImageVersion(),
  buildDownloadLink: jest.fn(),
  buildMd5SumLink: jest.fn(),
  toDDIDto: jest.fn(),
  buildBaseUrl: jest.fn(),
  getOrigin: jest.fn(),
  ...overrides
});
