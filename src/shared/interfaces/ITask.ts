import { TASK_STATUS } from '../enums';
import { IBaseModel } from './IBaseModel';

export interface ITask extends IBaseModel {
  id: number;
  title: string;
  description: string;
  status: TASK_STATUS;
}
