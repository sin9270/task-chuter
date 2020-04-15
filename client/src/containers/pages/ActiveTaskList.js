'use strict';

import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';

import { LOG_STATUS } from '../../const';
import { activeTaskModule } from '../../modules/activeTaskModule';
import Button from '../atoms/Button';
import ActiveTask from '../organisms/ActiveTask';
import Header from '../organisms/header';

const propTypes = {
  tasks: PropTypes.array.isRequired,
  titleContains: PropTypes.string.isRequired,
  noteContains: PropTypes.string.isRequired,
  lastLog: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
  load: PropTypes.func.isRequired,
  reorder: PropTypes.func.isRequired,
  create: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired
};

const ActiveTaskList = props => {
  useEffect(() => {
    props.load();
  }, []);

  const onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    if (result.source.index === result.destination.index) {
      return;
    }

    props.reorder(props.tasks, result.source.index, result.destination.index);
  };

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
    ? [LOG_STATUS.DONE, LOG_STATUS.DELETE].includes(lastLog.logCode)
    : false;

  return (
    <div>
      <Header initialTab="activeTaskList" />
      <TextField
        id="standard-search"
        label="Search for title"
        type="search"
        onChange={e => props.updateState({ titleContains: e.target.value })}
      />
      <TextField
        id="standard-search"
        label="Search for note"
        type="search"
        onChange={e => props.updateState({ noteContains: e.target.value })}
      />
      <Button onClick={() => props.create(props.tasks)}>Create</Button>
      {canUndo && (
        <Button
          onClick={() => {
            props.undo(lastLog);
          }}
        >
          Undo
        </Button>
      )}
      <DragDropContext onDragEnd={result => onDragEnd(result)}>
        <Droppable droppableId="list">
          {provided => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ActiveTask key={task.id} task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

ActiveTaskList.propTypes = propTypes;

const mapStateToProps = state => {
  return state.activeTask;
};

const mapDispatchToProps = activeTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(ActiveTaskList);
