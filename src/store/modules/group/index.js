import { firestore } from 'firebaseDir';

export default {
  namespaced: true,
  state: {
    group: null,
  },
  getters: {
    getGroup(state) {
      return state.group;
    },
  },
  mutations: {
    setGroup(state, value) {
      state.group = value;
    },
  },
  actions: {
    async deleteGroup({ getters, dispatch }, payload) {
      const id = getters.getGroup?.id || payload.id;
      await firestore.collection('group').doc(id).delete();
      await dispatch('group/updateList', null, { root: true });
      return id;
    },
  },
};
