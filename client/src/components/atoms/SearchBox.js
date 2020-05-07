import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const propTypes = {
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

const StyledTextField = styled(TextField)`
  margin: 5px;
`;

const SearchBox = props => {
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
