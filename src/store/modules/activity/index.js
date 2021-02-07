// import { firestore } from 'firebaseDir';

export default {
  namespaced: true,
  state: {
    activity: null,
  },
  getters: {
    getActivity(state) {
      return state.activity;
    },
  },
  mutations: {
    setActivity(state, value) {
      state.activity = value;
    },
  },
  actions: {
  },
};
