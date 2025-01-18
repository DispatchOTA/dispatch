import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { NotFoundException } from '@nestjs/common';
import { DeploymentState } from '../deployment/entities/deployment.entity';

describe('DeviceService', () => {
  let service: DeviceService;
  let repository: Repository<Device>;

  const mockDevice: Device = {
    uuid: 'uuid',
    id: 'id',
    description: 'A test device',
    state: 'active',
    pollingTime: '30',
    createdAt: new Date(),
    updatedAt: new Date(),
    deployments: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: getRepositoryToken(Device),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
    repository = module.get<Repository<Device>>(getRepositoryToken(Device));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a device', async () => {
      const createDeviceDto: CreateDeviceDto = {
        id: 'Test Device',
        description: 'A test device'
      };

      mockRepository.save.mockResolvedValue(mockDevice);

      const result = await service.create(createDeviceDto);
      expect(result).toEqual(mockDevice);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createDeviceDto.id,
          description: createDeviceDto.description,
        })
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of devices', async () => {
      mockRepository.find.mockResolvedValue([mockDevice]);

      const result = await service.findAll();
      expect(result).toEqual([mockDevice]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' }
      });
    });

    it('should return an empty array when no devices exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single device', async () => {
      mockRepository.findOne.mockResolvedValue(mockDevice);

      const result = await service.findOne('uuid');
      expect(result).toEqual(mockDevice);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' }
      });
    });

    it('should throw NotFoundException when device is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' }
      });
    });
  });

  describe('update', () => {
    const updateDeviceDto: UpdateDeviceDto = {
      id: 'Updated Device',
      description: 'An updated test device'
    };

    it('should update a device', async () => {
      mockRepository.findOne.mockResolvedValue(mockDevice);
      const updatedDevice = { ...mockDevice, ...updateDeviceDto };
      mockRepository.save.mockResolvedValue(updatedDevice);

      const result = await service.update('uuid', updateDeviceDto);
      expect(result).toEqual(updatedDevice);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' }
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedDevice);
    });

    it('should throw NotFoundException when device to update is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('uuid', updateDeviceDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' }
      });
    });
  });

  describe('findDeployments', () => {
    it('should return deployments for a device', async () => {
      const mockDeployments = [
        {
          uuid: 'deployment-uuid-1',
          state: DeploymentState.SCHEDULED,
          createdAt: new Date(),
          updatedAt: new Date(),
          device: mockDevice,
          imageVersion: {
            uuid: 'version-uuid',
            id: 'version-id',
            description: 'test version',
            createdAt: new Date(),
            updatedAt: new Date(),
            image: {
              uuid: 'image-uuid',
              id: 'image-id',
              description: 'test image',
              createdAt: new Date(),
              updatedAt: new Date(),
              versions: []
            },
            deployments: []
          }
        }
      ];

      const deviceWithDeployments = {
        ...mockDevice,
        deployments: mockDeployments
      };

      mockRepository.findOne.mockResolvedValueOnce(deviceWithDeployments);

      const result = await service.findDeployments('uuid');
      expect(result).toEqual(mockDeployments);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenLastCalledWith({
        where: { uuid: 'uuid' },
        relations: ['deployments'],
        relationLoadStrategy: 'query',
        order: {
          deployments: {
            createdAt: 'DESC'
          }
        }
      });
    });

    it('should return empty array if device has no deployments', async () => {
      const deviceWithNoDeployments = {
        ...mockDevice,
        deployments: []
      };

      mockRepository.findOne.mockResolvedValueOnce(deviceWithNoDeployments);

      const result = await service.findDeployments('uuid');
      expect(result).toEqual([]);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenLastCalledWith({
        where: { uuid: 'uuid' },
        relations: ['deployments'],
        relationLoadStrategy: 'query',
        order: {
          deployments: {
            createdAt: 'DESC'
          }
        }
      });
    });

    it('should throw NotFoundException when device is not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.findDeployments('uuid')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.findOne).toHaveBeenLastCalledWith({
        where: { uuid: 'uuid' },
        relations: ['deployments'],
        relationLoadStrategy: 'query',
        order: {
          deployments: {
            createdAt: 'DESC'
          }
        }
      });
    });
  });
}); 