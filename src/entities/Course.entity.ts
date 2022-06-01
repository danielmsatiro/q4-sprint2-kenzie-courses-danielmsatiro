import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User.entity";

@Entity("courses")
export class Course {
  @PrimaryGeneratedColumn("uuid")
  id?: number;

  @Column()
  courseName: string;

  @Column()
  duration: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  students: User[];
}
