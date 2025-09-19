import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token when credentials are valid', () => {
      const loginDto: LoginDto = {
        email: 'test@test.com',
        password: 'test123',
      };
      const mockUser = { id: 1, email: 'test@test.com' };
      const mockToken = { access_token: 'mock-jwt-token' };

      mockAuthService.validateUser.mockReturnValue(mockUser);
      mockAuthService.login.mockReturnValue(mockToken);

      const result = controller.login(loginDto);

      expect(result).toEqual(mockToken);
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@test.com',
        'test123',
      );
      expect(authService.login).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException when credentials are invalid', () => {
      const loginDto: LoginDto = {
        email: 'wrong@email.com',
        password: 'wrongpass',
      };

      mockAuthService.validateUser.mockImplementation(() => {
        throw new UnauthorizedException();
      });

      expect(() => {
        controller.login(loginDto);
      }).toThrow(UnauthorizedException);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'wrong@email.com',
        'wrongpass',
      );
    });
  });
});
