import { createActivityRequest, editActivityRequest } from 'api';

const activitySchema = {
  complete_count: 0,
  cooldown: 0,
  cooldown_expiration_date: 0,
  emoji: null,
  labels: [],
  complete_dates: [],
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
    resetActivity(state) {
      state.activity = { ...activitySchema };
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
    async createActivity({ getters, rootState, commit }, payload = null) {
      const newActivity = payload || getters.getActivity;
      const { uid } = rootState.auth.user;
      if (!uid) throw new Error('user not found');
      if (!newActivity.name) throw new Error('name not found');
      try {
        const activityId = await createActivityRequest(newActivity, uid);
        commit('resetActivity');
        return activityId;
      } catch (err) {
        return Promise.reject(err);
      }
    },
    async editActivity({ getters, commit }, payload) {
      const activity = getters.getActivity || payload;
      try {
        const activityId = await editActivityRequest(activity);
        commit('resetActivity');
        return activityId;
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
