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
    async updateList({ commit, rootGetters }) {
      const list = [];
      const { uid } = rootGetters['auth/getUser'];
      if (!uid) throw new Error('user not found');
      try {
        const querySnapshot = await firestore.collection('label').where('userId', '==', `${uid}`).get();
        querySnapshot.forEach((doc) => list.push(doc.data()));
        commit('setList', list);
      } catch (e) {
        console.log('error', e);
      }
    },
  },
};
