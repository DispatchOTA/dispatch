import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageService } from './image.service';
import { Image } from './entities/image.entity';
import { CreateImageDto } from './dtos/create-image.dto';
import { UpdateImageDto } from './dtos/update-image.dto';
import { NotFoundException } from '@nestjs/common';
import { ImageVersion } from '../image-version/entities/image-version.entity';
import { createMockDevice, createMockImage, createMockImageVersion } from '../../test/factories';
import { DeploymentState } from '../deployment/entities/deployment.entity';

describe('ImageService', () => {
  let service: ImageService;
  let repository: Repository<Image>;

  const mockImage = createMockImage();

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    manager: {
      transaction: jest.fn()
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: getRepositoryToken(Image),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(ImageVersion),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ImageService>(ImageService);
    repository = module.get<Repository<Image>>(getRepositoryToken(Image));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an image', async () => {
      const createImageDto: CreateImageDto = {
        id: 'Test Image',
        description: 'A test image'
      };

      mockRepository.save.mockResolvedValue(mockImage);

      const result = await service.create(createImageDto);
      expect(result).toEqual(mockImage);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createImageDto.id,
          description: createImageDto.description,
        })
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of images', async () => {
      mockRepository.find.mockResolvedValue([mockImage]);

      const result = await service.findAll();
      expect(result).toEqual([mockImage]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
        relations: { versions: true }
      });
    });

    it('should return an empty array when no images exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single image', async () => {
      mockRepository.findOne.mockResolvedValue(mockImage);

      const result = await service.findOne('uuid');
      expect(result).toEqual(mockImage);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' }
      });
    });

    it('should throw NotFoundException when image is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('uuid')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' }
      });
    });
  });

  describe('update', () => {
    const updateImageDto: UpdateImageDto = {
      id: 'Updated Image',
      description: 'An updated test image'
    };

    it('should update an image', async () => {
      mockRepository.findOne.mockResolvedValue(mockImage);
      const updatedImage = { ...mockImage, ...updateImageDto };
      mockRepository.save.mockResolvedValue(updatedImage);

      const result = await service.update('uuid', updateImageDto);
      expect(result).toEqual(updatedImage);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' }
      });
      expect(mockRepository.save).toHaveBeenCalledWith(updatedImage);
    });

    it('should throw NotFoundException when image to update is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('uuid', updateImageDto)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' }
      });
    });
  });

  describe('findDeployments', () => {
    it('should return deployments for an image', async () => {
      const mockImageVersion = createMockImageVersion();
      const mockDeployments = [
        {
          uuid: 'deployment-uuid-1',
          state: DeploymentState.SCHEDULED,
          createdAt: new Date(),
          updatedAt: new Date(),
          device: createMockDevice(),
          imageVersion: mockImageVersion
        }
      ];

      const imageWithVersions = {
        ...mockImage,
        versions: [{
          ...mockImageVersion,
          deployments: mockDeployments
        }]
      };

      mockRepository.findOne.mockResolvedValue(imageWithVersions);

      const result = await service.findDeployments('uuid');
      expect(result).toEqual(mockDeployments);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' },
        relations: ['versions', 'versions.deployments', 'versions.deployments.device', 'versions.deployments.imageVersion'],
        relationLoadStrategy: 'query'
      });
    });

    it('should return empty array if image has no versions', async () => {
      const imageWithNoVersions = {
        ...mockImage,
        versions: []
      };

      mockRepository.findOne.mockResolvedValue(imageWithNoVersions);

      const result = await service.findDeployments('uuid');
      expect(result).toEqual([]);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' },
        relations: ['versions', 'versions.deployments', 'versions.deployments.device', 'versions.deployments.imageVersion'],
        relationLoadStrategy: 'query'
      });
    });

    it('should return empty array if image versions has no deployments', async () => {
      const mockImageVersion = createMockImageVersion();
      const imageWithVersionsNoDeployments = {
        ...mockImage,
        versions: [{
          ...mockImageVersion,
          deployments: []
        }]
      };

      mockRepository.findOne.mockResolvedValue(imageWithVersionsNoDeployments);

      const result = await service.findDeployments('uuid');
      expect(result).toEqual([]);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' },
        relations: ['versions', 'versions.deployments', 'versions.deployments.device', 'versions.deployments.imageVersion'],
        relationLoadStrategy: 'query'
      });
    });

    it('should throw NotFoundException when image is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findDeployments('uuid')).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { uuid: 'uuid' },
        relations: ['versions', 'versions.deployments', 'versions.deployments.device', 'versions.deployments.imageVersion'],
        relationLoadStrategy: 'query'
      });
    });
  });
}); 