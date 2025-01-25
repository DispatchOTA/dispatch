import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProviderInterface, ProviderType } from './providers';
import { FsProvider } from './providers/fs-provider';

@Injectable()
export class ObjectStorageService {
  private readonly logger = new Logger(ObjectStorageService.name);
  private strategy: ProviderInterface;

  constructor(private readonly configService: ConfigService) {
    const objectStorageProvider = this.configService.get<string>('OBJECT_STORAGE_PROVIDER');
    this.logger.verbose(`Object storage provider: ${objectStorageProvider}`);
    switch (objectStorageProvider) {
      case ProviderType.Filesystem:
        this.strategy = new FsProvider();
        break;
      case ProviderType.S3:
        // TODO: Implement S3 provider
        break;
      default:
        this.strategy = new FsProvider();
        break;
    }
  }

  async putObject(
    bucketId: string,
    workspaceId: string,
    objectId: string,
    content: Buffer,
  ): Promise<boolean> {
    this.logger.log(`Writing object to ${bucketId}/${workspaceId}/${objectId}`);
    return this.strategy.putObject(bucketId, workspaceId, objectId, content);
  }

  async getObject(
    bucketId: string,
    workspaceId: string,
    objectId: string,
  ): Promise<Buffer> {
    this.logger.log(`Reading object from ${bucketId}/${workspaceId}/${objectId}`);
    return this.strategy.getObject(bucketId, workspaceId, objectId);
  }

  async deleteObject(
    bucketId: string,
    workspaceId: string,
    objectId: string,
  ): Promise<boolean> {
    this.logger.log(`Deleting object from ${bucketId}/${workspaceId}/${objectId}`);
    return this.strategy.deleteObject(bucketId, workspaceId, objectId);
  }

  async deleteWorkspaceObjects(bucketId: string, workspaceId: string): Promise<boolean> {
    this.logger.log(`Deleting workspace objects from ${bucketId}/${workspaceId}`);
    return this.strategy.deleteWorkspaceObjects(bucketId, workspaceId);
  }
}
