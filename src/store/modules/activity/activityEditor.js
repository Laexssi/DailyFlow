import { firestore } from 'firebaseDir';

const activitySchema = {
  complete_count: 0,
  cooldown: 0,
  cooldown_expiration_date: 0,
  emoji: null,
  labels: [],
  last_complete_day: null,
  complete_dates: null,
  name: null,
  id: null,
  userId: null,
};

export default {
  namespaced: true,
  state: {
    activity: { ...activitySchema },
  },
  getters: {
    getActivity(state) {
      return state.activity;
    },
    getLabels(state) {
      return state.activity.labels;
    },
   },
  mutations: {
    setActivity(state, value) {
      state.activity = value;
    },
    setActivityKey(state, { key, value }) {
      state.activity[key] = value;
    },
    setLabels(state, value) {
      state.activity.labels = value;
    },
    addLabel(state, value) {
      state.activity.labels.push(value);
    },
    removeLabel(state, id) {
      state.activity.labels = state.activity.labels.filter((item) => item !== id);
    },
  },
  actions: {
    async createActivity({ getters, rootGetters, commit }, payload) {
      const newActivity = getters.getActivity || payload;
      const { uid } = rootGetters['auth/getUser'];
      if (!uid) throw new Error('user not found');
      if (!newActivity.name) throw new Error('name not found');
      try {
        const activityRef = await firestore.collection('activity').add({ ...newActivity, userId: uid });
        const { id: activityId } = activityRef;
        await firestore.collection('activity').doc(activityId).update({ id: activityId });
        commit('setActivity', null);
        return activityId;
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
