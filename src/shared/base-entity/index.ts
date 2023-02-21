import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IBaseModel } from '../interfaces/IBaseModel';

export class BaseModel extends BaseEntity implements IBaseModel {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
