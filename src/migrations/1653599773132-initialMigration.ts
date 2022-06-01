import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1653599773132 implements MigrationInterface {
    name = 'initialMigration1653599773132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdm" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseName" character varying NOT NULL, "duration" character varying NOT NULL, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses_students_users" ("coursesId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_ed6755f24befab0c66db7ea2db3" PRIMARY KEY ("coursesId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cfd36369a9b027ccbc64ec2bbf" ON "courses_students_users" ("coursesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_da070fe9a0fe297e5cf5780929" ON "courses_students_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "courses_students_users" ADD CONSTRAINT "FK_cfd36369a9b027ccbc64ec2bbf7" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "courses_students_users" ADD CONSTRAINT "FK_da070fe9a0fe297e5cf57809291" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses_students_users" DROP CONSTRAINT "FK_da070fe9a0fe297e5cf57809291"`);
        await queryRunner.query(`ALTER TABLE "courses_students_users" DROP CONSTRAINT "FK_cfd36369a9b027ccbc64ec2bbf7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_da070fe9a0fe297e5cf5780929"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cfd36369a9b027ccbc64ec2bbf"`);
        await queryRunner.query(`DROP TABLE "courses_students_users"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
