'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { activeTaskModule } from '../../modules/activeTaskModule';
import { TASK_STATUS } from '../../const';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';

const Div = styled.div`
  border: solid 2px;
  border-color: ${props => (props.isRunning ? 'red' : 'black')};
  border-radius: 10px;
  padding: 15px;
`;

class ActiveTask extends React.Component {
  componentDidMount() {
    if (this.props.task.status === TASK_STATUS.RUNNING) {
      this.start();
    }
  }

  componentWillUnMount() {
    this.stop();
  }

  start() {
    const callback = () => {
      this.props.update(this.props.task);
    };
    const timer = setInterval(callback, 1000);
    this.props.updateState({ timers: [...this.props.timers, timer] });
  }

  stop() {
    this.props.timers.forEach(timer => {
      clearInterval(timer);
    });
    this.props.updateState({ timers: [] });
  }

  _milliSecToHhmmssms(milliSeconds) {
    const hour = Math.floor(milliSeconds / (60 * 60 * 1000));
    const minute = Math.floor((milliSeconds % (60 * 60 * 1000)) / (60 * 1000));
    const second = Math.floor((milliSeconds % (60 * 1000)) / 1000);
    const milliSecond = Math.floor(milliSeconds % 1000);

    const hh = ('00' + hour).slice(-2);
    const mm = ('00' + minute).slice(-2);
    const ss = ('00' + second).slice(-2);
    const ms = ('000' + milliSecond).slice(-3, -2);

    const formatedTime = `${hh}:${mm}:${ss}.${ms}`;
    return formatedTime;
  }

  render() {
    return (
      <Div isRunning={this.props.task.status === TASK_STATUS.RUNNING}>
        <TextField
          id="standard-basic"
          label="Task Name"
          margin="normal"
          required
          // task作成直後にフォーカスを当てる
          autoFocus={this.props.task.status === TASK_STATUS.CREATED}
          defaultValue={this.props.task.title}
          onKeyPress={e => {
            // エンターキーが押された時にフォーカスを外す
            if (e.key === 'Enter') {
              e.target.blur();
            }
          }}
          onBlur={e => {
            let newTitle = e.target.value;
            if (!e.target.value) {
              newTitle = this.props.task.title;
            }
            this.props.update({
              ...this.props.task,
              title: newTitle
            });
          }}
        />
        <div>{this._milliSecToHhmmssms(this.props.task.elapsedTime)}</div>
        <Button
          variant="contained"
          color="primary"
          disabled={
            ![
              TASK_STATUS.CREATED,
              TASK_STATUS.UPDATED,
              TASK_STATUS.PAUSED
            ].includes(this.props.task.status)
          }
          onClick={() => {
            this.props.start(this.props.tasks, this.props.task);
            this.stop();
            this.start();
          }}
        >
          Start
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={this.props.task.status !== TASK_STATUS.RUNNING}
          onClick={() => {
            this.props.pause(this.props.task);
            this.stop();
          }}
        >
          Pause
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.props.done(this.props.task);
            this.stop();
          }}
        >
          Done
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.props.copy(this.props.tasks, this.props.task);
          }}
        >
          Copy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.props.copy(this.props.tasks, this.props.task);
            this.props.done(this.props.task);
            this.stop();
          }}
        >
          Copy and Done
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.props.delete(this.props.task);
            this.stop();
          }}
        >
          Delete
        </Button>
        <TextField
          id="outlined-multiline-flexible"
          label="Note"
          multiline
          rowsMax="4"
          defaultValue={this.props.task.note}
          margin="normal"
          variant="outlined"
          onKeyPress={e => {
            // エンターキーが押された時にフォーカスを外す
            if (e.key === 'Enter') {
              e.target.blur();
            }
          }}
          onBlur={e => {
            this.props.update({
              ...this.props.task,
              note: e.target.value
            });
          }}
        />
      </Div>
    );
  }
}

const mapStateToProps = state => {
  return state.activeTask;
};

const mapDispatchToProps = activeTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(ActiveTask);
