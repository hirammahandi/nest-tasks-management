import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ITask,
  TASK_NOT_FOUND_MESSAGE,
  TASK_STATUS,
  USER_NOT_FOUND_MESSAGE,
  getMappedObject,
} from '@src/shared';
import { User } from '../user/entities';
import { UserRepository } from '../user/repositories';
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskDto } from './dto';
import { TaskRepository } from './repositories';

@Injectable()
export class TasksService {
  constructor(
    private taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createTask(
    user: User,
    { title, description }: CreateTaskDto,
  ): Promise<ITask> {
    if (!user) throw new NotFoundException(USER_NOT_FOUND_MESSAGE);

    const newTask = this.taskRepository.create({
      title,
      description,
      user,
    });

    const task = await newTask.save();

    const mappedTask = getMappedObject(task, 'user');

    return mappedTask;
  }

  async findAllTasks(
    filterDto: GetTasksFilterDto,
    userId: number,
  ): Promise<ITask[]> {
    const tasks = await this.taskRepository.findTasks(filterDto, userId);
    return tasks;
  }

  // async findFilterTasks(filterDto: GetTasksFilterDto): Promise<ITask[]> {
  //   const { status, search } = filterDto;

  // *@note Way to use an OR clause using the finds option , [{clause 1}, {clause 2}]
  //    const tasks = await this.taskRepository.findBy([
  //     { status },
  //     { title: ILike(`%${search}%`) },
  //     { description: ILike(`%${search}%`) },
  //   ]);

  //   return tasks;
  // }

  async findOneTask(taskId: number, userId: number) {
    const foundTask = await this.taskRepository.findOneBy({
      id: taskId,
      user: { id: userId },
    });

    if (!foundTask) throw new NotFoundException(TASK_NOT_FOUND_MESSAGE);

    return foundTask;
  }

  async updateTask({
    taskId,
    updateTaskDto,
    userId,
  }: {
    taskId: number;
    updateTaskDto: UpdateTaskDto;
    userId: number;
  }) {
    const taskToUpdate = await this.findOneTask(taskId, userId);

    const updatedTask = await this.taskRepository.updateTask({
      taskToUpdate,
      updateTaskDto,
    });

    return updatedTask;
  }

  async removeTask(taskId: number, userId: number) {
    console.log({ taskId, userId });
    const result = await this.taskRepository.delete({
      id: taskId,
      user: { id: userId },
    });

    if (result.affected === 0)
      throw new NotFoundException(TASK_NOT_FOUND_MESSAGE);
  }

  async updateTaskStatus({
    taskId,
    status,
    userId,
  }: {
    taskId: number;
    status: TASK_STATUS;
    userId: number;
  }) {
    const foundTask = await this.findOneTask(taskId, userId);

    foundTask.status = status;

    await foundTask.save();

    return foundTask;
  }
}
