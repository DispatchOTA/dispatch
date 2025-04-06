import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { NotFoundException } from '@nestjs/common';
import { Deployment } from '../deployment/entities/deployment.entity';
import { createMockDeployment, createMockDevice } from '../../test/factories';

describe('DeviceController', () => {
  let controller: DeviceController;
  let service: DeviceService;

  const mockDevice = createMockDevice();

  const mockDeployments: Deployment[] = [
    createMockDeployment({
      device: mockDevice,
    }),
    createMockDeployment({
      device: mockDevice,
    }),
  ];

  const mockDeviceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findDeployments: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        {
          provide: DeviceService,
          useValue: mockDeviceService,
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
    service = module.get<DeviceService>(DeviceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /devices', () => {
    it('should create a new device', async () => {
      const createDeviceDto: CreateDeviceDto = {
        id: 'Test Device',
        description: 'A test device',
      };

      mockDeviceService.create.mockResolvedValue(mockDevice);

      const result = await controller.create(createDeviceDto);
      expect(result).toEqual(mockDevice);
      expect(service.create).toHaveBeenCalledWith(createDeviceDto);
    });
  });

  describe('GET /devices', () => {
    it('should return an array of devices', async () => {
      const devices = [mockDevice];
      mockDeviceService.findAll.mockResolvedValue(devices);

      const result = await controller.findAll();
      expect(result).toEqual(devices);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array if no devices are found', async () => {
      mockDeviceService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /devices/:uuid', () => {
    it('should return a single device', async () => {
      mockDeviceService.findOne.mockResolvedValue(mockDevice);

      const result = await controller.findOne({ uuid: 'uuid' });
      expect(result).toEqual(mockDevice);
      expect(service.findOne).toHaveBeenCalledWith('uuid');
    });

    it('should return a 404 error if the device is not found', async () => {
      mockDeviceService.findOne.mockRejectedValue(
        new NotFoundException('Device not found'),
      );

      await expect(controller.findOne({ uuid: 'uuid' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('GET /devices/:uuid/deployments', () => {
    it('should return deployments for a device', async () => {
      mockDeviceService.findDeployments.mockResolvedValue(mockDeployments);

      const result = await controller.findDeployments({ uuid: 'uuid' });
      expect(result).toEqual(mockDeployments);
      expect(service.findDeployments).toHaveBeenCalledWith('uuid');
    });

    it('should return an empty array if device has no deployments', async () => {
      mockDeviceService.findDeployments.mockResolvedValue([]);

      const result = await controller.findDeployments({ uuid: 'uuid' });
      expect(result).toEqual([]);
      expect(service.findDeployments).toHaveBeenCalledWith('uuid');
    });

    it('should return a 404 error if the device is not found', async () => {
      mockDeviceService.findDeployments.mockRejectedValue(
        new NotFoundException('Device not found'),
      );

      await expect(controller.findDeployments({ uuid: 'uuid' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('PUT /devices/:uuid', () => {
    const updateDeviceDto: UpdateDeviceDto = {
      id: 'Updated Device',
      description: 'An updated test device',
    };

    it('should update a device', async () => {
      const updatedDevice = { ...mockDevice, ...updateDeviceDto };
      mockDeviceService.update.mockResolvedValue(updatedDevice);

      const result = await controller.update({ uuid: 'uuid' }, updateDeviceDto);
      expect(result).toEqual(updatedDevice);
      expect(service.update).toHaveBeenCalledWith('uuid', updateDeviceDto);
    });

    it('should return a 404 error if the device is not found', async () => {
      mockDeviceService.update.mockRejectedValue(
        new NotFoundException('Device not found'),
      );

      await expect(
        controller.update({ uuid: 'uuid' }, updateDeviceDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});