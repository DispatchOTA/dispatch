import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './entities/workspace.entity';
import { WorkspaceDetailDto } from './dtos/workspace-detail.dto';
import { NotFoundException } from '@nestjs/common';
import { DEV_WORKSPACE_ID } from '../common';
import { createMockWorkspace } from '../../test/factories';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let repository: Repository<Workspace>;

  const mockWorkspace = createMockWorkspace();
  const mockRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: getRepositoryToken(Workspace),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
    repository = module.get<Repository<Workspace>>(getRepositoryToken(Workspace));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a workspace detail dto', async () => {
      mockRepository.findOne.mockResolvedValue(mockWorkspace);

      const result = await service.findOne('test-uuid');
      expect(result).toBeInstanceOf(WorkspaceDetailDto);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { uuid: DEV_WORKSPACE_ID },
      });
    });

    it('should throw NotFoundException when workspace is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('test-uuid')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { uuid: DEV_WORKSPACE_ID },
      });
    });
  });
});
