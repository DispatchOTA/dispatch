import * as fs from 'fs';
import * as path from 'path';
import { ProviderInterface } from './index';

export class FsProvider implements ProviderInterface {
  private readonly LOCAL_OBJECT_STORAGE_DIR = './.objects';

  putObject(bucketId: string, workspaceId: string, objectId: string, content: Buffer): Promise<boolean> {
    const filePath = path.resolve(
      path.join(this.LOCAL_OBJECT_STORAGE_DIR, bucketId, workspaceId, objectId),
    );
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
    return Promise.resolve(true);
  }
  
  getObject(bucketId: string, workspaceId: string, objectId: string): Promise<Buffer> {
    const filePath = path.resolve(
      path.join(this.LOCAL_OBJECT_STORAGE_DIR, bucketId, workspaceId, objectId),
    );
    return Promise.resolve(fs.readFileSync(filePath));
  }
  
  deleteObject(bucketId: string, workspaceId: string, objectId: string): Promise<boolean> {
    const filePath = path.resolve(
      path.join(this.LOCAL_OBJECT_STORAGE_DIR, bucketId, workspaceId, objectId),
    );
    fs.unlinkSync(filePath);
    return Promise.resolve(true);
  }
  
  deleteWorkspaceObjects(bucketId: string, workspaceId: string): Promise<boolean> {
    const workspaceDir = path.resolve(
      path.join(this.LOCAL_OBJECT_STORAGE_DIR, bucketId, workspaceId),
    );
    fs.rmdirSync(workspaceDir, { recursive: true });
    return Promise.resolve(true);
  }
}