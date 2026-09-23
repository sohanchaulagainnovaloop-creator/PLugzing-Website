import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ============================================================
  // CREATE USER
  // ============================================================

  async create(name: string, email: string, password: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  // ============================================================
  // FIND BY EMAIL
  // ============================================================

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // ============================================================
  // FIND BY ID
  // ============================================================

  async findById(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  // ============================================================
  // UPDATE REFRESH TOKEN
  // ============================================================

  async updateRefreshTokenHash(
    userId: number,
    refreshTokenHash: string | null,
  ) {
    await this.userRepository.update(userId, {
      refreshToken: refreshTokenHash,
    });
  }

  // ============================================================
  // CLEAR REFRESH TOKEN - LOGOUT
  // ============================================================

  async clearRefreshToken(userId: number) {
    await this.userRepository.update(userId, {
      refreshToken: null,
    });
  }

  // ============================================================
  // FIND BY PASSWORD RESET TOKEN
  // ============================================================

  async findByResetToken(resetToken: string) {
    return this.userRepository.findOne({
      where: {
        passwordResetToken: resetToken,
      },
    });
  }

  // ============================================================
  // UPDATE PASSWORD
  // ============================================================

  async updatePassword(userId: number, hashedPassword: string) {
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
  }

  // ============================================================
  // UPDATE PASSWORD RESET TOKEN
  // ============================================================

  async updatePasswordResetToken(
    userId: number,
    token: string | null,
    expires: Date | null,
  ) {
    await this.userRepository.update(userId, {
      passwordResetToken: token,
      passwordResetExpires: expires,
    });
  }

  // ============================================================
  // FIND BY EMAIL VERIFICATION TOKEN
  // ============================================================

  async findByEmailVerificationToken(token: string) {
    return this.userRepository.findOne({
      where: {
        emailVerificationToken: token,
      },
    });
  }

  // ============================================================
  // UPDATE EMAIL VERIFICATION TOKEN
  // ============================================================

  async updateEmailVerificationToken(
    userId: number,
    token: string | null,
    expires: Date | null,
  ) {
    await this.userRepository.update(userId, {
      emailVerificationToken: token,
      emailVerificationExpires: expires,
    });
  }

  // ============================================================
  // VERIFY USER EMAIL
  // ============================================================

  async verifyUserEmail(userId: number) {
    await this.userRepository.update(userId, {
      isEmailVerified: true,
    });
  }
}
