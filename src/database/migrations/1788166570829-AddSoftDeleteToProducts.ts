import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSoftDeleteToProducts1788166570829 implements MigrationInterface {
    name = 'AddSoftDeleteToProducts1788166570829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deletedAt"`);
    }

}
