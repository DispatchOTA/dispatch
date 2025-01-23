import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ObjectStorageService } from './object-storage.service';
import { ProviderType } from './providers';
import { FsProvider } from './providers/fs-provider';

jest.mock('./providers/fs-provider');

describe('ObjectStorageService', () => {
  let service: ObjectStorageService;
  let configService: ConfigService;

  const mockBucketId = 'test-bucket';
  const mockWorkspaceId = 'test-workspace';
  const mockObjectId = 'test-object';
  const mockContent = Buffer.from('test content');

  const mockConfigService = {
    get: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    (FsProvider as jest.Mock).mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObjectStorageService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<ObjectStorageService>(ObjectStorageService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('initialization', () => {
    it('should use FsProvider when OBJECT_STORAGE_PROVIDER is filesystem', () => {
      mockConfigService.get.mockReturnValue(ProviderType.Filesystem);
      service = new ObjectStorageService(configService);
      expect(FsProvider).toHaveBeenCalled();
    });

    it('should use FsProvider as default when OBJECT_STORAGE_PROVIDER is not set', () => {
      mockConfigService.get.mockReturnValue(undefined);
      service = new ObjectStorageService(configService);
      expect(FsProvider).toHaveBeenCalled();
    });
  });

  describe('putObject', () => {
    it('should call strategy.putObject with correct parameters', async () => {
      const mockPutObject = jest.fn().mockResolvedValue(true);
      (FsProvider as jest.Mock).mockImplementation(() => ({
        putObject: mockPutObject,
      }));
      
      mockConfigService.get.mockReturnValue(ProviderType.Filesystem);
      service = new ObjectStorageService(configService);

      const result = await service.putObject(mockBucketId, mockWorkspaceId, mockObjectId, mockContent);
      
      expect(result).toBe(true);
      expect(mockPutObject).toHaveBeenCalledWith(mockBucketId, mockWorkspaceId, mockObjectId, mockContent);
    });
  });

  describe('getObject', () => {
    it('should call strategy.getObject with correct parameters', async () => {
      const mockGetObject = jest.fn().mockResolvedValue(mockContent);
      (FsProvider as jest.Mock).mockImplementation(() => ({
        getObject: mockGetObject,
      }));
      
      mockConfigService.get.mockReturnValue(ProviderType.Filesystem);
      service = new ObjectStorageService(configService);

      const result = await service.getObject(mockBucketId, mockWorkspaceId, mockObjectId);
      
      expect(result).toEqual(mockContent);
      expect(mockGetObject).toHaveBeenCalledWith(mockBucketId, mockWorkspaceId, mockObjectId);
    });
  });

  describe('deleteObject', () => {
    it('should call strategy.deleteObject with correct parameters', async () => {
      const mockDeleteObject = jest.fn().mockResolvedValue(true);
      (FsProvider as jest.Mock).mockImplementation(() => ({
        deleteObject: mockDeleteObject,
      }));
      
      mockConfigService.get.mockReturnValue(ProviderType.Filesystem);
      service = new ObjectStorageService(configService);

      const result = await service.deleteObject(mockBucketId, mockWorkspaceId, mockObjectId);
      
      expect(result).toBe(true);
      expect(mockDeleteObject).toHaveBeenCalledWith(mockBucketId, mockWorkspaceId, mockObjectId);
    });
  });

  describe('deleteWorkspaceObjects', () => {
    it('should call strategy.deleteWorkspaceObjects with correct parameters', async () => {
      const mockDeleteWorkspaceObjects = jest.fn().mockResolvedValue(true);
      (FsProvider as jest.Mock).mockImplementation(() => ({
        deleteWorkspaceObjects: mockDeleteWorkspaceObjects,
      }));
      
      mockConfigService.get.mockReturnValue(ProviderType.Filesystem);
      service = new ObjectStorageService(configService);

      const result = await service.deleteWorkspaceObjects(mockBucketId, mockWorkspaceId);
      
      expect(result).toBe(true);
      expect(mockDeleteWorkspaceObjects).toHaveBeenCalledWith(mockBucketId, mockWorkspaceId);
    });
  });
});
