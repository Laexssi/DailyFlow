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
        const labelRef = await firestore.collection('label').add({ ...newLabel, userId: uid });
        const { id: labelId } = labelRef;
        this.firestore.collection('label').doc(labelId).update({ id: labelId });
        return labelId;
      } catch (err) {
        return err;
      }
    },
  },
};
