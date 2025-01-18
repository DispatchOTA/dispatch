import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeploymentService } from './deployment.service';
import { Deployment, DeploymentState } from './entities/deployment.entity';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';
import { NotFoundException } from '@nestjs/common';
import { Device } from '../device/entities/device.entity';
import { ImageVersion } from '../image-version/entities/image-version.entity';

describe('DeploymentService', () => {
  let service: DeploymentService;
  let deploymentRepository: Repository<Deployment>;
  let deviceRepository: Repository<Device>;
  let imageVersionRepository: Repository<ImageVersion>;

  const mockDevice: Device = {
    uuid: 'deviceUuid',
    id: 'deviceId',
    description: 'test device',
    state: 'active',
    pollingTime: '60',
    createdAt: new Date(),
    updatedAt: new Date(),
    deployments: []
  };

  const mockImageVersion: ImageVersion = {
    uuid: 'versionUuid',
    id: 'versionId',
    description: 'test version',
    createdAt: new Date(),
    updatedAt: new Date(),
    image: {
      uuid: 'imageUuid',
      id: 'imageId',
      description: 'test image',
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: []
    }
  };

  const mockDeployment: Deployment = {
    uuid: 'uuid',
    state: DeploymentState.SCHEDULED,
    createdAt: new Date(),
    updatedAt: new Date(),
    device: mockDevice
  };

  const mockDeploymentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn()
  };

  const mockDeviceRepository = {
    findOne: jest.fn()
  };

  const mockImageVersionRepository = {
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeploymentService,
        {
          provide: getRepositoryToken(Deployment),
          useValue: mockDeploymentRepository,
        },
        {
          provide: getRepositoryToken(Device),
          useValue: mockDeviceRepository,
        },
        {
          provide: getRepositoryToken(ImageVersion),
          useValue: mockImageVersionRepository,
        },
      ],
    }).compile();

    service = module.get<DeploymentService>(DeploymentService);
    deploymentRepository = module.get<Repository<Deployment>>(getRepositoryToken(Deployment));
    deviceRepository = module.get<Repository<Device>>(getRepositoryToken(Device));
    imageVersionRepository = module.get<Repository<ImageVersion>>(getRepositoryToken(ImageVersion));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDeploymentDto: CreateDeploymentDto = {
      deviceUuid: 'deviceUuid',
      // imageVersionUuid: 'versionUuid'
    };

    it('should successfully create a deployment', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(mockDevice);
      mockImageVersionRepository.findOne.mockResolvedValue(mockImageVersion);
      mockDeploymentRepository.save.mockResolvedValue(mockDeployment);

      const result = await service.create(createDeploymentDto);
      
      expect(result).toEqual(mockDeployment);
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: createDeploymentDto.deviceUuid }
      });
      expect(deploymentRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          device: mockDevice,
          state: DeploymentState.SCHEDULED
        })
      );
    });

    it('should throw NotFoundException if device is not found', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDeploymentDto))
        .rejects.toThrow(NotFoundException);
      
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: createDeploymentDto.deviceUuid }
      });
      expect(deploymentRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of deployments', async () => {
      mockDeploymentRepository.find.mockResolvedValue([mockDeployment]);

      const result = await service.findAll();
      expect(result).toEqual([mockDeployment]);
      expect(deploymentRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' }
      });
    });

    it('should return an empty array when no deployments exist', async () => {
      mockDeploymentRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(deploymentRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' }
      });
    });
  });
}); 