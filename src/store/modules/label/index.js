import { deleteLabelRequest } from 'api';

export default {
  namespaced: true,
  state: {
    label: null,
  },
  getters: {
    getLabel(state) {
      return state.label;
    },
  },
  mutations: {
    setLabel(state, value) {
      state.label = value;
    },
  },
  actions: {
    async deleteLabel({ getters }, payload) {
      const id = getters.getLabel?.id || payload.id;
      return deleteLabelRequest(id);
    },
  },
};
