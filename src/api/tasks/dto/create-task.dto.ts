import { IsString, IsNotEmpty } from 'class-validator';
import { ITask } from '@src/shared';

export class CreateTaskDto implements Pick<ITask, 'title' | 'description'> {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
