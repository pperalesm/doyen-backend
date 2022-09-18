const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class IntegerToFloat1663510497474 {
  name = 'IntegerToFloat1663510497474';

  async up(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "meetings" DROP COLUMN "base_price"
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings"
            ADD "base_price" double precision NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "gains"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "gains" double precision NOT NULL DEFAULT '0'
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "gains"
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "gains" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings" DROP COLUMN "base_price"
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings"
            ADD "base_price" integer NOT NULL
        `);
  }
};
