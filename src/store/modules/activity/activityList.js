import { firestore } from 'firebaseDir';
// TOOO add pagination

export default {
  namespaced: true,
  state: {
    list: [],
  },
  getters: {
    getList(state, getters, rootState, rootGetters) {
      return state.list.map((item) => {
        const mappedLabels = item.labels.map((labelId) => {
          return rootGetters['labelList/getList'].find(({ id }) => id === labelId);
        });
        return { ...item, labels: mappedLabels };
      });
    },
  },
  mutations: {
    setList(state, value) {
      state.list = value;
    },
    setListItem(state, { activityData, id }) {
      const index = state.list.findIndex((item) => item.id === id);
      state.list.splice(index, 1, activityData);
    },
  },
  actions: {
    async updateList({ commit, rootGetters }) {
      const list = [];
      const { uid } = rootGetters['auth/getUser'];
      if (!uid) throw new Error('user not found');
      try {
        const res = await firestore.collection('activity').where('userId', '==', `${uid}`).get();
        res.forEach((doc) => list.push(doc.data()));
        commit('setList', list);
        return list;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async updateActivityById({ commit }, payload) {
        const { id } = payload;
        try {
          const activityRef = await firestore.collection('activity').doc(`${id}`).get();
          const activityData = await activityRef.data();
          commit('setListItem', { id, activityData });
          return activityData;
        } catch (e) {
          return Promise.reject(e);
        }
    },
  },
};
