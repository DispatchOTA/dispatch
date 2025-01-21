import { Deployment, DeploymentState } from './deployment.entity';
import { DownloadUpdateEnum } from '../../ddi/dtos/deployment-res.dto';
import { createMockDevice, createMockImageVersion } from '../../../test/factories';

describe('Deployment', () => {
  let deployment: Deployment;
  const mockDevice = createMockDevice();
  const mockImageVersion = createMockImageVersion();

  beforeEach(() => {
    deployment = new Deployment();
    deployment.uuid = 'test-uuid';
    deployment.state = DeploymentState.RUNNING;
    deployment.device = mockDevice;
    deployment.imageVersion = mockImageVersion;
    deployment.createdAt = new Date();
    deployment.updatedAt = new Date();
  });

  describe('isInTerminalState', () => {
    it.each([
      DeploymentState.FINISHED,
      DeploymentState.ERROR,
      DeploymentState.DOWNLOADED,
    ])('should return true when state is %s', (state) => {
      deployment.state = state;
      expect(deployment.isInTerminalState()).toBe(true);
    });

    it.each([
      DeploymentState.RUNNING,
      DeploymentState.SCHEDULED,
      DeploymentState.CANCELING,
      DeploymentState.CANCELED,
      DeploymentState.WARNING,
      DeploymentState.RETRIEVED,
      DeploymentState.DOWNLOAD,
      DeploymentState.CANCEL_REJECTED,
      DeploymentState.WAIT_FOR_CONFIRMATION,
    ])('should return false when state is %s', (state) => {
      deployment.state = state;
      expect(deployment.isInTerminalState()).toBe(false);
    });
  });

  describe('getDownloadType', () => {
    it('should return ATTEMPT', () => {
      expect(deployment.getDownloadType()).toBe(DownloadUpdateEnum.ATTEMPT);
    });
  });

  describe('getUpdateType', () => {
    it('should return ATTEMPT', () => {
      expect(deployment.getUpdateType()).toBe(DownloadUpdateEnum.ATTEMPT);
    });
  });

  describe('getMaintenanceWindow', () => {
    it('should return undefined', () => {
      expect(deployment.getMaintenanceWindow()).toBeUndefined();
    });
  });

  describe('toDDiDto', () => {
    it('should convert deployment to DDI DTO', () => {
      const result = deployment.toDDiDto();
      expect(result.id).toBe(deployment.uuid);
      expect(result.actionHistory.status).toBe(deployment.state);
      expect(result.actionHistory.messages).toEqual([]);
      expect(result.deployment.download).toBe(DownloadUpdateEnum.ATTEMPT);
      expect(result.deployment.update).toBe(DownloadUpdateEnum.ATTEMPT);
      expect(result.deployment.maintenanceWindow).toBeUndefined();
      expect(result.deployment.chunks).toHaveLength(1);
      const chunk = result.deployment.chunks[0];
      expect(chunk.part).toBe('');
      expect(chunk.version).toBe('');
      expect(chunk.name).toBe('');
      expect(chunk.artifacts).toEqual([]);
      expect(chunk.metadata).toEqual([]);
    });

    it('should handle different deployment states', () => {
      deployment.state = DeploymentState.FINISHED;
      let result = deployment.toDDiDto();
      expect(result.actionHistory.status).toBe(DeploymentState.FINISHED);

      deployment.state = DeploymentState.ERROR;
      result = deployment.toDDiDto();
      expect(result.actionHistory.status).toBe(DeploymentState.ERROR);

      deployment.state = DeploymentState.SCHEDULED;
      result = deployment.toDDiDto();
      expect(result.actionHistory.status).toBe(DeploymentState.SCHEDULED);
    });
  });
});
