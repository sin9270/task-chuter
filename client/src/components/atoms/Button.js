import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const propTypes = {
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

const StyledButton = styled(Button)`
  margin: 5px;
`;

const MainButton = props => {
  return (
    <StyledButton
      variant="contained"
      color="primary"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </StyledButton>
  );
};

MainButton.propTypes = propTypes;

export default MainButton;
