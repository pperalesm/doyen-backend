const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class UsersHaveCategories1663441894002 {
  name = 'UsersHaveCategories1663441894002';

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "users_have_categories" (
                "user_id" uuid NOT NULL,
                "category_id" uuid NOT NULL,
                CONSTRAINT "PK_1d6366b1c9cc2b38e37a6c91dd9" PRIMARY KEY ("user_id", "category_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_f795a6068722070078fea35cab" ON "users_have_categories" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_536908eae11e7b1f3aeea71745" ON "users_have_categories" ("category_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "users_have_categories"
            ADD CONSTRAINT "FK_f795a6068722070078fea35cabe" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "users_have_categories"
            ADD CONSTRAINT "FK_536908eae11e7b1f3aeea71745e" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "users_have_categories" DROP CONSTRAINT "FK_536908eae11e7b1f3aeea71745e"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_have_categories" DROP CONSTRAINT "FK_f795a6068722070078fea35cabe"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_536908eae11e7b1f3aeea71745"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_f795a6068722070078fea35cab"
        `);
    await queryRunner.query(`
            DROP TABLE "users_have_categories"
        `);
  }
};
