import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';
import { DEV_WORKSPACE_ID } from '../common';
import { WorkspaceDetailDto } from './dtos/workspace-detail.dto';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);

  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  create(createWorkspaceDto: CreateWorkspaceDto) {
    const workspace = this.workspaceRepository.create(createWorkspaceDto);
    this.logger.log(`Created workspace ${workspace.id}`);
    return this.workspaceRepository.save(workspace);
  }

  async findOne(uuid: string): Promise<WorkspaceDetailDto> {
    // TODO: replace ID with one from auth
    const workspace = await this.workspaceRepository.findOne({
      where: { uuid: DEV_WORKSPACE_ID },
      // relations: ['devices', 'images']
    });
    if (!workspace) {
      this.logger.error(`Workspace not found: ${uuid}`);
      throw new NotFoundException('Workspace not found');
    }
    return new WorkspaceDetailDto(workspace);
  }
}
