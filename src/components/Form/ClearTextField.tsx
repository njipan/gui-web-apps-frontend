import React from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';

const ClearTextField = styled(TextField)`
  label.Mui-focused {
    color: green;
  }
  .MuiInput-underline {
    &:before {
      border-color: transparent;
    }
  }
`;

export default ClearTextField;