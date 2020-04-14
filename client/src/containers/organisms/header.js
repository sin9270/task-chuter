'use strict';

import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { push } from 'connected-react-router';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const propTypes = {
  initialTab: PropTypes.string.isRequired,
  push: PropTypes.func.isRequired
};

const Header = props => {
  const [value, setValue] = React.useState(props.initialTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Paper square>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          centered
          variant="fullWidth"
          onChange={handleChange}
        >
          <Tab
            label="Active Tasks"
            value="activeTaskList"
            onClick={() => props.push('/active-task-list')}
          />
          <Tab
            label="Completed Tasks"
            value="completedTaskList"
            onClick={() => props.push('/completed-task-list')}
          />
        </Tabs>
      </Paper>
    </div>
  );
};

Header.propTypes = propTypes;

const mapDispatchToProps = { push };

export default connect(null, mapDispatchToProps)(Header);
