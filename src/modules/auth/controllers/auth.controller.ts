import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';

import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { LogoutDto } from '../dto/logout.dto';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { RateLimit } from '../../../common/rate-limit/rate-limit.decorator';
import { RateLimitGuard } from '../../../common/rate-limit/rate-limit.guard';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(RateLimitGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ============================================================
  // REGISTER
  // ============================================================

  @Post('register')
  @RateLimit(5, 60)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already registered',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.name,
      registerDto.email,
      registerDto.password,
    );
  }

  // ============================================================
  // LOGIN
  // ============================================================

  @Post('login')
  @RateLimit(5, 60)
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticates a user and returns access and refresh tokens.',
  })
  @ApiResponse({
    status: 201,
    description: 'Login successful',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many login attempts',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  // ============================================================
  // REFRESH TOKEN
  // ============================================================

  @Post('refresh')
  @RateLimit(10, 60)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generates a new access token using a valid refresh token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  // ============================================================
  // LOGOUT
  // ============================================================

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Logout user',
    description:
      'Logs out the authenticated user and invalidates the stored refresh token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async logout(@Request() request: any, @Body() logoutDto: LogoutDto) {
    return this.authService.logout(request.user.userId);
  }

  // ============================================================
  // FORGOT PASSWORD
  // ============================================================

  @Post('forgot-password')
  @RateLimit(3, 900)
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Generates a password reset token for the user email.',
  })
  @ApiResponse({
    status: 201,
    description: 'Password reset request processed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  // ============================================================
  // RESET PASSWORD
  // ============================================================

  @Post('reset-password')
  @RateLimit(5, 900)
  @ApiOperation({
    summary: 'Reset password',
    description: 'Resets the user password using a valid reset token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Password reset successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired reset token',
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  // ============================================================
  // SEND VERIFICATION EMAIL
  // ============================================================

  @Post('send-verification-email')
  @RateLimit(3, 900)
  @ApiOperation({
    summary: 'Send email verification',
    description: 'Generates an email verification token for a user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Verification email generated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'User not found',
  })
  async sendVerificationEmail(@Body('userId') userId: number) {
    return this.authService.sendVerificationEmail(Number(userId));
  }

  // ============================================================
  // VERIFY EMAIL
  // ============================================================

  @Post('verify-email')
  @RateLimit(5, 900)
  @ApiOperation({
    summary: 'Verify email',
    description: 'Verifies the user email using a valid verification token.',
  })
  @ApiResponse({
    status: 201,
    description: 'Email verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired verification token',
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }
}
