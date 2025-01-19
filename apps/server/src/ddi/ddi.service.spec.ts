import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DdiService } from './ddi.service';
import { Deployment } from '../deployment/entities/deployment.entity';
import { Logger, NotImplementedException } from '@nestjs/common';

describe('DdiService', () => {
  let service: DdiService;
  let repository: Repository<Deployment>;

  const mockDeploymentRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
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
      ],
    }).compile();

    service = module.get<DdiService>(DdiService);
    repository = module.get<Repository<Deployment>>(getRepositoryToken(Deployment));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoot', () => {
    it('should return hello world object', async () => {
      const result = await service.getRoot(mockWorkspaceId, mockDeviceId);
      expect(result).toEqual({ hello: 'world' });
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