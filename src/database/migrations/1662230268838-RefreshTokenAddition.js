const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class RefreshTokenAddition1662230268838 {
  name = 'RefreshTokenAddition1662230268838';

  async up(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "refresh_token" character varying
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "refresh_token"
        `);
  }
};
