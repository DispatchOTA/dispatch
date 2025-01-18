import { Test, TestingModule } from '@nestjs/testing';
import { DdiController } from './ddi.controller';
import { NotImplementedException } from '@nestjs/common';

describe('DdiController', () => {
  let controller: DdiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DdiController],
    }).compile();

    controller = module.get<DdiController>(DdiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.getRoot()).toThrow(NotImplementedException);
    });
  });

  describe('PUT /configData', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.putConfigData()).toThrow(NotImplementedException);
    });
  });

  describe('GET /installedBase/:deploymentId', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.getInstalledDeployment()).toThrow(NotImplementedException);
    });
  });

  describe('GET /deploymentBase/:deploymentId', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.getDeploymentBase()).toThrow(NotImplementedException);
    });
  });

  describe('POST /deploymentBase/:deploymentId/feedback', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.postDeploymentFeedback()).toThrow(NotImplementedException);
    });
  });

  describe('GET /softwaremodules/:imageVersionId/artifacts', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.getArtifacts()).toThrow(NotImplementedException);
    });
  });

  describe('GET /softwaremodules/:imageVersionId/artifacts/:fileName', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.downloadArtifact()).toThrow(NotImplementedException);
    });
  });

  describe('GET /softwaremodules/:imageVersionId/artifacts/:fileName.MD5SUM', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.downloadArtifactMD5()).toThrow(NotImplementedException);
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
