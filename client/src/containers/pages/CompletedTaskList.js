'use strict';

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { completedTaskModule } from '../../modules/completedTaskModule';
import { LOG_STATUS } from '../../const';
import Header from '../organisms/header.js';
import CompletedTask from '../organisms/CompletedTask';
import Button from '@material-ui/core/Button';

const propTypes = {
  tasks: PropTypes.array.isRequired,
  lastLog: PropTypes.object.isRequired,
  load: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired
};

const CompletedTaskList = props => {
  useEffect(() => {
    props.load();
  }, []);

  const lastLog = props.lastLog;
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
          onClick={() => props.undo(lastLog)}
        >
          Undo
        </Button>
      )}
      <ul>
        {props.tasks.map(task => (
          <CompletedTask key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
};

CompletedTaskList.propTypes = propTypes;

const mapStateToProps = state => {
  return state.completedTask;
};

const mapDispatchToProps = completedTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(CompletedTaskList);
