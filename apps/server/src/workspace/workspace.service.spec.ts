import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './entities/workspace.entity';
import { CreateWorkspaceDto } from './dtos/create-workspace.dto';

describe('WorkspaceService', () => {
  let service: WorkspaceService;
  let repository: Repository<Workspace>;

  const mockWorkspace = {
    uuid: 'mock-uuid',
    id: 'test-workspace',
    defaultPollingTime: '00:10:00',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a workspace', async () => {
      const createWorkspaceDto: CreateWorkspaceDto = {
        id: 'test-workspace',
        defaultPollingTime: '00:10:00'
      };

      mockRepository.create.mockReturnValue(mockWorkspace);
      mockRepository.save.mockResolvedValue(mockWorkspace);

      const result = await service.create(createWorkspaceDto);

      expect(result).toEqual(mockWorkspace);
      expect(mockRepository.create).toHaveBeenCalledWith(createWorkspaceDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockWorkspace);
    });
  });
});
