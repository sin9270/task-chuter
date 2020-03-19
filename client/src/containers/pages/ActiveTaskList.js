'use strict';

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { activeTaskModule } from '../../modules/activeTaskModule';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { LOG_STATUS } from '../../const';
import Header from '../organisms/header.js';
import ActiveTask from '../organisms/ActiveTask';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const style = {
  width: 600
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
      <Button
        variant="contained"
        color="primary"
        onClick={() => props.create(props.tasks)}
      >
        Create
      </Button>
      {canUndo && (
        <Button
          variant="contained"
          color="primary"
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
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={style}
            >
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

const mapStateToProps = state => {
  return state.activeTask;
};

const mapDispatchToProps = activeTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(ActiveTaskList);
