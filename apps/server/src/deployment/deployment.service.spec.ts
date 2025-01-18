import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeploymentService } from './deployment.service';
import { Deployment, DeploymentState } from './entities/deployment.entity';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';

describe('DeploymentService', () => {
  let service: DeploymentService;
  let repository: Repository<Deployment>;

  const mockDeployment: Deployment = {
    uuid: 'uuid',
    state: DeploymentState.SCHEDULED,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeploymentService,
        {
          provide: getRepositoryToken(Deployment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DeploymentService>(DeploymentService);
    repository = module.get<Repository<Deployment>>(getRepositoryToken(Deployment));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a deployment', async () => {
      const createDeploymentDto: CreateDeploymentDto = {
        // deviceUuid: 'deviceUuid',
        // imageVersionUuid: 'versionUuid'
      };

      const expectedDeployment = {
        ...mockDeployment,
        state: DeploymentState.SCHEDULED
      };

      mockRepository.save.mockResolvedValue(expectedDeployment);

      const result = await service.create(createDeploymentDto);
      expect(result).toEqual(expectedDeployment);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          state: DeploymentState.SCHEDULED
        })
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of deployments', async () => {
      mockRepository.find.mockResolvedValue([mockDeployment]);

      const result = await service.findAll();
      expect(result).toEqual([mockDeployment]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' }
      });
    });

    it('should return an empty array when no deployments exist', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' }
      });
    });
  });
}); 