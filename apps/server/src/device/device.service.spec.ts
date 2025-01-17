import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceService } from './device.service';
import { Device } from './entities/device.entity';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';
import { NotFoundException } from '@nestjs/common';

describe('DeviceService', () => {
  let service: DeviceService;
  let repository: Repository<Device>;

  const mockDevice: Device = {
    id: 'id',
    name: 'Test Device',
    description: 'A test device',
    state: 'active',
    pollingTime: '30',
    createdAt: new Date(),
    updatedAt: new Date()
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a device', async () => {
      const createDeviceDto: CreateDeviceDto = {
        name: 'Test Device',
        description: 'A test device'
      };

      mockRepository.save.mockResolvedValue(mockDevice);

      const result = await service.create(createDeviceDto);
      expect(result).toEqual(mockDevice);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createDeviceDto.name,
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
      expect(mockRepository.find).toHaveBeenCalled();
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

      const result = await service.findOne('id');
      expect(result).toEqual(mockDevice);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id' }
      });
    });

    it('should throw NotFoundException when device is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('id')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id' }
      });
    });
  });

  describe('update', () => {
    const updateDeviceDto: UpdateDeviceDto = {
      name: 'Updated Device',
      description: 'An updated test device'
    };

    it('should update a device', async () => {
      mockRepository.findOne.mockResolvedValue(mockDevice);
      const updatedDevice = { ...mockDevice, ...updateDeviceDto };
      mockRepository.save.mockResolvedValue(updatedDevice);

      const result = await service.update('id', updateDeviceDto);
      expect(result).toEqual(updatedDevice);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id' }
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedDevice);
    });

    it('should throw NotFoundException when device to update is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('id', updateDeviceDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id' }
      });
    });
  });

  describe('delete', () => {
    it('should delete a device', async () => {
      mockRepository.findOne.mockResolvedValue(mockDevice);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete('id');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id' }
      });
      expect(mockRepository.delete).toHaveBeenCalledWith('id');
    });

    it('should throw NotFoundException when device to delete is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.delete('id')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'id' }
      });
    });
  });
}); 