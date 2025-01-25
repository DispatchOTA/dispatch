import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { ArtifactService } from './artifact.service';
import { Artifact } from './entities/artifact.entity';
import { ObjectStorageService } from '../object-storage/object-storage.service';
import { CreateArtifactDto } from './dtos/create-artifact.dto';
import { createHash } from '../common/crypto';
import { ARTIFACTS_BUCKET } from '../common/consts';

jest.mock('../common/crypto');

describe('ArtifactService', () => {
  let service: ArtifactService;
  let artifactsRepository: Repository<Artifact>;
  let objectStorageService: ObjectStorageService;

  const mockContent = Buffer.from('test content');
  const mockSha256 = 'mock-sha256';
  const mockSha1 = 'mock-sha1';
  const mockMd5 = 'mock-md5';
  const mockSize = mockContent.length;
  const mockUuid = 'mock-uuid';
  const mockFilename = 'test.txt';

  const mockCreateArtifactDto: CreateArtifactDto = {
    filename: mockFilename,
    content: mockContent,
    sha256: mockSha256,
    sha1: mockSha1,
    md5: mockMd5,
    size: mockSize,
  };

  const mockArtifact = {
    uuid: mockUuid,
    filename: mockFilename,
  };

  const mockArtifactsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  const mockObjectStorageService = {
    putObject: jest.fn(),
    getObject: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    (createHash as jest.Mock).mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtifactService,
        {
          provide: getRepositoryToken(Artifact),
          useValue: mockArtifactsRepository,
        },
        {
          provide: ObjectStorageService,
          useValue: mockObjectStorageService,
        },
      ],
    }).compile();

    service = module.get<ArtifactService>(ArtifactService);
    artifactsRepository = module.get<Repository<Artifact>>(getRepositoryToken(Artifact));
    objectStorageService = module.get<ObjectStorageService>(ObjectStorageService);
  });

  describe('createAndUpload', () => {
    beforeEach(() => {
      mockArtifactsRepository.create.mockReturnValue(mockArtifact);
      mockArtifactsRepository.save.mockResolvedValue(mockArtifact);
      mockObjectStorageService.putObject.mockResolvedValue(true);
    });

    it('should create and upload an artifact successfully', async () => {
      (createHash as jest.Mock)
        .mockReturnValueOnce(mockSha256)  // sha256
        .mockReturnValueOnce(mockSha1)    // sha1
        .mockReturnValueOnce(mockMd5);    // md5

      const result = await service.createAndUpload(mockCreateArtifactDto);

      expect(result).toEqual(mockArtifact);
      expect(mockArtifactsRepository.create).toHaveBeenCalledWith(mockCreateArtifactDto);
      expect(mockArtifactsRepository.save).toHaveBeenCalledWith(mockArtifact);
      expect(mockObjectStorageService.putObject).toHaveBeenCalledWith(
        ARTIFACTS_BUCKET,
        'artifact.workspaceId',
        mockArtifact.uuid,
        mockContent,
      );
    });

    it('should throw BadRequestException when SHA256 does not match', async () => {
      (createHash as jest.Mock)
        .mockImplementation((algorithm: string) => {
          switch (algorithm) {
            case 'sha256':
              return 'different-sha256';
            case 'sha1':
              return mockSha1;
            case 'md5':
              return mockMd5;
            default:
              return '';
          }
        });

      await expect(service.createAndUpload(mockCreateArtifactDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.createAndUpload(mockCreateArtifactDto))
        .rejects.toThrow('Artifact SHA256 mismatch');
    });

    it('should throw BadRequestException when SHA1 does not match', async () => {
      (createHash as jest.Mock)
        .mockImplementation((algorithm: string) => {
          switch (algorithm) {
            case 'sha256':
              return mockSha256;
            case 'sha1':
              return 'different-sha1';
            case 'md5':
              return mockMd5;
            default:
              return '';
          }
        });

      await expect(service.createAndUpload(mockCreateArtifactDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.createAndUpload(mockCreateArtifactDto))
        .rejects.toThrow('Artifact SHA1 mismatch');
    });

    it('should throw BadRequestException when MD5 does not match', async () => {
      (createHash as jest.Mock)
        .mockImplementation((algorithm: string) => {
          switch (algorithm) {
            case 'sha256':
              return mockSha256;
            case 'sha1':
              return mockSha1;
            case 'md5':
              return 'different-md5';
            default:
              return '';
          }
        });

      await expect(service.createAndUpload(mockCreateArtifactDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.createAndUpload(mockCreateArtifactDto))
        .rejects.toThrow('Artifact MD5 mismatch');
    });

    it('should throw BadRequestException when size does not match', async () => {
      (createHash as jest.Mock)
        .mockImplementation((algorithm: string) => {
          switch (algorithm) {
            case 'sha256':
              return mockSha256;
            case 'sha1':
              return mockSha1;
            case 'md5':
              return mockMd5;
            default:
              return '';
          }
        });

      const invalidSizeDto = {
        ...mockCreateArtifactDto,
        size: mockSize + 1,
      };

      await expect(service.createAndUpload(invalidSizeDto))
        .rejects.toThrow(BadRequestException);
      await expect(service.createAndUpload(invalidSizeDto))
        .rejects.toThrow('Artifact size mismatch');
    });
  });

  describe('download', () => {
    it('should download an artifact successfully', async () => {
      mockArtifactsRepository.findOne.mockResolvedValue(mockArtifact);
      mockObjectStorageService.getObject.mockResolvedValue(mockContent);

      const result = await service.download(mockUuid);

      expect(result).toEqual(mockContent);
      expect(mockArtifactsRepository.findOne).toHaveBeenCalledWith({ where: { uuid: mockUuid } });
      expect(mockObjectStorageService.getObject).toHaveBeenCalledWith(
        ARTIFACTS_BUCKET,
        'artifact.workspaceId',
        mockUuid,
      );
    });

    it('should throw NotFoundException when artifact is not found in database', async () => {
      mockArtifactsRepository.findOne.mockResolvedValue(null);

      await expect(service.download(mockUuid))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when artifact content is not found in storage', async () => {
      mockArtifactsRepository.findOne.mockResolvedValue(mockArtifact);
      mockObjectStorageService.getObject.mockResolvedValue(null);

      await expect(service.download(mockUuid))
        .rejects.toThrow(NotFoundException);
    });
  });
}); 