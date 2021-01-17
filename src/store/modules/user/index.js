import { firestore } from 'firebaseDir';

export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    getUser(state) {
      return state.user;
    },
  },
  mutations: {
    setUser(state, value) {
      state.user = value;
    },
  },
  actions: {
    async createUser(context, payload) {
      console.log('payload', payload);
      const { uid: id, metadata: { creationTime, lastSignInTime } } = payload;
      firestore.collection('users').doc(id).set({
        displayName: payload.displayName,
        email: payload.email,
        uid: payload.uid,
        photoURL: payload.photoURL,
        lastSignInTime,
        creationTime,
      });
    },
  },
};
