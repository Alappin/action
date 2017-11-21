import {commitMutation} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';
import toGlobalId from 'universal/utils/relay/toGlobalId';

const mutation = graphql`
  mutation ClearNotificationMutation($dbNotificationId: ID!) {
    clearNotification(dbNotificationId: $dbNotificationId) {
      deletedId
    }
  }
`;

export const clearNotificationUpdater = (viewer, deletedLocalIds) => {
  const conn = ConnectionHandler.getConnection(
    viewer,
    'SocketRoute_notifications'
  );
  console.log('moe');
  if (conn) {
    console.log('larry');
    console.log(deletedLocalIds);
    const deletedGlobalIds = deletedLocalIds.map((id) => toGlobalId('Notification', id));
    deletedGlobalIds.forEach((globalId) => {
      console.log('curly');
      ConnectionHandler.deleteNode(conn, globalId);
    });
  }
};

const ClearNotificationMutation = (environment, dbNotificationId, onError, onCompleted) => {
  const {viewerId} = environment;
  return commitMutation(environment, {
    mutation,
    variables: {dbNotificationId},
    updater: (store) => {
      const viewer = store.get(viewerId);
      const deletedId = store.getRootField('clearNotification').getValue('deletedId');
      clearNotificationUpdater(viewer, [deletedId]);
    },
    optimisticResponse: { clearNotification: { deletedId: dbNotificationId } },
    // optimisticUpdater: (store) => {
    //   const viewer = store.get(viewerId);
    //   clearNotificationUpdater(viewer, [dbNotificationId]);
    // },
    onCompleted,
    onError
  });
};

export default ClearNotificationMutation;
