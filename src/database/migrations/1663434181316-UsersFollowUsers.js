const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class UsersFollowUsers1663434181316 {
  name = 'UsersFollowUsers1663434181316';

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "followed_users_follower_users" (
                "users_id_1" uuid NOT NULL,
                "users_id_2" uuid NOT NULL,
                CONSTRAINT "PK_9ae6f4cc7331c7d8e721e41e41c" PRIMARY KEY ("users_id_1", "users_id_2")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ac2b7461e618c41042fa6a3c94" ON "followed_users_follower_users" ("users_id_1")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_1c163f83fea16bc1905cb3d091" ON "followed_users_follower_users" ("users_id_2")
        `);
    await queryRunner.query(`
            ALTER TABLE "followed_users_follower_users"
            ADD CONSTRAINT "FK_ac2b7461e618c41042fa6a3c943" FOREIGN KEY ("users_id_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "followed_users_follower_users"
            ADD CONSTRAINT "FK_1c163f83fea16bc1905cb3d0915" FOREIGN KEY ("users_id_2") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "followed_users_follower_users" DROP CONSTRAINT "FK_1c163f83fea16bc1905cb3d0915"
        `);
    await queryRunner.query(`
            ALTER TABLE "followed_users_follower_users" DROP CONSTRAINT "FK_ac2b7461e618c41042fa6a3c943"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_1c163f83fea16bc1905cb3d091"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ac2b7461e618c41042fa6a3c94"
        `);
    await queryRunner.query(`
            DROP TABLE "followed_users_follower_users"
        `);
  }
};
