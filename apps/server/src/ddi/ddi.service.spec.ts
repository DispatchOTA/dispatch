import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DdiService } from './ddi.service';
import { Deployment, DeploymentState } from '../deployment/entities/deployment.entity';
import { Device } from '../device/entities/device.entity';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createMockDeployment, createMockDevice } from '../../test/factories';
import { In } from 'typeorm';

describe('DdiService', () => {
  let service: DdiService;
  let deploymentRepository: Repository<Deployment>;
  let deviceRepository: Repository<Device>;
  let configService: ConfigService;

  const mockWorkspaceId = 'workspace1';
  const mockDeviceId = 'device-uuid-1';
  const mockDeploymentId = 'deployment1';
  const mockImageVersionId = 'imageVersion1';
  const mockFileName = 'file1';
  const mockOrigin = 'http://localhost:3000';
  const mockDevice = createMockDevice();

  const mockDeploymentRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockDeviceRepository = {
    findOne: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn()
  };

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
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<DdiService>(DdiService);
    deploymentRepository = module.get<Repository<Deployment>>(getRepositoryToken(Deployment));
    deviceRepository = module.get<Repository<Device>>(getRepositoryToken(Device));
    configService = module.get<ConfigService>(ConfigService);
    jest.clearAllMocks();

    mockConfigService.get.mockReturnValue(mockOrigin);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRoot', () => {
    it('should return root response with no links', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(mockDevice);
      mockDeploymentRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      const result = await service.getRoot(mockWorkspaceId, mockDeviceId);
      
      expect(result).toBeDefined();
      expect(result.config).toBeDefined();
      expect(result.config.polling.sleep).toBe('01:00:00');
      expect(result._links).toBeUndefined();
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: mockDeviceId }
      });
    });

    it('should include installedBase link when device has installed deployment', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(mockDevice);
      const mockInstalledDeployment = {
        uuid: 'installed-deployment-uuid',
        state: DeploymentState.FINISHED,
        createdAt: new Date(),
        updatedAt: new Date(),
        device: mockDevice,
        imageVersion: null
      };
      mockDeploymentRepository.findOne
        .mockResolvedValueOnce(mockInstalledDeployment) // for installed deployment
        .mockResolvedValueOnce(null); // for in-flight deployment

      const result = await service.getRoot(mockWorkspaceId, mockDeviceId);
      
      expect(result._links).toBeDefined();
      expect(result._links!.installedBase).toBeDefined();
      expect(result._links!.installedBase!.href).toBe(
        `${mockOrigin}/ddi/${mockWorkspaceId}/controller/v1/${mockDeviceId}/installedBase/${mockInstalledDeployment.uuid}`
      );
      expect(result._links!.deploymentBase).toBeUndefined();
      expect(deploymentRepository.findOne).toHaveBeenCalledWith({
        where: {
          device: { uuid: mockDeviceId },
          state: DeploymentState.FINISHED
        },
        order: { createdAt: 'DESC' }
      });
    });

    it('should include deploymentBase link when device has in-flight deployment', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(mockDevice);
      const mockInFlightDeployment = {
        uuid: 'in-flight-deployment-uuid',
        state: DeploymentState.RUNNING,
        createdAt: new Date(),
        updatedAt: new Date(),
        device: mockDevice,
        imageVersion: null
      };
      mockDeploymentRepository.findOne
        .mockResolvedValueOnce(null) // for installed deployment
        .mockResolvedValueOnce(mockInFlightDeployment); // for in-flight deployment

      const result = await service.getRoot(mockWorkspaceId, mockDeviceId);
      
      expect(result._links).toBeDefined();
      expect(result._links!.deploymentBase).toBeDefined();
      expect(result._links!.deploymentBase!.href).toBe(
        `${mockOrigin}/ddi/${mockWorkspaceId}/controller/v1/${mockDeviceId}/deploymentBase/${mockInFlightDeployment.uuid}`
      );
      expect(result._links!.installedBase).toBeUndefined();
      expect(deploymentRepository.findOne).toHaveBeenCalledWith({
        where: {
          device: { uuid: mockDeviceId },
          state: DeploymentState.RUNNING
        },
        order: { createdAt: 'DESC' }
      });
    });

    it('should throw NotFoundException when device does not exist', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(null);

      await expect(service.getRoot(mockWorkspaceId, mockDeviceId))
        .rejects.toThrow(NotFoundException);
      
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: mockDeviceId }
      });
    });
  });

  describe('getInstalledDeployment', () => {
    it('should return DDI DTO when deployment exists in FINISHED state', async () => {
      const mockDeployment = createMockDeployment({
        uuid: mockDeploymentId,
        device: mockDevice,
        state: DeploymentState.FINISHED
      });

      const mockDDiDto = { id: mockDeploymentId, someField: 'value' };
      mockDeployment.toDDiDto = jest.fn().mockReturnValue(mockDDiDto);
      
      mockDeploymentRepository.findOne.mockResolvedValue(mockDeployment);

      const result = await service.getInstalledDeployment(mockWorkspaceId, mockDeviceId, mockDeploymentId);
      
      expect(result).toEqual(mockDDiDto);
      expect(mockDeployment.toDDiDto).toHaveBeenCalled();
      expect(deploymentRepository.findOne).toHaveBeenCalledWith({
        where: {
          uuid: mockDeploymentId,
          device: {
            uuid: mockDeviceId,
          },
          state: In([
            DeploymentState.FINISHED,
            DeploymentState.ERROR,
            DeploymentState.DOWNLOADED,
          ]),
        },
      });
    });

    it('should return DDI DTO when deployment exists in ERROR state', async () => {
      const mockDeployment = createMockDeployment({
        uuid: mockDeploymentId,
        device: mockDevice,
        state: DeploymentState.ERROR
      });

      const mockDDiDto = { id: mockDeploymentId, someField: 'value' };
      mockDeployment.toDDiDto = jest.fn().mockReturnValue(mockDDiDto);
      
      mockDeploymentRepository.findOne.mockResolvedValue(mockDeployment);

      const result = await service.getInstalledDeployment(mockWorkspaceId, mockDeviceId, mockDeploymentId);
      
      expect(result).toEqual(mockDDiDto);
      expect(mockDeployment.toDDiDto).toHaveBeenCalled();
    });

    it('should return DDI DTO when deployment exists in DOWNLOADED state', async () => {
      const mockDeployment = createMockDeployment({
        uuid: mockDeploymentId,
        device: mockDevice,
        state: DeploymentState.DOWNLOADED
      });

      const mockDDiDto = { id: mockDeploymentId, someField: 'value' };
      mockDeployment.toDDiDto = jest.fn().mockReturnValue(mockDDiDto);
      
      mockDeploymentRepository.findOne.mockResolvedValue(mockDeployment);

      const result = await service.getInstalledDeployment(mockWorkspaceId, mockDeviceId, mockDeploymentId);
      
      expect(result).toEqual(mockDDiDto);
      expect(mockDeployment.toDDiDto).toHaveBeenCalled();
    });

    it('should throw NotFoundException when deployment does not exist', async () => {
      mockDeploymentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getInstalledDeployment(mockWorkspaceId, mockDeviceId, mockDeploymentId)
      ).rejects.toThrow(new NotFoundException('Installed deployment not found'));
      
      expect(deploymentRepository.findOne).toHaveBeenCalledWith({
        where: {
          uuid: mockDeploymentId,
          device: {
            uuid: mockDeviceId,
          },
          state: In([
            DeploymentState.FINISHED,
            DeploymentState.ERROR,
            DeploymentState.DOWNLOADED,
          ]),
        },
      });
    });

    it('should throw NotFoundException when deployment is in wrong state', async () => {
      mockDeploymentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getInstalledDeployment(mockWorkspaceId, mockDeviceId, mockDeploymentId)
      ).rejects.toThrow(new NotFoundException('Installed deployment not found'));
    });
  });

  describe('getDeploymentBase', () => {
    it('should return DDI DTO when deployment exists in RUNNING state', async () => {
      const mockDeployment = createMockDeployment({
        uuid: mockDeploymentId,
        device: mockDevice,
        state: DeploymentState.RUNNING
      });

      const mockDDiDto = { id: mockDeploymentId, someField: 'value' };
      mockDeployment.toDDiDto = jest.fn().mockReturnValue(mockDDiDto);
      
      mockDeploymentRepository.findOne.mockResolvedValue(mockDeployment);

      const result = await service.getDeploymentBase(mockWorkspaceId, mockDeviceId, mockDeploymentId);
      
      expect(result).toEqual(mockDDiDto);
      expect(mockDeployment.toDDiDto).toHaveBeenCalled();
      expect(deploymentRepository.findOne).toHaveBeenCalledWith({
        where: {
          uuid: mockDeploymentId,
          device: {
            uuid: mockDeviceId,
          },
          state: Not(In([
            DeploymentState.SCHEDULED,
            DeploymentState.CANCELED, 
            DeploymentState.CANCELING,
            DeploymentState.WAIT_FOR_CONFIRMATION,
          ])),
        },
      });
      expect(deploymentRepository.update).toHaveBeenCalledWith(mockDeploymentId, {
        state: DeploymentState.RETRIEVED
      });
    });

    it('should throw NotFoundException when deployment does not exist', async () => {
      mockDeploymentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getDeploymentBase(mockWorkspaceId, mockDeviceId, mockDeploymentId)
      ).rejects.toThrow(new NotFoundException('Deployment not found'));
      
      expect(deploymentRepository.findOne).toHaveBeenCalledWith({
        where: {
          uuid: mockDeploymentId,
          device: {
            uuid: mockDeviceId,
          },
          state: Not(In([
            DeploymentState.SCHEDULED,
            DeploymentState.CANCELED, 
            DeploymentState.CANCELING,
            DeploymentState.WAIT_FOR_CONFIRMATION,
          ])),
        },
      });
    });

    it('should throw NotFoundException when deployment is in wrong state', async () => {
      mockDeploymentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.getDeploymentBase(mockWorkspaceId, mockDeviceId, mockDeploymentId)
      ).rejects.toThrow(new NotFoundException('Deployment not found'));
    });
  });

  describe('postDeploymentFeedback', () => {
    
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

  describe('getDeviceOrThrow', () => {
    it('should return device', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(mockDevice);
      const result = await service.getDeviceOrThrow(mockDeviceId);
      expect(result).toEqual(mockDevice);
    });

    it('should throw NotFoundException when device does not exist', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(null);
      await expect(service.getDeviceOrThrow(mockDeviceId))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('deployments', () => {
    
    const mockDeployments = [
      createMockDeployment({
        state: DeploymentState.SCHEDULED,
        createdAt: new Date('2024-01-05'),
        device: mockDevice,
      }),
      createMockDeployment({
        state: DeploymentState.RUNNING,
        createdAt: new Date('2024-01-02'),
        device: mockDevice,
      }),
      createMockDeployment({
        state: DeploymentState.RUNNING,
        createdAt: new Date('2024-01-01'),
        device: mockDevice,
      }),
      createMockDeployment({
        state: DeploymentState.SCHEDULED,
        createdAt: new Date('2024-01-03'),
        device: mockDevice,
      }),
      createMockDeployment({
        state: DeploymentState.FINISHED,
        createdAt: new Date('2024-01-04'),
        device: mockDevice,
      }),
      createMockDeployment({
        state: DeploymentState.FINISHED,
        createdAt: new Date('2024-01-03'),
        device: mockDevice,
      }),
    ];

    describe('findInstalledDeployment', () => {
      it('should return the most recent installed deployment', async () => {
        mockDeploymentRepository.findOne.mockResolvedValue(mockDeployments[4]);
        const result = await service.findInstalledDeployment(mockDeviceId);
        expect(result).toEqual(mockDeployments[4]);
      });

      it('should return null when no installed deployment', async () => {
        mockDeploymentRepository.findOne.mockResolvedValue(null);
        const result = await service.findInstalledDeployment(mockDeviceId);
        expect(result).toEqual(null);
      });
    });

    describe('findInFlightDeployment', () => {
      it('should return the most recent in flight deployment', async () => {
        mockDeploymentRepository.findOne.mockResolvedValue(mockDeployments[1]);
        const result = await service.findInFlightDeployment(mockDeviceId);
        expect(result).toEqual(mockDeployments[1]);
      });

      it('should return null when no in flight deployment', async () => {
        mockDeploymentRepository.findOne.mockResolvedValue(null);
        const result = await service.findInFlightDeployment(mockDeviceId);
        expect(result).toEqual(null);
      });
    });
  });

  describe('link building', () => {
    describe('buildConfigLink', () => {
      it('should build correct config link', () => {
        const link = service.buildConfigLink(mockDeviceId);
        expect(link).toBe(`${mockOrigin}/ddi/${mockWorkspaceId}/controller/v1/${mockDeviceId}/configData`);
      });
    });

    describe('buildInstalledBaseLink', () => {
      it('should build correct installed base link', () => {
        const link = service.buildInstalledBaseLink(mockDeviceId, mockDeploymentId);
        expect(link).toBe(`${mockOrigin}/ddi/${mockWorkspaceId}/controller/v1/${mockDeviceId}/installedBase/${mockDeploymentId}`);
      });
    });

    describe('buildDeploymentBaseLink', () => {
      it('should build correct deployment base link', () => {
        const link = service.buildDeploymentBaseLink(mockDeviceId, mockDeploymentId);
        expect(link).toBe(`${mockOrigin}/ddi/${mockWorkspaceId}/controller/v1/${mockDeviceId}/deploymentBase/${mockDeploymentId}`);
      });
    });
  });
}); 