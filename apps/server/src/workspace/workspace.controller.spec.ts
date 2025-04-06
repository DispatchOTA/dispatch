import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { WorkspaceDetailDto } from './dtos/workspace-detail.dto';
import { NotFoundException } from '@nestjs/common';
import { createMockWorkspace } from '../../test/factories';

describe('WorkspaceController', () => {
  let controller: WorkspaceController;
  let service: WorkspaceService;

  const mockWorkspace = createMockWorkspace();
  const mockWorkspaceDetailDto = new WorkspaceDetailDto(mockWorkspace);

  const mockWorkspaceService = {
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: mockWorkspaceService,
        },
      ],
    }).compile();

    controller = module.get<WorkspaceController>(WorkspaceController);
    service = module.get<WorkspaceService>(WorkspaceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /workspace/:uuid', () => {
    it('should return a workspace detail', async () => {
      mockWorkspaceService.findOne.mockResolvedValue(mockWorkspaceDetailDto);

      const result = await controller.findOne({ uuid: 'test-uuid' });
      expect(result).toEqual(mockWorkspaceDetailDto);
      expect(service.findOne).toHaveBeenCalledWith('test-uuid');
    });

    it('should return 404 if workspace is not found', async () => {
      mockWorkspaceService.findOne.mockRejectedValue(
        new NotFoundException('Workspace not found'),
      );

      await expect(controller.findOne({ uuid: 'test-uuid' })).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith('test-uuid');
    });
  });
}); 