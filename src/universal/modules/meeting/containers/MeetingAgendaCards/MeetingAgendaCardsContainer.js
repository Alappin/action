import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {cashay} from 'cashay';
import MeetingAgendaCards from 'universal/modules/meeting/components/MeetingAgendaCards/MeetingAgendaCards';

const meetingAgendaCardsQuery = `
query {
  agendaTasks(agendaId: $agendaId) @live {
    id
    integration {
      service
      nameWithOwner
      issueNumber
    }
    agendaId
    content
    createdAt
    createdBy
    updatedAt
    status
    tags
    team @cached(type: "Team") {
      id
      name
    }
    teamMember @cached(type: "TeamMember") {
      id
      picture
      preferredName
    }
    teamMemberId
  }
}
`;

const mapStateToProps = (state, props) => {
  const {agendaId} = props;
  const {agendaTasks} = cashay.query(meetingAgendaCardsQuery, {
    op: 'meetingAgendaCardsContainer',
    key: agendaId,
    variables: {agendaId},
    resolveCached: {
      teamMember: (source) => source.teamMemberId,
      team: (source) => source.teamMemberId.split('::')[1]
    },
    sort: {
      agendaTasks: (a, b) => a.createdAt - b.createdAt
    }
  }).data;
  return {
    outcomes: agendaTasks
  };
};

const MeetingAgendaCardsContainer = (props) => {
  const {agendaId, dispatch, myTeamMemberId, outcomes} = props;
  return (
    <MeetingAgendaCards
      agendaId={agendaId}
      myTeamMemberId={myTeamMemberId}
      outcomes={outcomes}
      dispatch={dispatch}
    />
  );
};

MeetingAgendaCardsContainer.propTypes = {
  agendaId: PropTypes.string,
  dispatch: PropTypes.func,
  myTeamMemberId: PropTypes.string,
  outcomes: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(MeetingAgendaCardsContainer);
