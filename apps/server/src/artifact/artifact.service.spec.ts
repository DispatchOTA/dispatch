import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ArtifactService } from './artifact.service'
import { Artifact } from './entities/artifact.entity';

describe('ArtifactService', () => {
  let service: ArtifactService;

  const mockArtifactRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtifactService,
        {
          provide: getRepositoryToken(Artifact),
          useValue: mockArtifactRepository,
        },
      ],
    }).compile();

    service = module.get<ArtifactService>(ArtifactService);
  });

}); 