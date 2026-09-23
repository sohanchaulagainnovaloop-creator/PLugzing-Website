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
  hash: jest.fn(),
}));

jest.mock('../../email/services/email.service', () => ({
  EmailService: class EmailService {
    sendEmail = jest.fn();
  },
}));

import { AuthService } from './auth.service';
import { UsersService } from '../../users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../email/services/email.service';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/user-role.enum';

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
            findById: jest.fn(),
            updateRefreshTokenHash: jest.fn(),
            clearRefreshToken: jest.fn(),
            updatePasswordResetToken: jest.fn(),
            findByResetToken: jest.fn(),
            updatePassword: jest.fn(),
            updateEmailVerificationToken: jest.fn(),
            findByEmailVerificationToken: jest.fn(),
            verifyUserEmail: jest.fn(),
          },
        },

        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },

        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn(),
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
        role: UserRole.USER,
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
          role: UserRole.USER,
        },
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      usersService.findByEmail.mockResolvedValue({
        id: 1,
        name: 'Sohan',
        email: 'sohan@example.com',
        role: UserRole.USER,
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
    it('should return access and refresh tokens with valid credentials', async () => {
      const user = {
        id: 1,
        name: 'Sohan',
        email: 'sohan@example.com',
        password: 'hashed-password',
        role: UserRole.USER,
        isEmailVerified: true,
      } as any;

      usersService.findByEmail.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      jwtService.signAsync
        .mockResolvedValueOnce('test-access-token')
        .mockResolvedValueOnce('test-refresh-token');

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

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);

      expect(usersService.updateRefreshTokenHash).toHaveBeenCalled();

      expect(result).toEqual({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
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
        role: UserRole.USER,
        isEmailVerified: true,
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

    it('should throw UnauthorizedException when email is not verified', async () => {
      const user = {
        id: 1,
        name: 'Sohan',
        email: 'sohan@example.com',
        password: 'hashed-password',
        role: UserRole.USER,
        isEmailVerified: false,
      } as any;

      usersService.findByEmail.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.login(
          'sohan@example.com',
          'password123',
        ),
      ).rejects.toThrow(UnauthorizedException);

      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('generateToken', () => {
    it('should generate access and refresh tokens', async () => {
      jwtService.signAsync
        .mockResolvedValueOnce('test-access-token')
        .mockResolvedValueOnce('test-refresh-token');

      const result = await service.generateToken(
        1,
        'sohan@example.com',
        UserRole.USER,
      );

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);

      expect(result).toEqual({
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
      });
    });
  });
});
