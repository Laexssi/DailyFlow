export default {
  namespaced: true,
  state: {
    showRouterBackButton: false,
    showSearchButton: false,
    searchQuery: '',
  },
  mutations: {
    setShowRouterBackButton(state, value) {
      state.showRouterBackButton = value;
    },
    setShowSearchButton(state, value) {
      state.showSearchButton = value;
    },
    setSearchQuery(state, value) {
      state.searchQuery = value;
    },
  },
};
