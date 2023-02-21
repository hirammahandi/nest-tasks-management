import { IBaseModel } from './IBaseModel';

export interface IUser extends IBaseModel {
  id: number;

  username: string;

  password: string;
}
