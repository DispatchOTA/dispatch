import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from './auth.guard';
import { Device } from '../device/entities/device.entity';
import { createHash } from '../common/crypto';
import { createMockDevice } from '../../test/factories';

jest.mock('../common/crypto', () => ({
  createHash: jest.fn()
}));

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let deviceRepository: Repository<Device>;

  const mockDevice = createMockDevice();
  const mockToken = 'valid-token';
  const mockHashedToken = 'hashed-token';

  const mockDeviceRepository = {
    findOne: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: getRepositoryToken(Device),
          useValue: mockDeviceRepository,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    deviceRepository = module.get<Repository<Device>>(getRepositoryToken(Device));
    jest.clearAllMocks();
    (createHash as jest.Mock).mockReturnValue(mockHashedToken);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: `TargetToken ${mockToken}`
          }
        })
      })
    } as ExecutionContext;

    it('should return true for valid token and existing device', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(mockDevice);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(createHash).toHaveBeenCalledWith('sha256', mockToken);
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { accessToken: mockHashedToken }
      });
    });

    it('should return false when authorization header is missing', async () => {
      const contextWithoutAuth = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {}
          })
        })
      } as ExecutionContext;

      const result = await guard.canActivate(contextWithoutAuth);

      expect(result).toBe(false);
      expect(deviceRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return false when token type is invalid', async () => {
      const contextWithInvalidType = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: `Bearer ${mockToken}`
            }
          })
        })
      } as ExecutionContext;

      const result = await guard.canActivate(contextWithInvalidType);

      expect(result).toBe(false);
      expect(deviceRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return false when token format is invalid', async () => {
      const contextWithInvalidFormat = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'TargetToken'  // Missing token part
            }
          })
        })
      } as ExecutionContext;

      const result = await guard.canActivate(contextWithInvalidFormat);

      expect(result).toBe(false);
      expect(deviceRepository.findOne).not.toHaveBeenCalled();
    });

    it('should return false when device is not found', async () => {
      mockDeviceRepository.findOne.mockResolvedValue(null);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
      expect(createHash).toHaveBeenCalledWith('sha256', mockToken);
      expect(deviceRepository.findOne).toHaveBeenCalledWith({
        where: { accessToken: mockHashedToken }
      });
    });

    it('should handle malformed authorization header', async () => {
      const contextWithMalformedHeader = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: 'malformed header'
            }
          })
        })
      } as ExecutionContext;

      const result = await guard.canActivate(contextWithMalformedHeader);

      expect(result).toBe(false);
      expect(deviceRepository.findOne).not.toHaveBeenCalled();
    });
  });
});
