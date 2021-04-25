import { fetchPlans } from 'api';
// TOOO add pagination

export default {
  namespaced: true,
  state: {
    list: [],
  },
  getters: {
    getList(state) {
      return state.list;
    },
  },
  mutations: {
    setList(state, value) {
      state.list = value;
    },
  },
  actions: {
    async updateList({ commit, dispatch, rootState }) {
      const { uid } = rootState.auth.user;
      if (!uid) throw new Error('user not found');
      try {
        let list = await fetchPlans(uid);

        const updateExpiredPlans = async (planList) => {
          const now = new Date(Date.now()).getTime();
          const plansToUpdate = [];
          planList.forEach(({ cooldown_expiration_date, id }) => {
            if (!cooldown_expiration_date || cooldown_expiration_date > now) {
              return;
            }
            plansToUpdate.push(dispatch(
              'plan/completePlan',
               {
                id, saveToState: false,
               },
               { root: true },
            ));
          });
          return Promise.all(plansToUpdate);
        };

        const updatedPlans = await updateExpiredPlans(list);

        if (updatedPlans.length > 0) {
          list = await fetchPlans(uid);
        }

        commit('setList', list);
        return list;
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
};
