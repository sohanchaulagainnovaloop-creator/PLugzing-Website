import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToUsers1788508882240 implements MigrationInterface {
  name = 'AddRefreshTokenToUsers1788508882240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
  }
}
