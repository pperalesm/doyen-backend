const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class AllEntitiesCreation1663607069734 {
  name = 'AllEntitiesCreation1663607069734';

  async up(queryRunner) {
    await queryRunner.query(`
            CREATE TABLE "collaborations" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "percentage" integer NOT NULL,
                "is_accepted" boolean NOT NULL DEFAULT false,
                "user_id" uuid NOT NULL,
                "meeting_id" uuid NOT NULL,
                CONSTRAINT "PK_6d843532637cb55b078793e6811" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "purchases" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "meeting_id" uuid NOT NULL,
                CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "steps" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "amount" double precision NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "bid_id" uuid NOT NULL,
                CONSTRAINT "PK_65f86ac8996204d11f915f66a5b" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "bids" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "amount" double precision NOT NULL,
                "user_id" uuid NOT NULL,
                "meeting_id" uuid NOT NULL,
                CONSTRAINT "PK_7950d066d322aab3a488ac39fe5" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings"
            ADD "image_url" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings"
            ADD "description" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings"
            ALTER COLUMN "published_at" DROP NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "collaborations"
            ADD CONSTRAINT "FK_80fc2181fccbdc292965674825f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "collaborations"
            ADD CONSTRAINT "FK_aa57a6e0de76726aaebce45aae7" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "purchases"
            ADD CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "purchases"
            ADD CONSTRAINT "FK_59b55200ed4f1b3fea0948bc531" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "steps"
            ADD CONSTRAINT "FK_73c9f7972468367bb071b513352" FOREIGN KEY ("bid_id") REFERENCES "bids"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "bids"
            ADD CONSTRAINT "FK_cd7b0cdcb890ad457b676c0dfe8" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "bids"
            ADD CONSTRAINT "FK_9b47e7376fd5effebd463d03827" FOREIGN KEY ("meeting_id") REFERENCES "meetings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
            ALTER TABLE "bids" DROP CONSTRAINT "FK_9b47e7376fd5effebd463d03827"
        `);
    await queryRunner.query(`
            ALTER TABLE "bids" DROP CONSTRAINT "FK_cd7b0cdcb890ad457b676c0dfe8"
        `);
    await queryRunner.query(`
            ALTER TABLE "steps" DROP CONSTRAINT "FK_73c9f7972468367bb071b513352"
        `);
    await queryRunner.query(`
            ALTER TABLE "purchases" DROP CONSTRAINT "FK_59b55200ed4f1b3fea0948bc531"
        `);
    await queryRunner.query(`
            ALTER TABLE "purchases" DROP CONSTRAINT "FK_024ddf7e04177a07fcb9806a90a"
        `);
    await queryRunner.query(`
            ALTER TABLE "collaborations" DROP CONSTRAINT "FK_aa57a6e0de76726aaebce45aae7"
        `);
    await queryRunner.query(`
            ALTER TABLE "collaborations" DROP CONSTRAINT "FK_80fc2181fccbdc292965674825f"
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings"
            ALTER COLUMN "published_at"
            SET NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "meetings" DROP COLUMN "image_url"
        `);
    await queryRunner.query(`
            DROP TABLE "bids"
        `);
    await queryRunner.query(`
            DROP TABLE "steps"
        `);
    await queryRunner.query(`
            DROP TABLE "purchases"
        `);
    await queryRunner.query(`
            DROP TABLE "collaborations"
        `);
  }
};
