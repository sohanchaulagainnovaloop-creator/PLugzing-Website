import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { createHash, randomBytes, randomUUID } from 'crypto';

import { UsersService } from '../../users/services/users.service';
import { EmailService } from '../../email/services/email.service';

import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  // ============================================================
  // REGISTER
  // ============================================================

  async register(name: string, email: string, password: string) {
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.usersService.create(name, email, password);

    return {
      message: 'User registered successfully',

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  // ============================================================
  // LOGIN
  // ============================================================

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // ============================================================
    // EMAIL VERIFICATION CHECK
    // ============================================================

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in',
      );
    }

    // Generate access token + refresh token
    const tokens = await this.generateToken(user.id, user.email, user.role);

    // Hash refresh token
    const refreshTokenHash = this.hashRefreshToken(tokens.refreshToken);

    // Save refresh token hash
    await this.usersService.updateRefreshTokenHash(user.id, refreshTokenHash);

    return tokens;
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);

    return {
      message: 'Logout successful',
    };
  }

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    // Do not reveal whether email exists
    if (!user) {
      return {
        message:
          'If an account with that email exists, a password reset link has been generated.',
      };
    }

    // Generate secure random reset token
    const resetToken = randomBytes(32).toString('hex');

    // Token expires after 15 minutes
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Save reset token and expiration
    await this.usersService.updatePasswordResetToken(
      user.id,
      resetToken,
      resetTokenExpires,
    );

    return {
      message:
        'If an account with that email exists, a password reset link has been generated.',

      // Temporary token for Postman testing
      resetToken,

      expiresAt: resetTokenExpires,
    };
  }

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  async resetPassword(resetToken: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(resetToken);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Check token expiration
    if (
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save new password
    await this.usersService.updatePassword(user.id, hashedPassword);

    // Clear reset token so it cannot be reused
    await this.usersService.updatePasswordResetToken(user.id, null, null);

    return {
      message: 'Password reset successfully',
    };
  }

  // ============================================================
  // SEND VERIFICATION EMAIL
  // ============================================================

  async sendVerificationEmail(userId: number) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return {
        message: 'Email is already verified',
      };
    }

    // Generate secure verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Token expires after 15 minutes
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Save verification token
    await this.usersService.updateEmailVerificationToken(
      user.id,
      verificationToken,
      verificationTokenExpires,
    );

    // ============================================================
    // SEND VERIFICATION EMAIL
    // ============================================================

    const verificationUrl = `http://localhost:3000/auth/verify-email?token=${verificationToken}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Verify Your Email</title>
        </head>

        <body>
          <h2>Welcome ${user.name}!</h2>

          <p>
            Thank you for registering.
            Please verify your email address to activate your account.
          </p>

          <p>
            Your verification token is:
          </p>

          <p>
            <strong>${verificationToken}</strong>
          </p>

          <p>
            Your verification token expires in 15 minutes.
          </p>

          <p>
            You can verify your email using the following link:
          </p>

          <p>
            <a href="${verificationUrl}">
              Verify Email
            </a>
          </p>

          <p>
            If you did not create this account, you can safely ignore this email.
          </p>
        </body>
      </html>
    `;

    await this.emailService.sendEmail(
      user.email,
      'Verify your email address',
      emailHtml,
    );

    return {
      message: 'Verification email sent successfully',

      // Temporary token for Postman testing
      verificationToken,

      expiresAt: verificationTokenExpires,
    };
  }

  // ============================================================
  // VERIFY EMAIL
  // ============================================================

  async verifyEmail(verificationToken: string) {
    const user =
      await this.usersService.findByEmailVerificationToken(verificationToken);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    // Check token expiration
    if (
      !user.emailVerificationExpires ||
      user.emailVerificationExpires.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    // Mark email as verified
    await this.usersService.verifyUserEmail(user.id);

    // Clear verification token
    await this.usersService.updateEmailVerificationToken(user.id, null, null);

    return {
      message: 'Email verified successfully',
    };
  }

  // ============================================================
  // REFRESH TOKEN
  // ============================================================

  async refresh(refreshToken: string) {
    try {
      // Verify refresh token JWT
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Find user
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check stored refresh token
      if (!user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Hash incoming refresh token
      const incomingRefreshTokenHash = this.hashRefreshToken(refreshToken);

      // Compare with database
      const tokenMatches = incomingRefreshTokenHash === user.refreshToken;

      if (!tokenMatches) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate NEW tokens
      const tokens = await this.generateToken(user.id, user.email, user.role);

      // Hash NEW refresh token
      const newRefreshTokenHash = this.hashRefreshToken(tokens.refreshToken);

      // Replace old refresh token hash
      await this.usersService.updateRefreshTokenHash(
        user.id,
        newRefreshTokenHash,
      );

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  // ============================================================
  // HASH REFRESH TOKEN
  // ============================================================

  private hashRefreshToken(refreshToken: string): string {
    return createHash('sha256').update(refreshToken).digest('hex');
  }

  // ============================================================
  // GENERATE TOKENS
  // ============================================================

  async generateToken(userId: number, email: string, role: UserRole) {
    // ============================================================
    // ACCESS TOKEN
    // ============================================================

    const accessPayload = {
      sub: userId,
      email,
      role,

      // Unique ID for every access JWT
      jti: randomUUID(),
    };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    // ============================================================
    // REFRESH TOKEN
    // ============================================================

    const refreshPayload = {
      sub: userId,
      email,
      role,

      // Unique ID for every refresh JWT
      jti: randomUUID(),
    };

    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
