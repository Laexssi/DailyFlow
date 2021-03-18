export default {
  namespaced: true,
  state: {
    showRouterBackButton: false,
  },
  mutations: {
    setShowRouterBackButton(state, value) {
      state.showRouterBackButton = value;
    },
  },
};
