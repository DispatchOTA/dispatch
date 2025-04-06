import { Controller, Get, Param } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { UUIDParamDto } from '../common/dtos/uuid-param.dto';
import { WorkspaceDetailDto } from './dtos/workspace-detail.dto';

@Controller()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('workspace/:uuid')
  async findOne(@Param() params: UUIDParamDto): Promise<WorkspaceDetailDto> {
    return this.workspaceService.findOne(params.uuid);
  }
}
