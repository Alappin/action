/**
 * The container block for reflection cards.
 *
 * @flow
 */

import React from 'react';
import styled from 'react-emotion';

import appTheme from 'universal/styles/theme/appTheme';

const ReflectionCardWrapper = styled(
  (props) => <div aria-label="Retrospective reflection" {...props} />
)({
  backgroundColor: '#FFF',
  borderRadius: 3,
  boxShadow: '0 0 1px 1px rgba(0, 0, 0, .1)',
  color: appTheme.palette.dark,
  minHeight: '1rem',
  position: 'relative',
  width: '20rem'
});

export default ReflectionCardWrapper;
