import TextField from '@material-ui/core/TextField';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import styled from 'styled-components';

const propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

interface Props {
  label: string;
  defaultValue?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StyledTextField = styled(TextField)`
  margin: 5px;
`;

const SearchBox: React.FC<Props> = props => {
  return (
    <StyledTextField
      type="search"
      label={props.label}
      defaultValue={props.defaultValue}
      onChange={props.onChange}
    />
  );
};

SearchBox.propTypes = propTypes;

export default SearchBox;
