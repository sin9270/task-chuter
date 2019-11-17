'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { completedTaskModule } from '../../modules/completedTaskModule';
import { LOG_STATUS } from '../../const';
import Header from '../organisms/header.js';
import CompletedTask from '../organisms/CompletedTask';
import Button from '@material-ui/core/Button';

class CompletedTaskList extends React.Component {
  componentDidMount() {
    this.props.load();
  }

  render() {
    const lastLog = this.props.lastLog;
    const canUndo = lastLog
      ? [LOG_STATUS.DELETE].includes(lastLog.logCode)
      : false;

    return (
      <div>
        <Header initialTab="completedTaskList" />
        {canUndo && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.props.undo(lastLog)}
          >
            Undo
          </Button>
        )}
        <ul>
          {this.props.tasks.map(task => (
            <CompletedTask key={task.id} task={task} />
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state.completedTask;
};

const mapDispatchToProps = completedTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(CompletedTaskList);
