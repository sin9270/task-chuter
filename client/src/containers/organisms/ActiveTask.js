'use strict';

import React, { useEffect } from 'react';
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

const ActiveTask = props => {
  const start = () => {
    const callback = () => {
      props.update(props.task);
    };
    const timer = setInterval(callback, 1000);
    props.updateState({ timers: [...props.timers, timer] });
  };

  const stop = () => {
    props.timers.forEach(timer => {
      clearInterval(timer);
    });
    props.updateState({ timers: [] });
  };

  const milliSecToHhmmssms = milliSeconds => {
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
  };

  useEffect(() => {
    if (props.task.status === TASK_STATUS.RUNNING) {
      start();
    }
    return () => stop();
  }, [props.task.status]);

  return (
    <Div isRunning={props.task.status === TASK_STATUS.RUNNING}>
      <TextField
        id="standard-basic"
        label="Task Name"
        margin="normal"
        required
        // task作成直後にフォーカスを当てる
        autoFocus={props.task.status === TASK_STATUS.CREATED}
        defaultValue={props.task.title}
        onKeyPress={e => {
          // エンターキーが押された時にフォーカスを外す
          if (e.key === 'Enter') {
            e.target.blur();
          }
        }}
        onBlur={e => {
          let newTitle = e.target.value;
          if (!e.target.value) {
            newTitle = props.task.title;
          }
          props.update({
            ...props.task,
            title: newTitle
          });
        }}
      />
      <div>{milliSecToHhmmssms(props.task.elapsedTime)}</div>
      <Button
        variant="contained"
        color="primary"
        disabled={
          ![
            TASK_STATUS.CREATED,
            TASK_STATUS.UPDATED,
            TASK_STATUS.PAUSED
          ].includes(props.task.status)
        }
        onClick={() => {
          props.start(props.tasks, props.task);
          stop();
          start();
        }}
      >
        Start
      </Button>
      <Button
        variant="contained"
        color="primary"
        disabled={props.task.status !== TASK_STATUS.RUNNING}
        onClick={() => {
          props.pause(props.task);
          stop();
        }}
      >
        Pause
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          props.done(props.task);
          stop();
        }}
      >
        Done
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          props.copy(props.tasks, props.task);
        }}
      >
        Copy
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          props.copy(props.tasks, props.task);
          props.done(props.task);
          stop();
        }}
      >
        Copy and Done
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          props.delete(props.task);
          stop();
        }}
      >
        Delete
      </Button>
      <TextField
        id="outlined-multiline-flexible"
        label="Note"
        multiline
        rowsMax="4"
        defaultValue={props.task.note}
        margin="normal"
        variant="outlined"
        onKeyPress={e => {
          // エンターキーが押された時にフォーカスを外す
          if (e.key === 'Enter') {
            e.target.blur();
          }
        }}
        onBlur={e => {
          props.update({
            ...props.task,
            note: e.target.value
          });
        }}
      />
    </Div>
  );
};

const mapStateToProps = state => {
  return state.activeTask;
};

const mapDispatchToProps = activeTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(ActiveTask);
