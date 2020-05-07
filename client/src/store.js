import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import history from './history';
import activeTaskSlice from './modules/activeTaskModule';
import completedTaskSlice from './modules/completedTaskModule';

const rootReducer = combineReducers({
  router: connectRouter(history),
  activeTask: activeTaskSlice.reducer,
  completedTask: completedTaskSlice.reducer,
});

const setupStore = () => {
  const middlewares = [...getDefaultMiddleware()];
  middlewares.push(thunk);
  middlewares.push(routerMiddleware(history));

  if (process.env.NODE_ENV === `development`) {
    middlewares.push(logger);
  }

  const store = configureStore({
    reducer: rootReducer,
    middleware: middlewares,
  });

  return store;
};

export default setupStore;
