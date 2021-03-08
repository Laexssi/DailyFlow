import { auth, firebase } from 'firebaseDir';

export default {
  namespaced: true,
  state: {
    user: null,
    isLogged: false,
    isInited: false,
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getIsLogged(state) {
      return state.isLogged;
    },
    getIsInited(state) {
      return state.isInited;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        photoURL: user.photoURL,
        isNewUser: user.isNewUser,
      };
    },
    setIsLogged(state, value) {
      state.isLogged = value;
    },
    setIsInited(state, value) {
      state.isInited = value;
    },
  },
  actions: {
    login({ commit, dispatch }) {
      return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(({ user, additionalUserInfo }) => {
          const userWithAdditionalInfo = { ...user, ...additionalUserInfo };
          console.log('add', additionalUserInfo);
          console.log('vuex user', user);
          commit('setUser', userWithAdditionalInfo);
          commit('setIsLogged', true);
          return userWithAdditionalInfo;
        })
        .then(async (user) => {
          if (user.isNewUser) {
            await dispatch('user/createUser', user, { root: true });
          }
          return user;
        })
        .catch((e) => {
          commit('setIsLogged', false);
          console.warn(e);
        });
    },
    logout({ commit }) {
      return auth.signOut()
        .then(() => {
          commit('setIsLogged', false);
        });
    },
  },
};
