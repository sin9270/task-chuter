'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

const propTypes = {
  children: PropTypes.string.isRequired
};

const StyledButton = styled(Button)`
  margin: 15px;
`;

const MainButton = props => {
  return (
    <StyledButton variant="contained" color="primary">
      {props.children}
    </StyledButton>
  );
};

MainButton.propTypes = propTypes;

export default MainButton;
