'use strict';

import { StylesProvider } from '@material-ui/styles';
import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Provider } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Redirect, Route, Switch } from 'react-router-dom';

import ActiveTaskList from './containers/pages/ActiveTaskList';
import CompletedTaskList from './containers/pages/CompletedTaskList';
import MobileActiveTaskList from './containers/pages/MobileActiveTaskList';
import MobileCompletedTaskList from './containers/pages/MobileCompletedTaskList';
import history from './history';
import setupStore from './store';

const store = setupStore();

const App = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 480px)' });

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <StylesProvider injectFirst>
          <Switch>
            <Route
              exact
              path="/active-task-list"
              component={
                isTabletOrMobile ? MobileActiveTaskList : ActiveTaskList
              }
            />
            <Route
              exact
              path="/completed-task-list"
              component={
                isTabletOrMobile ? MobileCompletedTaskList : CompletedTaskList
              }
            />
            <Route
              path="/"
              render={() => <Redirect to="/active-task-list" />}
            />
          </Switch>
        </StylesProvider>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
