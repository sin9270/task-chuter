'use strict';

import { createSlice } from 'redux-starter-kit';
import db from '../db';
import { TASK_STATUS, LOG_STATUS } from '../const';

const completedTaskSlice = createSlice({
  name: 'completedTask',
  initialState: { tasks: [] },
  reducers: {
    replace: (state, action) => {
      const tasks = action.payload;
      state.tasks = tasks;
    },
    delete: (state, action) => {
      const id = action.payload;
      state.tasks = state.tasks.filter(task => task.id !== id);
    },
    addLog: (state, action) => {
      const log = action.payload;
      state.lastLog = log;
    }
  }
});

export default completedTaskSlice;

export const completedTaskModule = {
  // 完了したtaskの一覧を取得する
  load: () => async dispatch => {
    const tasks = await db.tasks
      .filter(task => task.status === TASK_STATUS.DONE)
      .reverse()
      .sortBy('updatedAt');
    dispatch(completedTaskSlice.actions.replace(tasks));
  },

  // 完了したtaskをactiveに戻す
  undone: task => async dispatch => {
    const currentTime = new Date().getTime();
    const updatedTask = {
      ...task,
      status: TASK_STATUS.PAUSED,
      updatedAt: currentTime
    };
    await db.tasks.put(updatedTask);
    dispatch(completedTaskSlice.actions.delete(task.id));

    const log = {
      taskId: task.id,
      logCode: LOG_STATUS.DONE,
      createdAt: currentTime
    };
    await db.logs.add(log);
    dispatch(completedTaskSlice.actions.addLog(log));
  },

  // taskを削除する
  delete: task => async dispatch => {
    const currentTime = new Date().getTime();
    const updatedTask = {
      ...task,
      status: TASK_STATUS.DELETED,
      updatedAt: currentTime
    };
    await db.tasks.put(updatedTask);
    dispatch(completedTaskSlice.actions.delete(task.id));

    const log = {
      taskId: task.id,
      logCode: LOG_STATUS.DELETE,
      createdAt: currentTime
    };
    await db.logs.add(log);
    dispatch(completedTaskSlice.actions.addLog(log));
  },

  // 削除したtaskを前の状態に戻す
  // logの情報を元に復元するので、これだけtaskIdを引数に取る
  undo: ({ taskId }) => async dispatch => {
    const currentTime = new Date().getTime();
    await db.tasks.update(taskId, {
      status: TASK_STATUS.DONE
    });

    const log = {
      taskId: taskId,
      logCode: LOG_STATUS.UNDO,
      createdAt: currentTime
    };
    await db.logs.add(log);
    dispatch(completedTaskSlice.actions.addLog(log));
    // stateのみからtaskの一覧を復元しようとすると処理が複雑になってしまうので、DBから取得する
    dispatch(completedTaskModule.load());
  }
};
