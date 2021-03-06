import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { LOG_STATUS } from '../../const';
import { completedTaskModule } from '../../modules/completedTaskModule';
import Button from '../atoms/Button';
import SearchBox from '../atoms/SearchBox';
import CompletedTask from '../organisms/CompletedTask';
import Header from '../organisms/Header';

const propTypes = {
  tasks: PropTypes.array.isRequired,
  titleContains: PropTypes.string,
  noteContains: PropTypes.string,
  lastLog: PropTypes.object,
  updateState: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
};

const CompletedTaskList = props => {
  useEffect(() => {
    props.load();
  }, []);

  const getFilteredTasks = tasks => {
    const titleContains = props.titleContains || '';
    const noteContains = props.noteContains || '';
    const filteredTasks = tasks
      .filter(task => task.title.includes(titleContains))
      .filter(task => task.note.includes(noteContains));
    return filteredTasks;
  };

  const tasks = getFilteredTasks(props.tasks);

  const lastLog = props.lastLog;
  const canUndo = lastLog
    ? [LOG_STATUS.DELETE].includes(lastLog.logCode)
    : false;

  return (
    <div>
      <Header initialTab="completedTaskList" />
      <SearchBox
        label="Search for title"
        defaultValue={props.titleContains}
        onChange={e => props.updateState({ titleContains: e.target.value })}
      />
      <SearchBox
        label="Search for note"
        defaultValue={props.noteContains}
        onChange={e => props.updateState({ noteContains: e.target.value })}
      />
      {canUndo && <Button onClick={() => props.undo(lastLog)}>Undo</Button>}
      {tasks.map(task => (
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
