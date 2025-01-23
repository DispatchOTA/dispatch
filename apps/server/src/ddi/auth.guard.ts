import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from '../common/crypto';
import { Device } from '../device/entities/device.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  private AUTHORISATION_HEADER = 'authorization';
  private TARGET_TOKEN_TYPE = 'TargetToken';
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return await this.validateRequest(request);
  }

  private async validateRequest(request: Request) {
    const token = this.extractToken(request);
    if(!token) {
      this.logger.warn('Cannot find access token');
      return false;
    }
    const hashedToken = createHash('sha256', token);
    const device = await this.findDeviceByToken(hashedToken);
    if(!device) {
      this.logger.warn('Cannot find device for access token');
      return false;
    }
    return true;
  }

  private async findDeviceByToken(token: string): Promise<Device | null> {
    return await this.deviceRepository.findOne({ where: { accessToken: token } });
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers[this.AUTHORISATION_HEADER];
    if (!authHeader) {
      this.logger.warn('Cannot find authorization header');
      return null;
    }
    const [type, token] = authHeader.split(' ') ?? [];
    if (type === this.TARGET_TOKEN_TYPE) {
      this.logger.verbose('Found a target token');
      return token;
    }
    this.logger.warn('Invalid token type');
    return null;
  }
}
