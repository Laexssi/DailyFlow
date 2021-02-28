import { firestore } from 'firebaseDir';

export default {
  namespaced: true,
  state: {
    label: null,
  },
  getters: {
    getLabel(state) {
      return state.label;
    },
  },
  mutations: {
    setLabel(state, value) {
      state.label = value;
    },
  },
  actions: {
    async deleteLabel({ getters, rootActions }, payload) {
      const id = getters.id || payload.id;
      await firestore.collection('label').doc(id).delete();
      rootActions('labelList/updateList');
    },
  },
};
