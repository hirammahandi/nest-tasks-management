import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TASK_STATUS } from '@src/shared';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  private readonly allowedStatus = [
    TASK_STATUS.OPEN,
    TASK_STATUS.IN_PROGRESS,
    TASK_STATUS.DONE,
  ];

  transform(value: unknown) {
    this.assertsStatusIsValid(value);

    return value;
  }

  private assertsStatusIsValid(status: any): asserts status is TASK_STATUS {
    const isValid = this.allowedStatus.includes(status as TASK_STATUS);

    if (!isValid) throw new BadRequestException('Invalid Status');
  }
}
