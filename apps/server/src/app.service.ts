import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DEFAULT_POLLING_TIME, DEV_WORKSPACE_ID, DEV_WORKSPACE_NAME, ENV_DEVELOPMENT } from './common/consts';
import { Workspace } from './workspace/entities/workspace.entity';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async onApplicationBootstrap() {
    await this.maybeSeedDevData();
  }

  private async maybeSeedDevData() {
    if (this.isDev()) {
      try {
        this.logger.log('Seeding dev data');
        const devWorkspace = await this.findOrCreateDevWorkspace();
        this.logger.log(`Dev ${devWorkspace.id}`);
        this.logger.log('Dev data seeded');
      } catch (error) {
        this.logger.error('Error seeding dev data', error);
      }
    }
  }

  private async findOrCreateDevWorkspace() {
    const devWorkspace = await this.workspaceRepository.findOne({
      where: { uuid: DEV_WORKSPACE_ID }
    });
    if (devWorkspace) {
      this.logger.verbose('Dev workspace already exists');
      return devWorkspace;
    }

    this.logger.verbose('Creating dev workspace');
    const workspace = this.workspaceRepository.create({
      uuid: DEV_WORKSPACE_ID,
      id: DEV_WORKSPACE_NAME,
      defaultPollingTime: DEFAULT_POLLING_TIME,
    });
    return this.workspaceRepository.save(workspace);
  }

  private isDev() {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    return nodeEnv === ENV_DEVELOPMENT;
  }
}
