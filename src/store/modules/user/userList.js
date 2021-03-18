import { fetchUsers } from 'api';

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
    addToList(state, value) {
      state.list = state.list.concat(value);
    },
    clearList(state) {
      state.list = [];
    },
  },
  actions: {
    async updateList({ commit }) {
      commit('addToList', await fetchUsers());
    },
  },
};
