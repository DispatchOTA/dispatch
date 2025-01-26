import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { Workspace } from './workspace/entities/workspace.entity';
import { ENV_DEVELOPMENT, DEFAULT_POLLING_TIME } from './common/consts';

describe('AppService', () => {
  let service: AppService;
  let configService: ConfigService;
  let workspaceRepository: Repository<Workspace>;

  const DEV_WORKSPACE_ID = '00000000-0000-0000-0000-000000000000';
  const DEV_WORKSPACE_NAME = 'Development';

  const mockWorkspace = {
    uuid: DEV_WORKSPACE_ID,
    id: DEV_WORKSPACE_NAME,
    defaultPollingTime: DEFAULT_POLLING_TIME,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockWorkspaceRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(Workspace),
          useValue: mockWorkspaceRepository,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    configService = module.get<ConfigService>(ConfigService);
    workspaceRepository = module.get<Repository<Workspace>>(getRepositoryToken(Workspace));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    describe('when in development environment', () => {
      beforeEach(() => {
        mockConfigService.get.mockReturnValue(ENV_DEVELOPMENT);
      });

      it('should create dev workspace if it does not exist', async () => {
        mockWorkspaceRepository.findOne.mockResolvedValue(null);
        mockWorkspaceRepository.create.mockReturnValue(mockWorkspace);
        mockWorkspaceRepository.save.mockResolvedValue(mockWorkspace);

        await service.onApplicationBootstrap();

        expect(mockWorkspaceRepository.findOne).toHaveBeenCalledWith({
          where: { uuid: DEV_WORKSPACE_ID }
        });
        expect(mockWorkspaceRepository.create).toHaveBeenCalledWith({
          uuid: DEV_WORKSPACE_ID,
          id: DEV_WORKSPACE_NAME,
          defaultPollingTime: DEFAULT_POLLING_TIME,
        });
        expect(mockWorkspaceRepository.save).toHaveBeenCalledWith(mockWorkspace);
      });

      it('should not create dev workspace if it already exists', async () => {
        mockWorkspaceRepository.findOne.mockResolvedValue(mockWorkspace);

        await service.onApplicationBootstrap();

        expect(mockWorkspaceRepository.findOne).toHaveBeenCalledWith({
          where: { uuid: DEV_WORKSPACE_ID }
        });
        expect(mockWorkspaceRepository.create).not.toHaveBeenCalled();
        expect(mockWorkspaceRepository.save).not.toHaveBeenCalled();
      });

      it('should handle database errors gracefully', async () => {
        mockWorkspaceRepository.findOne.mockRejectedValue(new Error('Database error'));

        await service.onApplicationBootstrap();

        expect(mockWorkspaceRepository.findOne).toHaveBeenCalledWith({
          where: { uuid: DEV_WORKSPACE_ID }
        });
        expect(mockWorkspaceRepository.create).not.toHaveBeenCalled();
        expect(mockWorkspaceRepository.save).not.toHaveBeenCalled();
      });
    });

    describe('when not in development environment', () => {
      beforeEach(() => {
        mockConfigService.get.mockReturnValue('production');
      });

      it('should not attempt to create dev workspace', async () => {
        await service.onApplicationBootstrap();

        expect(mockWorkspaceRepository.findOne).not.toHaveBeenCalled();
        expect(mockWorkspaceRepository.create).not.toHaveBeenCalled();
        expect(mockWorkspaceRepository.save).not.toHaveBeenCalled();
      });
    });
  });
});
