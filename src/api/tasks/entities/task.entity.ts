import { User } from '@src/api/user/entities';
import { BaseModel, ITask, TASK_STATUS } from '@src/shared';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class Task extends BaseModel implements ITask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ enum: TASK_STATUS, default: TASK_STATUS.OPEN })
  status: TASK_STATUS;

  @ManyToOne(() => User, (user) => user.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: number;
}
