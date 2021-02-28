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
  uid: null,
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
    removeLabel(state, index) {
      state.activity.labels = state.activity.labels.filter((item, idx) => idx !== index);
    },
  },
  actions: {
    async createActivity({ getters, rootGetters }, payload) {
      const newActivity = getters.getActivity || payload;
      const { uid } = rootGetters['auth/getUser'];
      if (!uid) throw new Error('user not found');
      if (!newActivity.name) throw new Error('name not found');
      console.log(newActivity);
      try {
        const activityRef = await firestore.collection('activity').add({ ...newActivity, userId: uid });
        const { id: activityId } = activityRef;
        console.log('activityId', activityId);
        this.firestore.collection('activity').doc(activityId).update({ id: activityId });
        return activityId;
      } catch (err) {
        return err;
      }
    },
  },
};
