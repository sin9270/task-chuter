'use strict';

import { createSlice } from 'redux-starter-kit';

import { LOG_STATUS, TASK_STATUS } from '../const';
import db from '../db';
import TaskModel from './TaskModel';

const activeTaskSlice = createSlice({
  name: 'activeTask',
  initialState: { tasks: [], timers: [] },
  reducers: {
    updateState: (state, action) => {
      return { ...state, ...action.payload };
    },
    replace: (state, action) => {
      state.tasks = action.payload;
    },
    update: (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex(task => task.id === updatedTask.id);
      state.tasks[index] = updatedTask;
    },
    bulkUpdate: (state, action) => {
      const updatedTasks = action.payload;
      updatedTasks.forEach(updatedTask => {
        const index = state.tasks.findIndex(task => task.id === updatedTask.id);
        state.tasks[index] = updatedTask;
      });
    },
    delete: (state, action) => {
      const id = action.payload.id;
      state.tasks = state.tasks.filter(task => task.id !== id);
    },
    addLog: (state, action) => {
      const log = action.payload;
      state.lastLog = log;
    },
  },
});

export default activeTaskSlice;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const activeTaskModule = {
  updateState: newState => async dispatch => {
    dispatch(activeTaskSlice.actions.updateState(newState));
  },

  // activeなtaskの一覧を取得する
  load: () => async dispatch => {
    // activeなtaskを取得する
    const tasks = await db.tasks
      .orderBy('index')
      .filter(task => task.status != TASK_STATUS.DONE)
      .filter(task => task.status != TASK_STATUS.DELETED)
      .toArray();

    // 実行中のtaskがある場合はelapsedTimeを更新する
    const updatedTasks = tasks.map(task => {
      if (task.status !== TASK_STATUS.RUNNING) {
        return task;
      }
      const currentTime = new Date().getTime();
      const updatedTask = {
        ...task,
        elapsedTime: task.elapsedTime + (currentTime - task.updatedAt),
        updatedAt: currentTime,
      };
      return updatedTask;
    });
    // 時刻の更新時はDBを更新する必要はなく、stateのみを更新すれば良い
    dispatch(activeTaskSlice.actions.replace(updatedTasks));
  },

  // taskを作成する
  create: (tasks, newTask) => async dispatch => {
    // 新しいtaskを先頭に追加し、indexを振り直す
    newTask = newTask || new TaskModel({}).toJson();
    const updatedTasks = [newTask, ...tasks].map((task, index) => {
      return { ...task, index: index };
    });
    await db.tasks.bulkPut(updatedTasks);
    dispatch(activeTaskSlice.actions.replace(updatedTasks));

    const log = {
      taskId: newTask.id,
      logCode: LOG_STATUS.CREATE,
      createdAt: new Date().getTime(),
    };
    await db.logs.add(log);
    dispatch(activeTaskSlice.actions.addLog(log));
  },

  // taskの実行を開始する
  start: (tasks, targetTask) => async dispatch => {
    // 指定したtaskのみ実行を開始し、他に実行しているtaskがあれば停止する
    const currentTime = new Date().getTime();
    const pausedTasks = tasks
      .filter(task => task.status === TASK_STATUS.RUNNING)
      .map(task => {
        return {
          ...task,
          status: TASK_STATUS.PAUSED,
          elapsedTime: task.elapsedTime + (currentTime - task.updatedAt),
          updatedAt: currentTime,
        };
      });
    const startedTask = {
      ...targetTask,
      status: TASK_STATUS.RUNNING,
      updatedAt: currentTime,
    };
    const updatedTasks = [...pausedTasks, startedTask];
    await db.tasks.bulkPut(updatedTasks);
    dispatch(activeTaskSlice.actions.bulkUpdate(updatedTasks));

    const log = {
      taskId: targetTask.id,
      logCode: LOG_STATUS.START,
      createdAt: currentTime,
    };
    await db.logs.add(log);
    dispatch(activeTaskSlice.actions.addLog(log));
  },

  // taskを更新する
  update: task => async dispatch => {
    const currentTime = new Date().getTime();
    const updatedTask = {
      ...task,
      updatedAt: currentTime,
    };
    // 作成直後のtaskの場合はstateを更新する
    if (task.status === TASK_STATUS.CREATED) {
      updatedTask.status = TASK_STATUS.UPDATED;
    }
    // 実行中のtaskの場合はelapsedTimeを更新する
    if (task.status === TASK_STATUS.RUNNING) {
      updatedTask.elapsedTime += currentTime - task.updatedAt;
    }
    // 時刻の更新時はDBを更新する必要はなく、stateのみを更新すれば良い
    dispatch(activeTaskSlice.actions.update(updatedTask));
  },

  // taskの実行を停止する
  pause: task => async dispatch => {
    const currentTime = new Date().getTime();
    const updatedTask = {
      ...task,
      status: TASK_STATUS.PAUSED,
      elapsedTime: task.elapsedTime + (currentTime - task.updatedAt),
      updatedAt: currentTime,
    };
    await db.tasks.put(updatedTask);
    dispatch(activeTaskSlice.actions.update(updatedTask));

    const log = {
      taskId: task.id,
      logCode: LOG_STATUS.PAUSE,
      createdAt: currentTime,
    };
    await db.logs.add(log);
    dispatch(activeTaskSlice.actions.addLog(log));
  },

  // taskを完了する
  done: task => async dispatch => {
    const currentTime = new Date().getTime();
    const updatedTask = {
      ...task,
      status: TASK_STATUS.DONE,
      updatedAt: currentTime,
    };
    await db.tasks.put(updatedTask);
    dispatch(activeTaskSlice.actions.delete(task));

    const log = {
      taskId: task.id,
      logCode: LOG_STATUS.DONE,
      createdAt: currentTime,
    };
    await db.logs.add(log);
    dispatch(activeTaskSlice.actions.addLog(log));
  },

  // taskをコピーする
  copy: (tasks, targetTask) => async dispatch => {
    const copiedTask = new TaskModel({
      title: targetTask.title,
      note: targetTask.note,
    }).toJson();
    dispatch(activeTaskModule.create(tasks, copiedTask));
  },

  // taskを削除する
  delete: task => async dispatch => {
    const currentTime = new Date().getTime();
    const updatedTask = {
      ...task,
      status: TASK_STATUS.DELETED,
      updatedAt: currentTime,
    };
    await db.tasks.put(updatedTask);
    dispatch(activeTaskSlice.actions.delete(task));

    const log = {
      taskId: task.id,
      logCode: LOG_STATUS.DELETE,
      createdAt: currentTime,
    };
    await db.logs.add(log);
    dispatch(activeTaskSlice.actions.addLog(log));
  },

  // 完了・削除したtaskを前の状態に戻す
  // logの情報を元に復元するので、これだけtaskIdを引数に取る
  undo: ({ taskId }) => async dispatch => {
    const currentTime = new Date().getTime();
    await db.tasks.update(taskId, {
      status: TASK_STATUS.PAUSED,
    });

    const log = {
      taskId: taskId,
      logCode: LOG_STATUS.UNDO,
      createdAt: currentTime,
    };
    await db.logs.add(log);
    dispatch(activeTaskSlice.actions.addLog(log));
    // stateのみからtaskの一覧を復元しようとすると処理が複雑になってしまうので、DBから取得する
    dispatch(activeTaskModule.load());
  },

  // taskを並び替える
  reorder: (tasks, sourceIndex, destinationIndex) => async dispatch => {
    const currentTime = new Date().getTime();
    const reorderedTasks = reorder(tasks, sourceIndex, destinationIndex).map(
      (task, index) => {
        return { ...task, index: index, updatedAt: currentTime };
      }
    );
    dispatch(activeTaskSlice.actions.replace(reorderedTasks));
    await db.tasks.bulkPut(reorderedTasks);
  },
};
