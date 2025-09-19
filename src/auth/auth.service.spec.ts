import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', () => {
      const result = service.validateUser('test@test.com', 'test123');
      expect(result).toEqual({ id: 1, email: 'test@test.com' });
    });

    it('should throw UnauthorizedException when credentials are invalid', () => {
      expect(() => {
        service.validateUser('wrong@email.com', 'wrongpass');
      }).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when email is invalid', () => {
      expect(() => {
        service.validateUser('wrong@email.com', 'test123');
      }).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is invalid', () => {
      expect(() => {
        service.validateUser('test@test.com', 'wrongpass');
      }).toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token', () => {
      const user = { id: 1, email: 'test@test.com' };
      const result = service.login(user);

      expect(result).toEqual({ access_token: 'mock-jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@test.com',
      });
    });
  });
});
