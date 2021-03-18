import { completeActivityRequest, cancelCompleteActivity, deleteActivityRequest } from 'api';

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
        return await completeActivityRequest(activity);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async cancelLastComplete({ getters }, payload) {
      const activity = getters.getActivity || payload;
      try {
        return await cancelCompleteActivity(activity);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async deleteActivity({ getters, dispatch }, payload) {
      const id = getters.getActivity?.id || payload.id;
      try {
        await deleteActivityRequest(id);
        await dispatch('activityList/updateList', null, { root: true });
        return id;
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
};
