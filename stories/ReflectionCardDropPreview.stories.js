/**
 * Stories for the ReflectionCardDropPreview component.
 *
 * @flow
 */

// $FlowFixMe
import React from 'react';
import {storiesOf} from '@storybook/react';

import ReflectionCardDropPreview from 'universal/components/ReflectionCardDropPreview/ReflectionCardDropPreview';

import Grid from './components/Grid';
import RetroBackground from './components/RetroBackground';
import StoryContainer from './components/StoryContainer';

storiesOf('ReflectionCardDropPreview', module)
  .add('with a height', () => (
    <StoryContainer
      render={() => (
        <RetroBackground>
          <Grid>
            <ReflectionCardDropPreview height="2rem" />
            <ReflectionCardDropPreview height="200px" />
          </Grid>
        </RetroBackground>
      )}
    />
  ));
