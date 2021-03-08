import { firestore } from 'firebaseDir';

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
    async createLabel({ getters, rootGetters }, payload) {
      const newLabel = getters.getLabel || payload;
      const { uid } = rootGetters['auth/getUser'];
      if (!uid) throw new Error('user not found');
      if (!newLabel.name) throw new Error('name not found');
      try {
        const labelRef = firestore.collection('label');
        const { id } = await labelRef.add({ ...newLabel, userId: uid });
        await firestore.collection('label').doc(id).update({ id });
        return id;
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
        await firestore.collection('label').doc(editedLabel.id).set(editedLabel);
        return editedLabel;
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
