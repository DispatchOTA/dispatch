import { Test, TestingModule } from '@nestjs/testing';
import { DdiController } from './ddi.controller';
import { DdiService } from './ddi.service';
import { NotImplementedException } from '@nestjs/common';
import { WorkspaceDeviceParams, WorkspaceDeviceDeploymentParams, WorkspaceDeviceImageVersionParams, WorkspaceDeviceImageVersionFilenameParams } from './dtos/path-params.dto';

describe('DdiController', () => {
  let controller: DdiController;
  let service: DdiService;

  const mockWorkspaceId = 'workspace1';
  const mockDeviceId = 'device1';
  const mockDeploymentId = 'deployment1';
  const mockImageVersionId = 'imageVersion1';
  const mockFileName = 'file1';

  const mockDdiService = {
    getRoot: jest.fn(),
    getInstalledDeployment: jest.fn(),
    getDeploymentBase: jest.fn(),
    postDeploymentFeedback: jest.fn(),
    getArtifacts: jest.fn(),
    downloadArtifact: jest.fn(),
    downloadArtifactMD5: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DdiController],
      providers: [
        {
          provide: DdiService,
          useValue: mockDdiService,
        },
      ],
    }).compile();

    controller = module.get<DdiController>(DdiController);
    service = module.get<DdiService>(DdiService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /', () => {
    it('should call service.getRoot with correct params', async () => {
      const params: WorkspaceDeviceParams = {
        workspaceId: mockWorkspaceId,
        deviceId: mockDeviceId,
      };

      mockDdiService.getRoot.mockResolvedValue({ hello: 'world' });

      const result = await controller.getRoot(params);
      expect(result).toEqual({ hello: 'world' });
      expect(service.getRoot).toHaveBeenCalledWith(mockWorkspaceId, mockDeviceId);
    });
  });

  describe('PUT /configData', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.putConfigData()).toThrow(NotImplementedException);
    });
  });

  describe('GET /installedBase/:deploymentId', () => {
    it('should call service.getInstalledDeployment with correct params', async () => {
      const params: WorkspaceDeviceDeploymentParams = {
        workspaceId: mockWorkspaceId,
        deviceId: mockDeviceId,
        deploymentId: mockDeploymentId,
      };

      mockDdiService.getInstalledDeployment.mockResolvedValue({ hello: 'world' });

      const result = await controller.getInstalledDeployment(params);
      expect(result).toEqual({ hello: 'world' });
      expect(service.getInstalledDeployment).toHaveBeenCalledWith(mockWorkspaceId, mockDeviceId, mockDeploymentId);
    });
  });

  describe('GET /deploymentBase/:deploymentId', () => {
    it('should call service.getDeploymentBase with correct params', async () => {
      const params: WorkspaceDeviceDeploymentParams = {
        workspaceId: mockWorkspaceId,
        deviceId: mockDeviceId,
        deploymentId: mockDeploymentId,
      };

      mockDdiService.getDeploymentBase.mockResolvedValue({ hello: 'world' });

      const result = await controller.getDeploymentBase(params);
      expect(result).toEqual({ hello: 'world' });
      expect(service.getDeploymentBase).toHaveBeenCalledWith(mockWorkspaceId, mockDeviceId, mockDeploymentId);
    });
  });

  describe('POST /deploymentBase/:deploymentId/feedback', () => {
    it('should call service.postDeploymentFeedback with correct params', async () => {
      const params: WorkspaceDeviceDeploymentParams = {
        workspaceId: mockWorkspaceId,
        deviceId: mockDeviceId,
        deploymentId: mockDeploymentId,
      };

      mockDdiService.postDeploymentFeedback.mockResolvedValue({ hello: 'world' });

      const result = await controller.postDeploymentFeedback(params);
      expect(result).toEqual({ hello: 'world' });
      expect(service.postDeploymentFeedback).toHaveBeenCalledWith(mockWorkspaceId, mockDeviceId, mockDeploymentId);
    });
  });

  describe('GET /softwaremodules/:imageVersionId/artifacts', () => {
    it('should call service.getArtifacts with correct params', async () => {
      const params: WorkspaceDeviceImageVersionParams = {
        workspaceId: mockWorkspaceId,
        deviceId: mockDeviceId,
        imageVersionId: mockImageVersionId,
      };

      mockDdiService.getArtifacts.mockResolvedValue({ hello: 'world' });

      const result = await controller.getArtifacts(params);
      expect(result).toEqual({ hello: 'world' });
      expect(service.getArtifacts).toHaveBeenCalledWith(mockWorkspaceId, mockDeviceId, mockImageVersionId);
    });
  });

  describe('GET /softwaremodules/:imageVersionId/artifacts/:fileName', () => {
    it('should call service.downloadArtifact with correct params', async () => {
      const params: WorkspaceDeviceImageVersionFilenameParams = {
        workspaceId: mockWorkspaceId,
        deviceId: mockDeviceId,
        imageVersionId: mockImageVersionId,
        fileName: mockFileName,
      };

      mockDdiService.downloadArtifact.mockResolvedValue({ hello: 'world' });

      const result = await controller.downloadArtifact(params);
      expect(result).toEqual({ hello: 'world' });
      expect(service.downloadArtifact).toHaveBeenCalledWith(mockWorkspaceId, mockDeviceId, mockImageVersionId, mockFileName);
    });
  });

  describe('GET /softwaremodules/:imageVersionId/artifacts/:fileName.MD5SUM', () => {
    it('should call service.downloadArtifactMD5 with correct params', async () => {
      const params: WorkspaceDeviceImageVersionFilenameParams = {
        workspaceId: mockWorkspaceId,
        deviceId: mockDeviceId,
        imageVersionId: mockImageVersionId,
        fileName: mockFileName,
      };

      mockDdiService.downloadArtifactMD5.mockResolvedValue({ hello: 'world' });

      const result = await controller.downloadArtifactMD5(params);
      expect(result).toEqual({ hello: 'world' });
      expect(service.downloadArtifactMD5).toHaveBeenCalledWith(mockWorkspaceId, mockDeviceId, mockImageVersionId, mockFileName);
    });
  });

  describe('GET /cancelAction/:deploymentId', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.cancelDeployment()).toThrow(NotImplementedException);
    });
  });

  describe('POST /cancelAction/:deploymentId/feedback', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.cancelDeploymentFeedback()).toThrow(NotImplementedException);
    });
  });

  describe('GET /confirmationBase', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.getConfirmationBase()).toThrow(NotImplementedException);
    });
  });

  describe('GET /confirmationBase/:deploymentId', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.getDeploymentConfirmation()).toThrow(NotImplementedException);
    });
  });

  describe('POST /confirmationBase/:deploymentId/feedback', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.postConfirmationFeedback()).toThrow(NotImplementedException);
    });
  });

  describe('POST /confirmationBase/activateAutoConfirm', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.activateAutoConfirm()).toThrow(NotImplementedException);
    });
  });

  describe('POST /confirmationBase/deactivateAutoConfirm', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.deactivateAutoConfirm()).toThrow(NotImplementedException);
    });
  });
});
