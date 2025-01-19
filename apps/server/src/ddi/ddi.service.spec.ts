import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DdiService } from './ddi.service';
import { Deployment } from '../deployment/entities/deployment.entity';
import { Device } from '../device/entities/device.entity';
import { NotFoundException } from '@nestjs/common';

describe('DdiService', () => {
  let service: DdiService;
  let deploymentRepository: Repository<Deployment>;
  let deviceRepository: Repository<Device>;

  const mockDevice: Device = {
    uuid: 'uuid',
    id: 'device1',
    description: 'test device',
    state: 'active',
    pollingTime: '30',
    createdAt: new Date(),
    updatedAt: new Date(),
    deployments: [],
  };

  const mockDeploymentRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  const mockDeviceRepository = {
    findOne: jest.fn(),
  };

  const mockWorkspaceId = 'workspace1';
  const mockDeviceId = 'device1';
  const mockDeploymentId = 'deployment1';
  const mockImageVersionId = 'imageVersion1';
  const mockFileName = 'file1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DdiService,
        {
          provide: getRepositoryToken(Deployment),
          useValue: mockDeploymentRepository,
        },
        {
          provide: getRepositoryToken(Device),
          useValue: mockDeviceRepository,
        },
      ],
    }).compile();

    service = module.get<DdiService>(DdiService);
    deploymentRepository = module.get<Repository<Deployment>>(getRepositoryToken(Deployment));
    deviceRepository = module.get<Repository<Device>>(getRepositoryToken(Device));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoot', () => {
    it('should return root response with config when device exists', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(mockDevice);

      const result = await service.getRoot(mockWorkspaceId, mockDeviceId);
      
      expect(result).toBeDefined();
      expect(result.config).toBeDefined();
      expect(result.config.polling.sleep).toBe('00:10:00');
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDeviceId }
      });
    });

    it('should throw NotFoundException when device does not exist', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(null);

      await expect(service.getRoot(mockWorkspaceId, mockDeviceId))
        .rejects.toThrow(NotFoundException);
      
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockDeviceId }
      });
    });
  });

  describe('getInstalledDeployment', () => {
    it('should return hello world object', async () => {
      const result = await service.getInstalledDeployment(mockWorkspaceId, mockDeviceId, mockDeploymentId);
      expect(result).toEqual({ hello: 'world' });
    });
  });

  describe('getDeploymentBase', () => {
    it('should return hello world object', async () => {
      const result = await service.getDeploymentBase(mockWorkspaceId, mockDeviceId, mockDeploymentId);
      expect(result).toEqual({ hello: 'world' });
    });
  });

  describe('postDeploymentFeedback', () => {
    it('should return hello world object', async () => {
      const result = await service.postDeploymentFeedback(mockWorkspaceId, mockDeviceId, mockDeploymentId);
      expect(result).toEqual({ hello: 'world' });
    });
  });

  describe('getArtifacts', () => {
    it('should return hello world object', async () => {
      const result = await service.getArtifacts(mockWorkspaceId, mockDeviceId, mockImageVersionId);
      expect(result).toEqual({ hello: 'world' });
    });
  });

  describe('downloadArtifact', () => {
    it('should return hello world object', async () => {
      const result = await service.downloadArtifact(mockWorkspaceId, mockDeviceId, mockImageVersionId, mockFileName);
      expect(result).toEqual({ hello: 'world' });
    });
  });

  describe('downloadArtifactMD5', () => {
    it('should return hello world object', async () => {
      const result = await service.downloadArtifactMD5(mockWorkspaceId, mockDeviceId, mockImageVersionId, mockFileName);
      expect(result).toEqual({ hello: 'world' });
    });
  });
}); 