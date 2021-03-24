import { createPlanRequest, fetchPlanById, fetchActivitiesByIds } from 'api';
import cloneDeep from 'lodash/cloneDeep';

const planSchema = {
  cooldown: 0,
  cooldown_expiration_date: 0,
  complete: [],
  activities: [],
  name: null,
  id: null,
  userId: null,
};

export default {
  namespaced: true,
  state: {
    plan: cloneDeep(planSchema),
    activities: [],
  },
  getters: {
  },
  mutations: {
    setPlan(state, value) {
      state.plan = value;
    },
    setActivities(state, value) {
      state.activities = value;
    },
    setPlanKey(state, { key, value }) {
      state.plan[key] = value;
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
    async createPlan({ state, rootState, commit }, payload) {
      const newPlan = payload || state.plan;
      const { uid } = rootState.auth.user;
      if (!uid) throw new Error('user not found');
      if (!newPlan.name) throw new Error('name not found');
      try {
        const planId = await createPlanRequest(newPlan, uid);
        commit('setActivity', cloneDeep(planSchema));
        return planId;
      } catch (err) {
        return Promise.reject(err);
      }
    },
  },
};

