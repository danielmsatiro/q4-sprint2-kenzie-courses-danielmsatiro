import { compare } from "bcrypt";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("students")
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id?: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  isAdm: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  comparePwd = async (pwd: string): Promise<boolean> => {
    return await compare(pwd, this.password);
  };
}
