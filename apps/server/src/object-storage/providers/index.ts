export interface ProviderInterface {
  putObject(
    bucketId: string,
    workspaceId: string,
    objectId: string,
    content: Buffer,
  ): Promise<boolean>;

  getObject(
    bucketId: string,
    workspaceId: string,
    objectId: string,
  ): Promise<Buffer>;

  deleteObject(
    bucketId: string,
    workspaceId: string,
    objectId: string,
  ): Promise<boolean>;

  deleteWorkspaceObjects(
    bucketId: string,
    workspaceId: string,
  ): Promise<boolean>;
}

export const enum ProviderType {
  Filesystem = 'fs',
  S3 = 's3'
} 