import { Test, TestingModule } from '@nestjs/testing';
import { DdiController } from './ddi.controller';
import { DdiService } from './ddi.service';
import { NotImplementedException, NotFoundException } from '@nestjs/common';
import { WorkspaceDeviceParams, WorkspaceDeviceDeploymentParams, WorkspaceDeviceImageVersionParams, WorkspaceDeviceImageVersionFilenameParams } from './dtos/path-params.dto';
import { ConfigDto, LinkDto, LinksDto, PollingConfigDto, RootDto } from './dtos/root-res.dto';
import { FinishedEnum } from './dtos/deployment-feedback-req.dto';
import { ExecutionEnum } from './dtos/deployment-feedback-req.dto';
import { DeploymentBaseFeedbackDto } from './dtos/deployment-feedback-req.dto';

describe('DdiController', () => {
  let controller: DdiController;
  let service: DdiService;

  const mockWorkspaceId = 'workspace1';
  const mockDeviceId = 'device1';
  const mockDeploymentId = 'deployment1';
  const mockImageVersionId = 'imageVersion1';
  const mockFileName = 'file1';

  const mockRootResponse: RootDto = {
    config: {
      polling: {
        sleep: '00:10:00'
      }
    }
  };

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
    it('should call service.getRoot with correct params and return root response', async () => {
      const params: WorkspaceDeviceParams = {
        workspaceId: mockWorkspaceId,
        deviceId: mockDeviceId,
      };

      mockDdiService.getRoot.mockResolvedValue(mockRootResponse);

      const result = await controller.getRoot(params);
      
      expect(result).toBeDefined();
      expect(result.config).toBeDefined();
      expect(result.config.polling.sleep).toBe('00:10:00');
      expect(result._links).toBeUndefined();
      expect(service.getRoot).toHaveBeenCalledWith(mockWorkspaceId, mockDeviceId);
    });
  });

  describe('PUT /configData', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.putConfigData()).toThrow(NotImplementedException);
    });
  });

  describe('GET /installedBase/:deploymentId', () => {
    const params: WorkspaceDeviceDeploymentParams = {
      workspaceId: mockWorkspaceId,
      deviceId: mockDeviceId,
      deploymentId: mockDeploymentId,
    };

    it('should return DDI DTO when deployment exists in terminal state', async () => {
      const mockDDiDto = { id: mockDeploymentId, someField: 'value' };
      mockDdiService.getInstalledDeployment.mockResolvedValue(mockDDiDto);

      const result = await controller.getInstalledDeployment(params);
      
      expect(result).toEqual(mockDDiDto);
      expect(service.getInstalledDeployment).toHaveBeenCalledWith(
        mockWorkspaceId,
        mockDeviceId,
        mockDeploymentId
      );
    });

    it('should throw NotFoundException when deployment is in running state', async () => {
      mockDdiService.getInstalledDeployment.mockRejectedValue(
        new NotFoundException('Installed deployment not found')
      );

      await expect(controller.getInstalledDeployment(params))
        .rejects.toThrow(NotFoundException);
      
      expect(service.getInstalledDeployment).toHaveBeenCalledWith(
        mockWorkspaceId,
        mockDeviceId,
        mockDeploymentId
      );
    });

    it('should throw NotFoundException when deployment does not exist', async () => {
      mockDdiService.getInstalledDeployment.mockRejectedValue(
        new NotFoundException('Installed deployment not found')
      );

      await expect(controller.getInstalledDeployment(params))
        .rejects.toThrow(NotFoundException);
      
      expect(service.getInstalledDeployment).toHaveBeenCalledWith(
        mockWorkspaceId,
        mockDeviceId,
        mockDeploymentId
      );
    });
  });

  describe('GET /deploymentBase/:deploymentId', () => {
    const params: WorkspaceDeviceDeploymentParams = {
      workspaceId: mockWorkspaceId,
      deviceId: mockDeviceId,
      deploymentId: mockDeploymentId,
    };

    it('should return DDI DTO when deployment exists in running state', async () => {
      const mockDDiDto = { id: mockDeploymentId, someField: 'value' };
      mockDdiService.getDeploymentBase.mockResolvedValue(mockDDiDto);

      const result = await controller.getDeploymentBase(params);
      
      expect(result).toEqual(mockDDiDto);
      expect(service.getDeploymentBase).toHaveBeenCalledWith(
        mockWorkspaceId,
        mockDeviceId,
        mockDeploymentId
      );
    });

    it('should throw NotFoundException when deployment is in scheduled state', async () => {
      mockDdiService.getDeploymentBase.mockRejectedValue(
        new NotFoundException('Deployment not found')
      );

      await expect(controller.getDeploymentBase(params))
        .rejects.toThrow(NotFoundException);
      
      expect(service.getDeploymentBase).toHaveBeenCalledWith(
        mockWorkspaceId,
        mockDeviceId,
        mockDeploymentId
      );
    });

    it('should throw NotFoundException when deployment does not exist', async () => {
      mockDdiService.getDeploymentBase.mockRejectedValue(
        new NotFoundException('Deployment not found')
      );

      await expect(controller.getDeploymentBase(params))
        .rejects.toThrow(NotFoundException);
      
      expect(service.getDeploymentBase).toHaveBeenCalledWith(
        mockWorkspaceId,
        mockDeviceId,
        mockDeploymentId
      );
    });
  });

  describe('POST /deploymentBase/:deploymentId/feedback', () => {
    it('should call service.postDeploymentFeedback with correct params', async () => {
      const params: WorkspaceDeviceDeploymentParams = {
        workspaceId: mockWorkspaceId,
        deviceId: mockDeviceId,
        deploymentId: mockDeploymentId,
      };

      const mockDeploymentBaseFeedback: DeploymentBaseFeedbackDto = {
        status: {
          execution: ExecutionEnum.CLOSED,
          result: {
            finished: FinishedEnum.SUCCESS,
            progress: {
              cnt: 10,
              of: 100,
            },
          },
          code: 0,
          details: ['detail1', 'detail2'],
        },
        time: new Date().toISOString(),
      };

      mockDdiService.postDeploymentFeedback.mockResolvedValue(null);

      const result = await controller.postDeploymentFeedback(params, mockDeploymentBaseFeedback);
      expect(result).toBeNull();
      expect(service.postDeploymentFeedback).toHaveBeenCalledWith(mockWorkspaceId, mockDeviceId, mockDeploymentId, mockDeploymentBaseFeedback);
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
