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
    async deleteLabel({ getters, dispatch }, payload) {
      console.log(payload);
      const id = getters.getLabel?.id || payload.id;
      await firestore.collection('label').doc(id).delete();
      await dispatch('labelList/updateList', null, { root: true });
      return id;
    },
  },
};
