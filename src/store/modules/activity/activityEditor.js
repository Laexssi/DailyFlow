import { firestore } from 'firebaseDir';

const activitySchema = {
  complete_count: 0,
  cooldown: 0,
  cooldown_expiration_date: 0,
  emoji: null,
  label: null,
  label_color: null,
  last_complete_day: null,
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
  },
  mutations: {
    setActivity(state, value) {
      state.activity = value;
    },
    setActivityKey(state, { key, value }) {
      state.activity[key] = value;
    },
  },
  actions: {
    async createActivity(context, payload) {
      console.log('payload', payload);
      try {
        const activityRef = await firestore.collection('activity').add(payload);
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
