import { firestore, firebase } from 'firebaseDir';

export default {
  namespaced: true,
  state: {
    activity: null,
  },
  getters: {
    getActivity(state) {
      return state.activity;
    },
  },
  mutations: {
    setActivity(state, value) {
      state.activity = value;
    },
  },
  actions: {
    async completeActivity({ getters }, payload) {
      const activity = getters.getActivity || payload;
      try {
        const activityRef = firestore.collection('activity').doc(activity.id);

        const prevCompleteCount = activity.complete_count;
        const timestamp = Date.now();
        const { cooldown } = activity;
        const cooldownExpirationDate = timestamp + cooldown;
        console.log('timestamp', timestamp, 'cooldown', cooldown, 'exp', cooldownExpirationDate);

        await activityRef.update({
          complete_dates: firebase.firestore.FieldValue.arrayUnion(timestamp),
          complete_count: prevCompleteCount + 1,
          cooldown_expiration_date: cooldownExpirationDate,
        });
        return timestamp;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async cancelLastComplete({ getters }, payload) {
      const activity = getters.getActivity || payload;
      try {
        const activityRef = firestore.collection('activity').doc(activity.id);

        await activityRef.update({
          complete_dates: activity.complete_dates.slice(0, -1),
          complete_count: activity.complete_count - 1,
          cooldown_expiration_date: 0,
        });
        return payload;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async deleteActivity({ getters, dispatch }, payload) {
      const id = getters.getActivity?.id || payload.id;
      await firestore.collection('activity').doc(id).delete();
      await dispatch('activityList/updateList', null, { root: true });
      return id;
    },
  },
};
