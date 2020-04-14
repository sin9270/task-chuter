'use strict';

import crypto from 'crypto';

import { TASK_STATUS } from '../const';

export default class TaskModel {
  constructor({
    id = crypto.randomBytes(20).toString('hex'),
    index = 0,
    title = 'New Task',
    status = TASK_STATUS.CREATED,
    elapsedTime = 0,
    note = '',
    createdAt = new Date().getTime(),
    updatedAt = new Date().getTime()
  }) {
    this.id = id;
    this.index = index;
    this.title = title;
    this.status = status;
    this.elapsedTime = elapsedTime;
    this.note = note;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  toJson() {
    return {
      id: this.id,
      index: this.index,
      title: this.title,
      status: this.status,
      elapsedTime: this.elapsedTime,
      note: this.note,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
