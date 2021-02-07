// import { firestore } from 'firebaseDir';
// TOOO add pagination

export default {
  namespaced: true,
  state: {
    list: null,
  },
  getters: {
    getList(state) {
      return state.list;
    },
    getLabels() {
      return [{
        name: 'Sports',
        color: 'red',
      },
      {
        name: 'Cook Kebab',
        color: 'green',
      },
      {
        name: 'Day sleep',
        color: 'blue',
      },
      {
        name: 'Yoga',
        color: 'brown',
      }];
    },
  },
  mutations: {
    setList(state, value) {
      state.list = value;
    },
  },
  actions: {
  },
};
