import { fetchActivities, fetchActivityById } from 'api';
// TOOO add pagination

export default {
  namespaced: true,
  state: {
    list: [],
  },
  getters: {
    getList(state, getters, rootState, rootGetters) {
      return state.list.map((item) => {
        const mappedLabels = item.labels.map((labelId) => {
          return rootGetters['labelList/getList'].find(({ id }) => id === labelId);
        });
        return { ...item, labels: mappedLabels };
      });
    },
  },
  mutations: {
    setList(state, value) {
      state.list = value;
    },
    setListItem(state, { activityData, id }) {
      const index = state.list.findIndex((item) => item.id === id);
      state.list.splice(index, 1, activityData);
    },
  },
  actions: {
    async updateList({ commit, rootState }) {
      const { uid } = rootState.auth.user;
      if (!uid) throw new Error('user not found');
      try {
        const list = await fetchActivities(uid);
        commit('setList', list);
        return list;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async updateActivityById({ commit }, payload) {
        const { id } = payload;
        try {
          const activityData = await fetchActivityById(id);
          commit('setListItem', { id, activityData });
          return activityData;
        } catch (e) {
          return Promise.reject(e);
        }
    },
  },
};
