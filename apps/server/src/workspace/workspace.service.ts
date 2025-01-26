import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';

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
}
