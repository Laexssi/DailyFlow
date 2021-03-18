import { firestore } from 'firebaseDir';

export default {
  namespaced: true,
  state: {
    plan: null,
  },
  getters: {
    getPlan(state) {
      return state.plan;
    },
  },
  mutations: {
    setPlan(state, value) {
      state.plan = value;
    },
  },
  actions: {
    async deletePlan({ getters, dispatch }, payload) {
      const id = getters.getPlan?.id || payload.id;
      await firestore.collection('plan').doc(id).delete();
      await dispatch('plan/updateList', null, { root: true });
      return id;
    },
  },
};
