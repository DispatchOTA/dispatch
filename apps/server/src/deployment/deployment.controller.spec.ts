import { Test, TestingModule } from '@nestjs/testing';
import { DeploymentController } from './deployment.controller';
import { DeploymentService } from './deployment.service';
import { CreateDeploymentDto } from './dtos/create-deployment.dto';
import { Deployment, DeploymentState } from './entities/deployment.entity';

describe('DeploymentController', () => {
  let controller: DeploymentController;
  let service: DeploymentService;

  const mockDeployment: Deployment = {
    uuid: 'uuid',
    state: DeploymentState.SCHEDULED,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockDeploymentService = {
    create: jest.fn(),
    findAll: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeploymentController],
      providers: [
        {
          provide: DeploymentService,
          useValue: mockDeploymentService,
        },
      ],
    }).compile();

    controller = module.get<DeploymentController>(DeploymentController);
    service = module.get<DeploymentService>(DeploymentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /deployments', () => {
    it('should create a new deployment', async () => {
      const createDeploymentDto: CreateDeploymentDto = {
        // deviceUuid: 'deviceUuid',
        // imageVersionUuid: 'versionUuid'
      };

      mockDeploymentService.create.mockResolvedValue(mockDeployment);

      const result = await controller.create(createDeploymentDto);
      expect(result).toEqual(mockDeployment);
      expect(service.create).toHaveBeenCalledWith(createDeploymentDto);
    });


  });

  describe('GET /deployments', () => {
    it('should return an array of deployments', async () => {
      const deployments = [mockDeployment];
      mockDeploymentService.findAll.mockResolvedValue(deployments);

      const result = await controller.findAll();
      expect(result).toEqual(deployments);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return an empty array if no deployments are found', async () => {
      mockDeploymentService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});