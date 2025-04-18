import { Test, TestingModule } from '@nestjs/testing';
import { DeploymentController } from './deployment.controller';
import { DeploymentService } from './deployment.service';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';
import { NotFoundException } from '@nestjs/common';
import { createMockDeployment } from '../../test/factories';

describe('DeploymentController', () => {
  let controller: DeploymentController;
  let service: DeploymentService;

  const mockDeployment = createMockDeployment();
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

  describe('POST /devices/:deviceId/deployments', () => {
    const deviceId = 'deviceId';
    
    it('should create a new deployment', async () => {
      const createDeploymentDto: CreateDeploymentDto = {
        imageId: 'imageUuid',
        imageVersionId: 'versionUuid'
      };

      mockDeploymentService.create.mockResolvedValue(mockDeployment);

      const result = await controller.create(deviceId, createDeploymentDto);
      expect(result).toEqual(mockDeployment);
      expect(service.create).toHaveBeenCalledWith(deviceId, createDeploymentDto);
    });

    it('should return 404 if device is not found', async () => {
      const createDeploymentDto: CreateDeploymentDto = {
        imageId: 'imageUuid',
        imageVersionId: 'versionUuid'
      };

      mockDeploymentService.create.mockRejectedValue(new NotFoundException('Device not found'));

      await expect(controller.create(deviceId, createDeploymentDto)).rejects.toThrow(NotFoundException);
      expect(service.create).toHaveBeenCalledWith(deviceId, createDeploymentDto);
    });

    it('should return 404 if image version is not found', async () => {
      const createDeploymentDto: CreateDeploymentDto = {
        imageId: 'imageUuid',
        imageVersionId: 'versionUuid'
      };

      mockDeploymentService.create.mockRejectedValue(new NotFoundException('Image version not found'));

      await expect(controller.create(deviceId, createDeploymentDto)).rejects.toThrow(NotFoundException);
      expect(service.create).toHaveBeenCalledWith(deviceId, createDeploymentDto);
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