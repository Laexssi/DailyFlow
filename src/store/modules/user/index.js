import { createUserRequest } from 'api';

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
     try {
      return await createUserRequest(payload);
     } catch (e) {
      return Promise.reject(e);
     }
    },
  },
};
