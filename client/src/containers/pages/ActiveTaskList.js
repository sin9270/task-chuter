'use strict';

import React from 'react';
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

class ActiveTaskList extends React.Component {
  componentDidMount() {
    this.props.load();
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.source.index === result.destination.index) {
      return;
    }

    this.props.reorder(
      this.props.tasks,
      result.source.index,
      result.destination.index
    );
  }

  getFilteredTasks(tasks) {
    const titleContains = this.props.titleContains || '';
    const noteContains = this.props.noteContains || '';
    const filteredTasks = tasks
      .filter(task => task.title.includes(titleContains))
      .filter(task => task.note.includes(noteContains));
    return filteredTasks;
  }

  render() {
    const tasks = this.getFilteredTasks(this.props.tasks);
    const lastLog = this.props.lastLog;
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
          onChange={e =>
            this.props.updateState({ titleContains: e.target.value })
          }
        />
        <TextField
          id="standard-search"
          label="Search for note"
          type="search"
          onChange={e =>
            this.props.updateState({ noteContains: e.target.value })
          }
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.props.create(this.props.tasks)}
        >
          Create
        </Button>
        {canUndo && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              this.props.undo(lastLog);
            }}
          >
            Undo
          </Button>
        )}
        <DragDropContext onDragEnd={result => this.onDragEnd(result)}>
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
  }
}

const mapStateToProps = state => {
  return state.activeTask;
};

const mapDispatchToProps = activeTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(ActiveTaskList);
