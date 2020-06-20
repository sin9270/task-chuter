import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { completedTaskModule } from '../../modules/completedTaskModule';
import { milliSecToHhmmssms } from '../../utils/taskUtil';
import Button from '../atoms/Button';

const propTypes = {
  task: PropTypes.object.isRequired,
  undone: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
};

const Div = styled.div`
  border: solid 2px;
  border-color: black;
  border-radius: 10px;
  padding: 15px;
`;

const CompletedTask = props => {
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
