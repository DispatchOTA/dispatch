import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { Device } from './entities/device.entity';
import { MessageDto } from '../common/dtos/message.dto';
import { NotFoundException } from '@nestjs/common';

describe('DeviceController', () => {
  let controller: DeviceController;
  let service: DeviceService;

  const mockDevice: Device = {
    id: 'id',
    name: 'Test Device',
    description: 'A test device',
    state: 'active',
    pollingTime: '30',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockDeviceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
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
        name: 'Test Device',
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

  describe('GET /devices/:id', () => {
    it('should return a single device', async () => {
      mockDeviceService.findOne.mockResolvedValue(mockDevice);

      const result = await controller.findOne({ id: 'id' });
      expect(result).toEqual(mockDevice);
      expect(service.findOne).toHaveBeenCalledWith('id');
    });

    it('should return a 404 error if the device is not found', async () => {
      mockDeviceService.findOne.mockRejectedValue(
        new NotFoundException('Device not found'),
      );

      await expect(controller.findOne({ id: 'id' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('PUT /devices/:id', () => {
    const updateDeviceDto: UpdateDeviceDto = {
      name: 'Updated Device',
      description: 'An updated test device',
    };

    it('should update a device', async () => {
      const updatedDevice = { ...mockDevice, ...updateDeviceDto };
      mockDeviceService.update.mockResolvedValue(updatedDevice);

      const result = await controller.update({ id: 'id' }, updateDeviceDto);
      expect(result).toEqual(updatedDevice);
      expect(service.update).toHaveBeenCalledWith('id', updateDeviceDto);
    });

    it('should return a 404 error if the device is not found', async () => {
      mockDeviceService.update.mockRejectedValue(
        new NotFoundException('Device not found'),
      );

      await expect(
        controller.update({ id: 'id' }, updateDeviceDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /devices/:id', () => {
    it('should delete a device and return success message', async () => {
      mockDeviceService.delete.mockResolvedValue(undefined);

      const result = await controller.delete({ id: 'id' });
      expect(result).toEqual(new MessageDto('Device has been deleted'));
      expect(service.delete).toHaveBeenCalledWith('id');
    });

    it('should return a 404 error if the device is not found', async () => {
      mockDeviceService.delete.mockRejectedValue(
        new NotFoundException('Device not found'),
      );

      await expect(controller.delete({ id: 'id' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});