export default {
  namespaced: true,
  state: {
    showRouterBackButton: false,
  },
  getters: {
    getShowRouterBackButton(state) {
      return state.showRouterBackButton;
    },
  },
  mutations: {
    setShowRouterBackButton(state, value) {
      state.showRouterBackButton = value;
    },
  },
};
