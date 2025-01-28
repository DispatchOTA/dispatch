import { Test, TestingModule } from '@nestjs/testing';
import { DeploymentService } from './deployment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Deployment, DeploymentState } from './entities/deployment.entity';
import { Device } from '../device/entities/device.entity';
import { ImageVersion } from '../image-version/entities/image-version.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { createMockDeployment, createMockDevice, createMockImageVersion } from '../../test/factories';

describe('DeploymentService', () => {
  let service: DeploymentService;
  let deploymentRepository: Repository<Deployment>;
  let deviceRepository: Repository<Device>;
  let imageVersionRepository: Repository<ImageVersion>;

  const mockDeployment = createMockDeployment();
  const mockDevice = createMockDevice();
  const mockImageVersion = createMockImageVersion();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeploymentService,
        {
          provide: getRepositoryToken(Deployment),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Device),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ImageVersion),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeploymentService>(DeploymentService);
    deploymentRepository = module.get<Repository<Deployment>>(getRepositoryToken(Deployment));
    deviceRepository = module.get<Repository<Device>>(getRepositoryToken(Device));
    imageVersionRepository = module.get<Repository<ImageVersion>>(getRepositoryToken(ImageVersion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const deviceId = 'deviceId';
    const createDeploymentDto = {
      imageId: 'imageId',
      imageVersionId: 'versionId'
    };

    it('should create a deployment successfully', async () => {
      jest.spyOn(deviceRepository, 'findOne').mockResolvedValue(mockDevice);
      jest.spyOn(imageVersionRepository, 'findOne').mockResolvedValue(mockImageVersion);
      jest.spyOn(deploymentRepository, 'save').mockResolvedValue(mockDeployment);

      const result = await service.create(deviceId, createDeploymentDto);

      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: deviceId }
      });
      expect(imageVersionRepository.findOne).toHaveBeenCalledWith({
        where: { 
          uuid: createDeploymentDto.imageVersionId,
          image: { uuid: createDeploymentDto.imageId }
        }
      });
      expect(deploymentRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        device: mockDevice,
        imageVersion: mockImageVersion,
        state: DeploymentState.SCHEDULED
      }));
      expect(result).toEqual(mockDeployment);
    });

    it('should throw NotFoundException if device is not found', async () => {
      jest.spyOn(deviceRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(deviceId, createDeploymentDto)).rejects.toThrow(
        new NotFoundException('Device not found')
      );
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: deviceId }
      });
      expect(imageVersionRepository.findOne).not.toHaveBeenCalled();
      expect(deploymentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if image version is not found', async () => {
      jest.spyOn(deviceRepository, 'findOne').mockResolvedValue(mockDevice);
      jest.spyOn(imageVersionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(deviceId, createDeploymentDto)).rejects.toThrow(
        new NotFoundException('Image version not found')
      );
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: deviceId }
      });
      expect(imageVersionRepository.findOne).toHaveBeenCalledWith({
        where: { 
          uuid: createDeploymentDto.imageVersionId,
          image: { uuid: createDeploymentDto.imageId }
        }
      });
      expect(deploymentRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of deployments', async () => {
      const deployments = [mockDeployment];
      jest.spyOn(deploymentRepository, 'find').mockResolvedValue(deployments);

      const result = await service.findAll();

      expect(result).toEqual(deployments);
      expect(deploymentRepository.find).toHaveBeenCalledWith({
        order: {
          createdAt: 'DESC'
        }
      });
    });

    it('should return an empty array if no deployments are found', async () => {
      jest.spyOn(deploymentRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(deploymentRepository.find).toHaveBeenCalledWith({
        order: {
          createdAt: 'DESC'
        }
      });
    });
  });
}); 