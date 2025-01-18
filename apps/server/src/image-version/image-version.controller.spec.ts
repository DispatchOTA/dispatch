import { Test, TestingModule } from '@nestjs/testing';
import { ImageVersionController } from './image-version.controller';
import { ImageVersionService } from './image-version.service';
import { CreateImageVersionDto } from './dtos/create-image-version.dto';
import { UpdateImageVersionDto } from './dtos/update-image-version.dto';
import { ImageVersion } from './entities/image-version.entity';
import { MessageDto } from '../common/dtos/message.dto';
import { NotFoundException } from '@nestjs/common';

describe('ImageVersionController', () => {
  let controller: ImageVersionController;
  let service: ImageVersionService;

  const mockImageVersion: ImageVersion = {
    uuid: 'uuid',
    id: 'id',
    description: 'A test image version',
    createdAt: new Date(),
    updatedAt: new Date(),
    image: {
      uuid: 'imageUuid',
      id: 'imageId',
      description: 'A test image',
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [],
    },
  };

  const mockImageVersionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageVersionController],
      providers: [
        {
          provide: ImageVersionService,
          useValue: mockImageVersionService,
        },
      ],
    }).compile();

    controller = module.get<ImageVersionController>(ImageVersionController);
    service = module.get<ImageVersionService>(ImageVersionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /images/:uuid/versions', () => {
    const createImageVersionDto: CreateImageVersionDto = {
      id: 'Test Image Version',
      description: 'A test image version',
    };

    it('should create a new image version', async () => {
      mockImageVersionService.create.mockResolvedValue(mockImageVersion);
      
      const result = await controller.create({ uuid: 'imageUuid' }, createImageVersionDto);
      expect(result).toEqual(mockImageVersion);
      expect(service.create).toHaveBeenCalledWith('imageUuid', createImageVersionDto);
    });

    it('should return a 404 error if the image is not found', async () => {
      mockImageVersionService.create.mockRejectedValue(
        new NotFoundException('Image not found'),
      );

      await expect(controller.create({ uuid: 'imageUuid' }, createImageVersionDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /images/:uuid/versions', () => {
    it('should return an array of image versions', async () => {
      const imageVersions = [mockImageVersion];
      mockImageVersionService.findAll.mockResolvedValue(imageVersions);

      const result = await controller.findAll({ uuid: 'imageUuid' });
      expect(result).toEqual(imageVersions);
      expect(service.findAll).toHaveBeenCalledWith('imageUuid');
    });

    it('should return an empty array if no image versions are found', async () => {
      mockImageVersionService.findAll.mockResolvedValue([]);

      const result = await controller.findAll({ uuid: 'imageUuid' });
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledWith('imageUuid');
    });

    it('should return a 404 error if the image is not found', async () => {
      mockImageVersionService.findAll.mockRejectedValue(
        new NotFoundException('Image not found'),
      );

      await expect(controller.findAll({ uuid: 'imageUuid' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('PUT /images/:imageUuid/versions/:versionUuid', () => {
    const updateImageVersionDto: UpdateImageVersionDto = {
      id: 'Updated Image Version',
      description: 'An updated test image version',
    };

    it('should update a image version', async () => {
      const updatedImageVersion = { ...mockImageVersion, ...updateImageVersionDto };
      mockImageVersionService.update.mockResolvedValue(updatedImageVersion);

      const result = await controller.update({ imageUuid: 'imageUuid', versionUuid: 'versionUuid' }, updateImageVersionDto);
      expect(result).toEqual(updatedImageVersion);
      expect(service.update).toHaveBeenCalledWith('imageUuid', 'versionUuid', updateImageVersionDto);
    });

    it('should return a 404 error if the image is not found', async () => {
      mockImageVersionService.update.mockRejectedValue(
        new NotFoundException('Image not found'),
      );

      await expect(
        controller.update({ imageUuid: 'imageUuid', versionUuid: 'versionUuid' }, updateImageVersionDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return a 404 error if the image version is not found', async () => {
      mockImageVersionService.update.mockRejectedValue(
        new NotFoundException('Image version not found'),
      );

      await expect(controller.update({ imageUuid: 'imageUuid', versionUuid: 'versionUuid' }, updateImageVersionDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('DELETE /images/:imageUuid/versions/:versionUuid', () => {
    it('should delete a image version and return success message', async () => {
      mockImageVersionService.delete.mockResolvedValue(undefined);

      const result = await controller.delete({ imageUuid: 'imageUuid', versionUuid: 'versionUuid' });
      expect(result).toEqual(new MessageDto('Image version has been deleted'));
      expect(service.delete).toHaveBeenCalledWith('imageUuid', 'versionUuid');
    });

    it('should return a 404 error if the image is not found', async () => {
      mockImageVersionService.delete.mockRejectedValue(
        new NotFoundException('Image not found'),
      );

      await expect(controller.delete({ imageUuid: 'imageUuid', versionUuid: 'versionUuid' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should return a 404 error if the image version is not found', async () => {
      mockImageVersionService.delete.mockRejectedValue(
        new NotFoundException('Image version not found'),
      );

      await expect(controller.delete({ imageUuid: 'imageUuid', versionUuid: 'versionUuid' })).rejects.toThrow(NotFoundException);
    });
  });
});