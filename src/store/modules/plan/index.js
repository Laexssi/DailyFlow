import {
 fetchPlanById,
 fetchActivitiesByIds,
 fetchActivityById,
 deletePlanRequest,
 resetPlanActivitiesCounterRequest,
 completePlanActivityRequest,
 cancelCompletePlanActivityRequest,
 updatePlanRunningRequest,
 completePlanRequest,
} from 'api';

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
    setActivityById(state, { activityData, id }) {
      const index = state.activities.findIndex((item) => item.id === id);
      state.activities.splice(index, 1, activityData);
    },
    incrementDoneActivity(state) {
      state.plan.done_activities++;
    },
    decrementDoneActivity(state) {
      state.plan.done_activities--;
    },
    resetDoneActivity(state) {
      state.plan.done_activities = 0;
    },
    setPlanState(state, isRunning) {
      state.plan.running = isRunning;
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
    async updateActivityById({ commit }, payload) {
      const { id } = payload;
      try {
        const activityData = await fetchActivityById(id);
        commit('setActivityById', { id, activityData });
        return activityData;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async completePlanActivity({ state, commit }, payload) {
      const plan = state.plan || payload.plan;
      try {
        const completeActivityCount = await completePlanActivityRequest(plan);
        commit('incrementDoneActivity');
        return completeActivityCount;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async cancelCompletePlanActivity({ state, commit }, payload) {
      const plan = state.plan || payload.plan;
      try {
        const completeActivityCount = await cancelCompletePlanActivityRequest(plan);
        commit('decrementDoneActivity');
        return completeActivityCount;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async resetPlanActivitiesCounter({ state, commit }, payload) {
      const plan = state.plan || payload.plan;
      try {
       const completeActivityCount = await resetPlanActivitiesCounterRequest(plan);
       commit('resetDoneActivity');
       return completeActivityCount;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async updatePlanRunning({ state, commit }, payload) {
      const id = state.plan?.id || payload.id;
      const { running } = payload;
      try {
        const isRunning = await updatePlanRunningRequest(id, running);
        commit('setPlanState', isRunning);
        return isRunning;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async completePlan({ state, commit }, payload) {
      const plan = state.plan || payload.plan;
      try {
          const res = await completePlanRequest(plan);
          commit('setPlanState', false);
          commit('resetDoneActivity');
          return res;
      } catch (e) {
        return Promise.reject();
      }
    },
  },
};
