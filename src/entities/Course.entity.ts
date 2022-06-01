import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User.entity";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  courseName: string;

  @Column()
  duration: string;

  @ManyToMany(() => User, user => user.courses, { lazy: true })
  @JoinTable()
  students: User[];
}
