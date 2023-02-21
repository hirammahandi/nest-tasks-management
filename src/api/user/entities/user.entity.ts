import * as bcrypt from 'bcrypt';
import { Task } from 'src/api/tasks/entities';
import { BaseModel } from '@src/shared';
import { IUser } from '@src/shared';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseModel implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: [];

  @BeforeInsert()
  async hashPassword() {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
  }

  async validatePassword(password: string) {
    const isMatch = await bcrypt.compare(password, this.password);

    return isMatch;
  }
}
