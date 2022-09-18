const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class MeetingCreation1663509535529 {
  name = 'MeetingCreation1663509535529';

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "meetings" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "is_auction" boolean NOT NULL,
                "base_price" integer NOT NULL,
                "max_participants" integer NOT NULL,
                "duration" integer NOT NULL,
                "next_in" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "published_at" TIMESTAMP NOT NULL,
                "opened_at" TIMESTAMP NOT NULL,
                "phase_at" TIMESTAMP NOT NULL,
                "closed_at" TIMESTAMP NOT NULL,
                "scheduled_at" TIMESTAMP NOT NULL,
                "cancelled_at" TIMESTAMP,
                "creator_user_id" uuid NOT NULL,
                CONSTRAINT "PK_aa73be861afa77eb4ed31f3ed57" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "meetings_have_categories" (
                "meeting_id" uuid NOT NULL,
                "category_id" uuid NOT NULL,
                CONSTRAINT "PK_0e801994545189d120f9301093f" PRIMARY KEY ("meeting_id", "category_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_34ed30f944608d765775fa6a4e" ON "meetings_have_categories" ("meeting_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_7f5c67df5d873203569cdb6da9" ON "meetings_have_categories" ("category_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "users_follow_meetings" (
                "user_id" uuid NOT NULL,
                "meeting_id" uuid NOT NULL,
                CONSTRAINT "PK_794313c8ca427a3a77ab580b10c" PRIMARY KEY ("user_id", "meeting_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_8984161612ae7c05f68647cd55" ON "users_follow_meetings" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_635553bc2640cf886792287701" ON "users_follow_meetings" ("meeting_id")
        `);
    await queryRunner.query(`
            CREATE TABLE "users_attend_meetings" (
                "user_id" uuid NOT NULL,
                "meeting_id" uuid NOT NULL,
                CONSTRAINT "PK_73fd78fc447697a29d2657ca034" PRIMARY KEY ("user_id", "meeting_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_ea43c84a3e9f9e24226970b6cb" ON "users_attend_meetings" ("user_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_5ad9e7e248c8ed85c957f30c9e" ON "users_attend_meetings" ("meeting_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"
        `);
    await queryRunner.query(`
            ALTER TABLE "notifications"
            ALTER COLUMN "user_id"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings"
            ADD CONSTRAINT "FK_1c8452c884a28ab3903e523a8de" FOREIGN KEY ("creator_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings_have_categories"
            ADD CONSTRAINT "FK_34ed30f944608d765775fa6a4e3" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings_have_categories"
            ADD CONSTRAINT "FK_7f5c67df5d873203569cdb6da9a" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users_follow_meetings"
            ADD CONSTRAINT "FK_8984161612ae7c05f68647cd55d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "users_follow_meetings"
            ADD CONSTRAINT "FK_635553bc2640cf8867922877012" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "users_attend_meetings"
            ADD CONSTRAINT "FK_ea43c84a3e9f9e24226970b6cb3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "users_attend_meetings"
            ADD CONSTRAINT "FK_5ad9e7e248c8ed85c957f30c9e8" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "users_attend_meetings" DROP CONSTRAINT "FK_5ad9e7e248c8ed85c957f30c9e8"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_attend_meetings" DROP CONSTRAINT "FK_ea43c84a3e9f9e24226970b6cb3"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_follow_meetings" DROP CONSTRAINT "FK_635553bc2640cf8867922877012"
        `);
    await queryRunner.query(`
            ALTER TABLE "users_follow_meetings" DROP CONSTRAINT "FK_8984161612ae7c05f68647cd55d"
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings_have_categories" DROP CONSTRAINT "FK_7f5c67df5d873203569cdb6da9a"
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings_have_categories" DROP CONSTRAINT "FK_34ed30f944608d765775fa6a4e3"
        `);
    await queryRunner.query(`
            ALTER TABLE "notifications" DROP CONSTRAINT "FK_9a8a82462cab47c73d25f49261f"
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings" DROP CONSTRAINT "FK_1c8452c884a28ab3903e523a8de"
        `);
    await queryRunner.query(`
            ALTER TABLE "notifications"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD CONSTRAINT "FK_9a8a82462cab47c73d25f49261f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_5ad9e7e248c8ed85c957f30c9e"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_ea43c84a3e9f9e24226970b6cb"
        `);
    await queryRunner.query(`
            DROP TABLE "users_attend_meetings"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_635553bc2640cf886792287701"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_8984161612ae7c05f68647cd55"
        `);
    await queryRunner.query(`
            DROP TABLE "users_follow_meetings"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_7f5c67df5d873203569cdb6da9"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_34ed30f944608d765775fa6a4e"
        `);
    await queryRunner.query(`
            DROP TABLE "meetings_have_categories"
        `);
    await queryRunner.query(`
            DROP TABLE "meetings"
        `);
  }
};
