import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTasksFilterDto, UpdateTaskDto } from '../dto';

export class TaskRepository extends Repository<Task> {
  constructor(@InjectRepository(Task) repository: Repository<Task>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findTasks(filterDto: GetTasksFilterDto, userId: number) {
    const { search, status } = filterDto;

    // *@note Way to crate a query using an alias
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async updateTask({
    taskToUpdate,
    updateTaskDto,
  }: {
    taskToUpdate: Task;
    updateTaskDto: UpdateTaskDto;
  }): Promise<Task> {
    const updatedTask = await this.save({
      ...taskToUpdate,
      ...updateTaskDto,
    });

    return updatedTask;
  }
}
