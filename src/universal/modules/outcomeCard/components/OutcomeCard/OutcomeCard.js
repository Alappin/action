import {css} from 'aphrodite-local-styles/no-important';
import PropTypes from 'prop-types';
import React from 'react';
import TaskEditor from 'universal/components/TaskEditor/TaskEditor';
import TaskIntegrationLink from 'universal/components/TaskIntegrationLink';
import TaskWatermark from 'universal/components/TaskWatermark';
import EditingStatusContainer from 'universal/containers/EditingStatus/EditingStatusContainer';
import OutcomeCardFooter from 'universal/modules/outcomeCard/components/OutcomeCardFooter/OutcomeCardFooter';
import {cardBorderTop, cardRootStyles} from 'universal/styles/helpers';
import labels from 'universal/styles/theme/labels';
import ui from 'universal/styles/ui';
import withStyles from 'universal/styles/withStyles';
import {ACTIVE, DONE, FUTURE, STUCK} from 'universal/utils/constants';
import isTaskArchived from 'universal/utils/isTaskArchived';
import isTaskPrivate from 'universal/utils/isTaskPrivate';

const OutcomeCard = (props) => {
  const {
    area,
    cardHasFocus,
    cardHasHover,
    cardHasMenuOpen,
    editorRef,
    editorState,
    isAgenda,
    isDragging,
    isEditing,
    handleAddTask,
    hasDragStyles,
    outcome,
    setEditorRef,
    setEditorState,
    trackEditingComponent,
    styles,
    teamMembers,
    toggleMenuState
  } = props;
  const isPrivate = isTaskPrivate(outcome.tags);
  const isArchived = isTaskArchived(outcome.tags);
  const {status} = outcome;
  const rootStyles = css(
    styles.root,
    styles.cardBlock,
    styles[status],
    isPrivate && styles.isPrivate,
    isArchived && styles.isArchived,
    // hover before focus, it matters
    cardHasHover && styles.cardHasHover,
    cardHasFocus && styles.cardHasFocus,
    hasDragStyles && styles.hasDragStyles
  );
  const {integration} = outcome;
  const {service} = integration || {};
  return (
    <div className={rootStyles}>
      <TaskWatermark service={service} />
      <div className={css(styles.contentBlock)}>
        <EditingStatusContainer
          isEditing={isEditing}
          outcomeId={outcome.id}
          createdAt={outcome.createdAt}
          updatedAt={outcome.updatedAt}
        />
        <TaskEditor
          editorRef={editorRef}
          editorState={editorState}
          readOnly={Boolean(isArchived || isDragging || service)}
          setEditorRef={setEditorRef}
          setEditorState={setEditorState}
          trackEditingComponent={trackEditingComponent}
          teamMembers={teamMembers}
        />
        <TaskIntegrationLink integration={integration} />
        <OutcomeCardFooter
          area={area}
          cardIsActive={cardHasFocus || cardHasHover || cardHasMenuOpen}
          editorState={editorState}
          handleAddTask={handleAddTask}
          isAgenda={isAgenda}
          isPrivate={isPrivate}
          outcome={outcome}
          teamMembers={teamMembers}
          toggleMenuState={toggleMenuState}
        />
      </div>
    </div>
  );
};

OutcomeCard.propTypes = {
  area: PropTypes.string,
  editorRef: PropTypes.any,
  editorState: PropTypes.object,
  cardHasHover: PropTypes.bool,
  cardHasFocus: PropTypes.bool,
  cardHasMenuOpen: PropTypes.bool,
  cardHasIntegration: PropTypes.bool,
  handleAddTask: PropTypes.func,
  hasDragStyles: PropTypes.bool,
  isAgenda: PropTypes.bool,
  isDragging: PropTypes.bool,
  isEditing: PropTypes.bool,
  outcome: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
    status: PropTypes.oneOf(labels.taskStatus.slugs),
    teamMemberId: PropTypes.string,
    createdAt: PropTypes.instanceOf(Date),
    updatedAt: PropTypes.instanceOf(Date)
  }),
  setEditorRef: PropTypes.func.isRequired,
  setEditorState: PropTypes.func,
  trackEditingComponent: PropTypes.func,
  styles: PropTypes.object,
  teamMembers: PropTypes.array,
  toggleMenuState: PropTypes.func.isRequired
};

const styleThunk = () => ({
  root: {
    ...cardRootStyles,
    outline: 'none',
    paddingTop: '.1875rem',
    transition: `box-shadow ${ui.transition[0]}`,
    '::after': {
      ...cardBorderTop
    }
  },

  [ACTIVE]: {
    '::after': {
      color: labels.taskStatus[ACTIVE].color
    }
  },

  [STUCK]: {
    '::after': {
      color: labels.taskStatus[STUCK].color
    }
  },

  [DONE]: {
    '::after': {
      color: labels.taskStatus[DONE].color
    }
  },

  [FUTURE]: {
    '::after': {
      color: labels.taskStatus[FUTURE].color
    }
  },

  // hover before focus, it matters

  cardHasHover: {
    boxShadow: ui.shadow[1]
  },

  cardHasFocus: {
    boxShadow: ui.shadow[2]
  },

  hasDragStyles: {
    boxShadow: 'none'
  },

  // TODO: Cards need block containers, not margin (TA)
  cardBlock: {
    marginBottom: '.5rem'
  },

  isPrivate: {
    backgroundColor: ui.privateCardBgColor
  },

  isArchived: {
    '::after': {
      color: labels.archived.color
    }
  },

  contentBlock: {
    position: 'relative',
    zIndex: ui.ziMenu - 1
  }
});

export default withStyles(styleThunk)(OutcomeCard);
