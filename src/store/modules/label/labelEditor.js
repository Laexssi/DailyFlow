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
        const { id } = labelRef;
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
        console.log(editedLabel);
        await firestore.collection('label').doc(editedLabel.id).set(editedLabel);
        return editedLabel;
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};
