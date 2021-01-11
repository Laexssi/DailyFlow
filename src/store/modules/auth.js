import { auth, firebase } from 'firebaseDir';

export default {
  namespaced: true,
  state: {
    user: null,
    isLogged: false,
  },
  getters: {
    getUser(state) {
      return state.user;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = {
        displayName: user.displayName,
        email: user.email,
        uid: user.uid,
        avatarURL: user.photoURL,
        isNewUser: user.isNewUser,
      };
    },
    setIsLogged(state, value) {
      state.isLogged = value;
    },
  },
  actions: {
    login({ commit }) {
      return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(({ user, additionalUserInfo }) => {
          commit('setUser', { ...user, ...additionalUserInfo });
          commit('setIsLogged', true);
          return user;
          // use user vuex module to add users
          // if (additionalUserInfo.isNewUser) {
          //   db.collection('users').add({
          //     displayName: user.displayName,
          //     email: user.email,
          //     uid: user.uid,
          //     avatarURL: user.photoURL,
          //     isNewUser: additionalUserInfo.isNewUser,
          //   });
          // }
        })
        .catch(() => {
        commit('setIsLogged', false);
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
