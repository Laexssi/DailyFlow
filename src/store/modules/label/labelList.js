import { fetchLabels } from 'api';
// TOOO add pagination

export default {
  namespaced: true,
  state: {
    list: [],
  },
  getters: {
    getList(state) {
      return state.list;
    },
  },
  mutations: {
    setList(state, value) {
      state.list = value;
    },
  },
  actions: {
    async updateList({ commit, rootState }) {
      const { uid } = rootState.auth.user;
      if (!uid) throw new Error('user not found');
      try {
        const list = await fetchLabels(uid);
        commit('setList', list);
        return list;
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
};
