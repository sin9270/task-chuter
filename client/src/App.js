'use strict';

import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';

import ActiveTaskList from './containers/pages/ActiveTaskList';
import CompletedTaskList from './containers/pages/CompletedTaskList';
import history from './history';
import setupStore from './store';

const store = setupStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/active-task-list" component={ActiveTaskList} />
            <Route
              exact
              path="/completed-task-list"
              component={CompletedTaskList}
            />
            <Route
              path="/"
              render={() => <Redirect to="/active-task-list" />}
            />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}
