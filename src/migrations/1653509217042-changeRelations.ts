import { MigrationInterface, QueryRunner } from "typeorm";

export class changeRelations1653509217042 implements MigrationInterface {
    name = 'changeRelations1653509217042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdm" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "courseName" character varying NOT NULL, "duration" character varying NOT NULL, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "courses_students_students" ("coursesId" uuid NOT NULL, "studentsId" uuid NOT NULL, CONSTRAINT "PK_cd841c434866a6504aec6bca47c" PRIMARY KEY ("coursesId", "studentsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dffd4341c3ac7907af894f52e1" ON "courses_students_students" ("coursesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6240c191ac91418ffb0891e94c" ON "courses_students_students" ("studentsId") `);
        await queryRunner.query(`ALTER TABLE "courses_students_students" ADD CONSTRAINT "FK_dffd4341c3ac7907af894f52e16" FOREIGN KEY ("coursesId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "courses_students_students" ADD CONSTRAINT "FK_6240c191ac91418ffb0891e94c5" FOREIGN KEY ("studentsId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "courses_students_students" DROP CONSTRAINT "FK_6240c191ac91418ffb0891e94c5"`);
        await queryRunner.query(`ALTER TABLE "courses_students_students" DROP CONSTRAINT "FK_dffd4341c3ac7907af894f52e16"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6240c191ac91418ffb0891e94c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dffd4341c3ac7907af894f52e1"`);
        await queryRunner.query(`DROP TABLE "courses_students_students"`);
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP TABLE "students"`);
    }

}
