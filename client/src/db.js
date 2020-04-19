'use strict';

import Dexie from 'dexie';

const db = new Dexie('AppDatabase');
db.version(1).stores({
  tasks: 'id, index, title, status, elapsedTime, note, createdAt, updatedAt',
  logs: '++id, taskId, logCode, createdAt',
});

export default db;
