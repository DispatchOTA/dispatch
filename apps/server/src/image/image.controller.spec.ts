import { Test, TestingModule } from '@nestjs/testing';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { CreateImageDto } from './dtos/create-image.dto';
import { UpdateImageDto } from './dtos/update-image.dto';
import { NotFoundException } from '@nestjs/common';
import { createMockImage } from '../../test/factories';

describe('ImageController', () => {
  let controller: ImageController;
  let service: ImageService;

  const mockImage = createMockImage();
  
  const mockImageService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageController],
      providers: [
        {
          provide: ImageService,
          useValue: mockImageService,
        },
      ],
    }).compile();

    controller = module.get<ImageController>(ImageController);
    service = module.get<ImageService>(ImageService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /images', () => {
    it('should create a new image', async () => {
      const createImageDto: CreateImageDto = {
        id: 'Test Image',
        description: 'A test image',
      };

      mockImageService.create.mockResolvedValue(mockImage);

      const result = await controller.create(createImageDto);
      expect(result).toEqual(mockImage);
      expect(service.create).toHaveBeenCalledWith(createImageDto);
    });
  });

  describe('GET /images', () => {
    it('should return an array of images', async () => {
      const images = [mockImage];
      mockImageService.findAll.mockResolvedValue(images);

      const result = await controller.findAll();
      expect(result).toEqual(images);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array if no images are found', async () => {
      mockImageService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /images/:uuid', () => {
    it('should return a single image', async () => {
      mockImageService.findOne.mockResolvedValue(mockImage);

      const result = await controller.findOne({ uuid: 'uuid' });
      expect(result).toEqual(mockImage);
      expect(service.findOne).toHaveBeenCalledWith('uuid');
    });

    it('should return a 404 error if the image is not found', async () => {
      mockImageService.findOne.mockRejectedValue(
        new NotFoundException('Image not found'),
      );

      await expect(controller.findOne({ uuid: 'uuid' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('PUT /images/:uuid', () => {
    const updateImageDto: UpdateImageDto = {
      id: 'Updated Image',
      description: 'An updated test image',
    };

    it('should update a image', async () => {
      const updatedImage = { ...mockImage, ...updateImageDto };
      mockImageService.update.mockResolvedValue(updatedImage);

      const result = await controller.update({ uuid: 'uuid' }, updateImageDto);
      expect(result).toEqual(updatedImage);
      expect(service.update).toHaveBeenCalledWith('uuid', updateImageDto);
    });

    it('should return a 404 error if the image is not found', async () => {
      mockImageService.update.mockRejectedValue(
        new NotFoundException('Image not found'),
      );

      await expect(
        controller.update({ uuid: 'uuid' }, updateImageDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});