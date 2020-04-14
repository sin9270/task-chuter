'use strict';

import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const propTypes = {
  children: PropTypes.string.isRequired
};

const StyledButton = styled(Button)`
  margin: 15px;
`;

const MainButton = props => {
  return (
    <StyledButton variant="contained" color="primary" {...props}>
      {props.children}
    </StyledButton>
  );
};

MainButton.propTypes = propTypes;

export default MainButton;
