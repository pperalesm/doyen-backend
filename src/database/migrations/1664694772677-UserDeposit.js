const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class UserDeposit1664694772677 {
  name = 'UserDeposit1664694772677';

  async up(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "deposit" double precision NOT NULL DEFAULT '0'
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "deposit"
        `);
  }
};
