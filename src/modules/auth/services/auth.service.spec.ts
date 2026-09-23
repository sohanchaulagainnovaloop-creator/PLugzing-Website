
import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const user = {
        id: 1,
        name: 'Sohan',
        email: 'sohan@example.com',
      } as any;

      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue(user);

      const result = await service.register(
        'Sohan',
        'sohan@example.com',
        'password123',
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'sohan@example.com',
      );

      expect(usersService.create).toHaveBeenCalledWith(
        'Sohan',
        'sohan@example.com',
        'password123',
      );

      expect(result).toEqual({
        message: 'User registered successfully',
        user: {
          id: 1,
          name: 'Sohan',
          email: 'sohan@example.com',
        },
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: 1,
        name: 'Sohan',
        email: 'sohan@example.com',
      } as any);

      await expect(
        service.register(
          'Sohan',
          'sohan@example.com',
          'password123',
        ),
      ).rejects.toThrow(ConflictException);

      expect(usersService.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return access token with valid credentials', async () => {
      const user = {
        id: 1,
        name: 'Sohan',
        email: 'sohan@example.com',
        password: 'hashed-password',
      } as any;

      usersService.findByEmail.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtService.signAsync.mockResolvedValue('test-jwt-token');

      const result = await service.login(
        'sohan@example.com',
        'password123',
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith(
        'sohan@example.com',
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password123',
        'hashed-password',
      );

      expect(jwtService.signAsync).toHaveBeenCalled();

      expect(result).toEqual({
        accessToken: 'test-jwt-token',
      });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login(
          'unknown@example.com',
          'password123',
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const user = {
        id: 1,
        name: 'Sohan',
        email: 'sohan@example.com',
        password: 'hashed-password',
      } as any;

      usersService.findByEmail.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login(
          'sohan@example.com',
          'wrong-password',
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('generateToken', () => {
    it('should generate an access token', async () => {
      jwtService.signAsync.mockResolvedValue('test-jwt-token');

      const result = await service.generateToken(
        1,
        'sohan@example.com',
      );

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        email: 'sohan@example.com',
      });

      expect(result).toEqual({
        accessToken: 'test-jwt-token',
      });
    });
  });
});

