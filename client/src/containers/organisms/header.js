'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

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

const mapDispatchToProps = { push };

export default connect(null, mapDispatchToProps)(Header);
