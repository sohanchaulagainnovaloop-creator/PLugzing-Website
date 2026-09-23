import { Column, Entity } from 'typeorm';

import { BaseEntity } from '../../../database/entities/base.entity';

import { UserRole } from '../../auth/enums/user-role.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'text', nullable: true })
  passwordResetToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date | null;

  // ============================================================
  // EMAIL VERIFICATION
  // ============================================================

  @Column({ type: 'text', nullable: true })
  emailVerificationToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationExpires: Date | null;

  @Column({ default: false })
  isEmailVerified: boolean;

  // ============================================================
  // ROLE
  // ============================================================

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
