import { firestore } from 'firebaseDir';

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
    async updateList({ commit }, payload) {
      console.log(payload);
      const data = await firestore.collection('users').get();
      commit.addToList(data);
    },
  },
};
