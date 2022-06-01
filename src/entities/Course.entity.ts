import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { Student } from "./Student.entity";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id?: number;

  @Column()
  courseName: string;

  @Column()
  duration: string;

  @ManyToMany(() => Student, { eager: true })
  @JoinTable()
  students: Student[];
}
