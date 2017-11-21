import {GraphQLID, GraphQLNonNull} from 'graphql';
import getRethink from 'server/database/rethinkDriver';
import DefaultRemovalPayload from 'server/graphql/types/DefaultRemovalPayload';
import {getUserId, requireNotificationOwner} from 'server/utils/authorization';
import getPubSub from 'server/utils/getPubSub';
import {NOTIFICATIONS_CLEARED} from 'universal/utils/constants';

export default {
  type: DefaultRemovalPayload,
  description: 'Remove a notification by ID',
  args: {
    dbNotificationId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The id of the notification to remove'
    }
  },
  async resolve(source, {dbNotificationId}, {authToken, socket}) {
    const r = getRethink();

    // AUTH
    const userId = getUserId(authToken);
    const notification = await r.table('Notification').get(dbNotificationId);
    requireNotificationOwner(userId, notification);

    // RESOLUTION
    await r.table('Notification').get(dbNotificationId).delete();

    const notificationsCleared = {
      deletedIds: [dbNotificationId]
    };
    console.log('publishing clear notification');
    getPubSub().publish(`${NOTIFICATIONS_CLEARED}.${userId}`, {notificationsCleared, mutatorId: socket.id});
    return {deletedId: dbNotificationId};
  }
};
