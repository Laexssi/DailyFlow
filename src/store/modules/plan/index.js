import { fetchPlanById, fetchActivitiesByIds, deletePlanRequest } from 'api';

export default {
  namespaced: true,
  state: {
    plan: null,
    activities: [],
  },
  getters: {
    getPlanCompleteCount(state) {
      return state.plan;
    },
  },
  mutations: {
    setPlan(state, value) {
      state.plan = value;
    },
    setActivities(state, value) {
      state.activities = value;
    },
  },
  actions: {
    async updatePlan({ commit }, payload) {
      const { id } = payload;
      try {
        const plan = await fetchPlanById(id);
        commit('setPlan', plan);
        return id;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async deletePlan({ state }, payload) {
      const id = state.plan?.id || payload.id;
      try {
        await deletePlanRequest(id);
        return id;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async updatePlanActivities({ state, commit }, payload) {
      const activities = state.plan?.activities || payload.activities;
      try {
        const list = await fetchActivitiesByIds(activities);
        commit('setActivities', list);
        return list;
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
};
