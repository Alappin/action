import {css} from 'aphrodite-local-styles/no-important';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'universal/components/Button/Button';
import TaskColumns from 'universal/components/TaskColumns/TaskColumns';
import MeetingFacilitationHint from 'universal/modules/meeting/components/MeetingFacilitationHint/MeetingFacilitationHint';
import MeetingMain from 'universal/modules/meeting/components/MeetingMain/MeetingMain';
import MeetingSection from 'universal/modules/meeting/components/MeetingSection/MeetingSection';
import actionMeeting from 'universal/modules/meeting/helpers/actionMeeting';
import getFacilitatorName from 'universal/modules/meeting/helpers/getFacilitatorName';
import withStyles from 'universal/styles/withStyles';
import {MEETING} from 'universal/utils/constants';

const MeetingUpdates = (props) => {
  const {
    gotoNext,
    localPhaseItem,
    members,
    queryKey,
    tasks,
    showMoveMeetingControls,
    styles,
    team
  } = props;
  const self = members.find((m) => m.isSelf);
  const currentTeamMember = members[localPhaseItem - 1] || {};
  const isLastMember = localPhaseItem === members.length;
  const nextPhaseName = actionMeeting.agendaitems.name;
  const myTeamMemberId = self && self.id;
  const myUserId = myTeamMemberId && myTeamMemberId.split('::')[0];
  const isMyMeetingSection = myTeamMemberId === currentTeamMember.id;

  return (
    <MeetingMain>
      <MeetingSection flexToFill>
        <div className={css(styles.layout)}>
          {showMoveMeetingControls ?
            <Button
              buttonStyle="flat"
              colorPalette="cool"
              icon="arrow-circle-right"
              iconPlacement="right"
              key={`update${localPhaseItem}`}
              label={isLastMember ? `Move on to the ${nextPhaseName}` : 'Next team member '}
              onClick={gotoNext}
              buttonSize="medium"
            /> :
            <MeetingFacilitationHint>
              {isLastMember ?
                <span>{'Waiting for '}<b>{getFacilitatorName(team, members)}</b> {`to advance to the ${nextPhaseName}`}</span> :
                <span>{'Waiting for '}<b>{currentTeamMember.preferredName}</b> {`to give ${actionMeeting.updates.name}`}</span>
              }
            </MeetingFacilitationHint>
          }
        </div>
        <div className={css(styles.body)}>
          <TaskColumns
            alignColumns="center"
            isMyMeetingSection={isMyMeetingSection}
            myTeamMemberId={myTeamMemberId}
            tasks={tasks}
            queryKey={queryKey}
            area={MEETING}
            userId={myUserId}
          />
        </div>
      </MeetingSection>
    </MeetingMain>
  );
};

MeetingUpdates.propTypes = {
  gotoItem: PropTypes.func.isRequired,
  gotoNext: PropTypes.func.isRequired,
  localPhaseItem: PropTypes.number.isRequired,
  members: PropTypes.array.isRequired,
  onFacilitatorPhase: PropTypes.bool,
  tasks: PropTypes.object.isRequired,
  queryKey: PropTypes.string.isRequired,
  showMoveMeetingControls: PropTypes.bool,
  styles: PropTypes.object,
  team: PropTypes.object.isRequired
};

const styleThunk = () => ({
  layout: {
    margin: '0 auto',
    maxWidth: '80rem',
    textAlign: 'center',
    width: '100%'
  },

  body: {
    display: 'flex',
    flex: 1,
    padding: '1rem 1rem 0',
    width: '100%'
  }
});

export default withStyles(styleThunk)(MeetingUpdates);
