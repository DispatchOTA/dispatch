import { Test, TestingModule } from '@nestjs/testing';
import { DeploymentController } from './deployment.controller';
import { DeploymentService } from './deployment.service';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';
import { Deployment, DeploymentState } from './entities/deployment.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeploymentController', () => {
  let controller: DeploymentController;
  let service: DeploymentService;

  const mockDeployment: Deployment = {
    uuid: 'uuid',
    state: DeploymentState.SCHEDULED,
    createdAt: new Date(),
    updatedAt: new Date(),
    device: {
      uuid: 'deviceUuid',
      id: 'deviceId',
      description: 'test device',
      state: 'active',
      pollingTime: '60',
      createdAt: new Date(),
      updatedAt: new Date(),
      deployments: []
    },
    imageVersion: {
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
      },
      deployments: []
    }
  };

  const mockDeploymentService = {
    create: jest.fn(),
    findAll: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeploymentController],
      providers: [
        {
          provide: DeploymentService,
          useValue: mockDeploymentService,
        },
      ],
    }).compile();

    controller = module.get<DeploymentController>(DeploymentController);
    service = module.get<DeploymentService>(DeploymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /deployments', () => {
    it('should create a new deployment', async () => {
      const createDeploymentDto: CreateDeploymentDto = {
        deviceUuid: 'deviceUuid',
        imageVersionUuid: 'versionUuid'
      };

      mockDeploymentService.create.mockResolvedValue(mockDeployment);

      const result = await controller.create(createDeploymentDto);
      expect(result).toEqual(mockDeployment);
      expect(service.create).toHaveBeenCalledWith(createDeploymentDto);
    });

    it('should return 404 if device is not found', async () => {
      const createDeploymentDto: CreateDeploymentDto = {
        deviceUuid: 'nonexistentDeviceUuid',
        imageVersionUuid: 'versionUuid'
      };

      mockDeploymentService.create.mockRejectedValue(new NotFoundException('Device not found'));

      await expect(controller.create(createDeploymentDto)).rejects.toThrow(NotFoundException);
      expect(service.create).toHaveBeenCalledWith(createDeploymentDto);
    });

    it('should return 404 if image version is not found', async () => {
      const createDeploymentDto: CreateDeploymentDto = {
        deviceUuid: 'nonexistentDeviceUuid',
        imageVersionUuid: 'versionUuid'
      };

      mockDeploymentService.create.mockRejectedValue(new NotFoundException('Image version not found'));

      await expect(controller.create(createDeploymentDto)).rejects.toThrow(NotFoundException);
      expect(service.create).toHaveBeenCalledWith(createDeploymentDto);
    });
  });

  describe('GET /deployments', () => {
    it('should return an array of deployments', async () => {
      const deployments = [mockDeployment];
      mockDeploymentService.findAll.mockResolvedValue(deployments);

      const result = await controller.findAll();
      expect(result).toEqual(deployments);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array if no deployments are found', async () => {
      mockDeploymentService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});