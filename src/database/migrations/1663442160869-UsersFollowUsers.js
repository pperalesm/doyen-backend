const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class UsersFollowUsers1663442160869 {
  name = 'UsersFollowUsers1663442160869';

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "users_follow_users" (
                "follower_id" uuid NOT NULL,
                "followed_id" uuid NOT NULL,
                CONSTRAINT "PK_f0a8cbce472a17a9ac7da1481b4" PRIMARY KEY ("follower_id", "followed_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_31c10092c592402115cf01a00a" ON "users_follow_users" ("follower_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_5574ef2ea446cb98c617eb9f8b" ON "users_follow_users" ("followed_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "users_follow_users"
            ADD CONSTRAINT "FK_31c10092c592402115cf01a00a1" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "users_follow_users"
            ADD CONSTRAINT "FK_5574ef2ea446cb98c617eb9f8bb" FOREIGN KEY ("followed_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "users_follow_users" DROP CONSTRAINT "FK_5574ef2ea446cb98c617eb9f8bb"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_follow_users" DROP CONSTRAINT "FK_31c10092c592402115cf01a00a1"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_5574ef2ea446cb98c617eb9f8b"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_31c10092c592402115cf01a00a"
        `);
    await queryRunner.query(`
            DROP TABLE "users_follow_users"
        `);
  }
};
