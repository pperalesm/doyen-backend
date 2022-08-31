const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class UserCreation1661979498940 {
    name = 'UserCreation1661979498940'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying,
                "name" character varying,
                "image_url" character varying,
                "description" character varying,
                "profession" character varying,
                "gains" integer NOT NULL DEFAULT '0',
                "is_public" boolean NOT NULL DEFAULT false,
                "is_verified" boolean NOT NULL DEFAULT false,
                "accepts_emails" boolean NOT NULL DEFAULT true,
                "language" character varying NOT NULL DEFAULT 'en',
                "banned_until" TIMESTAMP,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "users"
        `);
    }
}
