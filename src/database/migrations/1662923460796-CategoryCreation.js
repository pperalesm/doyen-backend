const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class CategoryCreation1662923460796 {
  name = 'CategoryCreation1662923460796';

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"),
                CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "categories_users" (
                "users_id" uuid NOT NULL,
                "categories_id" uuid NOT NULL,
                CONSTRAINT "PK_f946e8227050c4c0d2c2a5de242" PRIMARY KEY ("users_id", "categories_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_09f8515e918409740bf676eccd" ON "categories_users" ("users_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_738859a53e45b1c843af46e739" ON "categories_users" ("categories_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "categories_users"
            ADD CONSTRAINT "FK_09f8515e918409740bf676eccd3" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "categories_users"
            ADD CONSTRAINT "FK_738859a53e45b1c843af46e739a" FOREIGN KEY ("categories_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "categories_users" DROP CONSTRAINT "FK_738859a53e45b1c843af46e739a"
        `);
    await queryRunner.query(`
            ALTER TABLE "categories_users" DROP CONSTRAINT "FK_09f8515e918409740bf676eccd3"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_738859a53e45b1c843af46e739"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_09f8515e918409740bf676eccd"
        `);
    await queryRunner.query(`
            DROP TABLE "categories_users"
        `);
    await queryRunner.query(`
            DROP TABLE "categories"
        `);
  }
};
