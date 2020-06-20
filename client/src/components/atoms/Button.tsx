import Button from '@material-ui/core/Button';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import styled from 'styled-components';

const propTypes = {
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

interface Props {
  children: string;
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const StyledButton = styled(Button)`
  margin: 5px;
`;

const MainButton: React.FC<Props> = props => {
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
