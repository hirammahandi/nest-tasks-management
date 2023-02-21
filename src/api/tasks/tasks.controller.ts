import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ITask, TASK_STATUS, GetUser } from '@src/shared';
import { JwtGuard } from '../../shared/guards/jwt.guard';
import { CreateTaskDto, GetTasksFilterDto, UpdateTaskDto } from './dto';
import { TaskStatusValidationPipe } from './pipes';
import { TasksService } from './tasks.service';
import { User } from '../user/entities';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  // *@note The way to use pipes at handlers levels -> @UsePipes(ValidationPipe)
  create(
    @GetUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<ITask> {
    return this.tasksService.createTask(user, createTaskDto);
  }

  @Get()
  findAll(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser('id') userId: number,
  ): Promise<ITask[]> {
    return this.tasksService.findAllTasks(filterDto, userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
  ) {
    return this.tasksService.findOneTask(taskId, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser('id') userId: number,
  ) {
    return this.tasksService.updateTask({ taskId, updateTaskDto, userId });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) taskId: number,
    @GetUser('id') userId: number,
  ) {
    return this.tasksService.removeTask(taskId, userId);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) taskId: number,
    @Body(
      'status',
      TaskStatusValidationPipe, //@note * Way to use pipe at parameter level
    )
    status: TASK_STATUS,
    @GetUser('id') userId: number,
  ) {
    return this.tasksService.updateTaskStatus({ taskId, status, userId });
  }
}
