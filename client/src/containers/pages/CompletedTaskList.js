'use strict';

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { LOG_STATUS } from '../../const';
import { completedTaskModule } from '../../modules/completedTaskModule';
import Button from '../atoms/Button';
import CompletedTask from '../organisms/CompletedTask';
import Header from '../organisms/header.js';

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
      {canUndo && <Button onClick={() => props.undo(lastLog)}>Undo</Button>}
      {props.tasks.map(task => (
        <CompletedTask key={task.id} task={task} />
      ))}
    </div>
  );
};

CompletedTaskList.propTypes = propTypes;

const mapStateToProps = state => {
  return state.completedTask;
};

const mapDispatchToProps = completedTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(CompletedTaskList);
