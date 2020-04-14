'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { completedTaskModule } from '../../modules/completedTaskModule';
import Button from '../atoms/Button';
import styled from 'styled-components';

const propTypes = {
  task: PropTypes.object.isRequired,
  undone: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
};

const Div = styled.div`
  border: solid 2px;
  border-color: black;
  border-radius: 10px;
  padding: 15px;
`;

const CompletedTask = props => {
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

  return (
    <Div>
      <div>{props.task.title}</div>
      <div>{milliSecToHhmmssms(props.task.elapsedTime)}</div>
      <Button
        onClick={() => {
          props.undone(props.task);
        }}
      >
        Undone
      </Button>
      <Button
        onClick={() => {
          props.delete(props.task);
        }}
      >
        Delete
      </Button>
      <div>{props.task.note}</div>
    </Div>
  );
};

CompletedTask.propTypes = propTypes;

const mapStateToProps = state => {
  return state.completedTask;
};

const mapDispatchToProps = completedTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(CompletedTask);
