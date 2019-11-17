'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { completedTaskModule } from '../../modules/completedTaskModule';
import Button from '@material-ui/core/Button';

const style = {
  borderRadius: 10,
  border: 'solid 2px',
  padding: '15px'
};

class CompletedTask extends React.Component {
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
      <div className="Task" style={style}>
        <div>{this.props.task.title}</div>
        <div>{this._milliSecToHhmmssms(this.props.task.elapsedTime)}</div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.props.undone(this.props.task);
          }}
        >
          Undone
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            this.props.delete(this.props.task);
          }}
        >
          Delete
        </Button>
        <div>{this.props.task.note}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state.completedTask;
};

const mapDispatchToProps = completedTaskModule;

export default connect(mapStateToProps, mapDispatchToProps)(CompletedTask);
