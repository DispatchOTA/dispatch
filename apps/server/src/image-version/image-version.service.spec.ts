import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageVersionService } from './image-version.service';
import { ImageVersion } from './entities/image-version.entity';
import { Image } from '../image/entities/image.entity';
import { CreateImageVersionDto } from './dtos/create-image-version.dto';
import { UpdateImageVersionDto } from './dtos/update-image-version.dto';
import { NotFoundException } from '@nestjs/common';

describe('ImageVersionService', () => {
  let service: ImageVersionService;
  let imageVersionRepository: Repository<ImageVersion>;
  let imageRepository: Repository<Image>;

  const mockImage: Image = {
    uuid: 'imageUuid',
    id: 'imageId',
    description: 'A test image',
    createdAt: new Date(),
    updatedAt: new Date(),
    versions: []
  };

  const mockImageVersion: ImageVersion = {
    uuid: 'versionUuid',
    id: 'versionId',
    description: 'A test image version',
    createdAt: new Date(),
    updatedAt: new Date(),
    image: mockImage,
    deployments: [],
  };

  const mockImageVersionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockImageRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageVersionService,
        {
          provide: getRepositoryToken(ImageVersion),
          useValue: mockImageVersionRepository,
        },
        {
          provide: getRepositoryToken(Image),
          useValue: mockImageRepository,
        },
      ],
    }).compile();

    service = module.get<ImageVersionService>(ImageVersionService);
    imageVersionRepository = module.get<Repository<ImageVersion>>(getRepositoryToken(ImageVersion));
    imageRepository = module.get<Repository<Image>>(getRepositoryToken(Image));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createImageVersionDto: CreateImageVersionDto = {
      id: 'Test Version',
      description: 'A test image version'
    };

    it('should successfully create an image version', async () => {
      mockImageRepository.findOne.mockResolvedValue(mockImage);
      mockImageVersionRepository.save.mockResolvedValue(mockImageVersion);

      const result = await service.create('imageUuid', createImageVersionDto);
      expect(result).toEqual(mockImageVersion);
      expect(mockImageRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'imageUuid' }
      });
      expect(mockImageVersionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createImageVersionDto.id,
          description: createImageVersionDto.description,
          image: mockImage
        })
      );
    });

    it('should throw NotFoundException when image is not found', async () => {
      mockImageRepository.findOne.mockResolvedValue(null);

      await expect(service.create('imageUuid', createImageVersionDto))
        .rejects.toThrow(NotFoundException);
      expect(mockImageRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'imageUuid' }
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of image versions', async () => {
      mockImageRepository.findOne.mockResolvedValue(mockImage);
      mockImageVersionRepository.find.mockResolvedValue([mockImageVersion]);

      const result = await service.findAll('imageUuid');
      expect(result).toEqual([mockImageVersion]);
      expect(mockImageRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'imageUuid' }
      });
      expect(mockImageVersionRepository.find).toHaveBeenCalledWith({
        where: { image: mockImage },
        order: { createdAt: 'DESC' }
      });
    });

    it('should return an empty array when no image versions exist', async () => {
      mockImageRepository.findOne.mockResolvedValue(mockImage);
      mockImageVersionRepository.find.mockResolvedValue([]);

      const result = await service.findAll('imageUuid');
      expect(result).toEqual([]);
    });

    it('should throw NotFoundException when image is not found', async () => {
      mockImageRepository.findOne.mockResolvedValue(null);

      await expect(service.findAll('imageUuid'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateImageVersionDto: UpdateImageVersionDto = {
      id: 'Updated Version',
      description: 'An updated test version'
    };

    it('should update an image version', async () => {
      mockImageRepository.findOne.mockResolvedValue(mockImage);
      mockImageVersionRepository.findOne.mockResolvedValue(mockImageVersion);
      const updatedVersion = { ...mockImageVersion, ...updateImageVersionDto };
      mockImageVersionRepository.save.mockResolvedValue(updatedVersion);

      const result = await service.update('imageUuid', 'versionUuid', updateImageVersionDto);
      expect(result).toEqual(updatedVersion);
      expect(mockImageRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'imageUuid' }
      });
      expect(mockImageVersionRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'versionUuid', image: mockImage }
      });
      expect(mockImageVersionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          ...mockImageVersion,
          ...updateImageVersionDto
        })
      );
    });

    it('should throw NotFoundException when image is not found', async () => {
      mockImageRepository.findOne.mockResolvedValue(null);

      await expect(service.update('imageUuid', 'versionUuid', updateImageVersionDto))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when image version is not found', async () => {
      mockImageRepository.findOne.mockResolvedValue(mockImage);
      mockImageVersionRepository.findOne.mockResolvedValue(null);

      await expect(service.update('imageUuid', 'versionUuid', updateImageVersionDto))
        .rejects.toThrow(NotFoundException);
    });
  });
}); 