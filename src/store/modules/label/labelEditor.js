import { createLabelRequest, editLabelRequest } from 'api';

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
    setLabelKey(state, { key, value }) {
      state.label[key] = value;
    },
  },
  actions: {
    async createLabel({ getters, commit, rootState }, payload) {
      const newLabel = getters.getLabel || payload;
      const { uid } = rootState.auth.user;
      if (!uid) throw new Error('user not found');
      if (!newLabel.name) throw new Error('name not found');
      try {
        const labelId = await createLabelRequest(newLabel, uid);
        commit('setLabel', null);
        return labelId;
      } catch (err) {
        return Promise.reject(err);
      }
    },
    async editLabel({ getters, rootGetters }, payload) {
      const editedLabel = getters.getLabel || payload;
      const { uid } = rootGetters['auth/getUser'];
      if (!uid) throw new Error('user not found');
      if (!editedLabel.name) throw new Error('name not found');
      try {
        return await editLabelRequest(editedLabel);
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
