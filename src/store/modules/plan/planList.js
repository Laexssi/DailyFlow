import { firestore } from 'firebaseDir';
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
      const list = [];
      const { uid } = rootState.auth.user;
      if (!uid) throw new Error('user not found');
      try {
        const querySnapshot = await firestore.collection('plan').where('userId', '==', `${uid}`).get();
        querySnapshot.forEach((doc) => list.push(doc.data()));
        commit('setList', list);
        return list;
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
};
