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
 addPlanActivityRequest,
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
    addDoneActivity(state, value) {
      state.plan.done_activities.push(value);
    },
    removeDoneActivity(state, value) {
      state.plan.done_activities = state.plan.done_activities.filter((activity) => activity !== value);
    },
    resetDoneActivity(state) {
      state.plan.done_activities = [];
    },
    setPlanState(state, isRunning) {
      state.plan.running = isRunning;
    },
    setPlanExpirationDate(state, date) {
      state.plan.cooldown_expiration_date = date;
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
    async updatePlanActivities({ state, commit }, payload = {}) {
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
      const { activityId } = payload;
      try {
        const completeActivityCount = await completePlanActivityRequest(plan, activityId);
        commit('addDoneActivity', activityId);
        return completeActivityCount;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async cancelCompletePlanActivity({ state, commit }, payload) {
      const plan = state.plan || payload.plan;
      const { activityId } = payload;
      try {
        const completeActivityCount = await cancelCompletePlanActivityRequest(plan, activityId);
        commit('removeDoneActivity', activityId);
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
      const id = payload.id || state.plan?.id;
      const { running, cooldown, saveToState = true } = payload;
      const expirationDate = (cooldown && running) ? new Date(new Date().setDate(new Date().getDate() + cooldown)).setHours(0, 0, 0) : 0;
      try {
        await updatePlanRunningRequest(id, running, expirationDate);
        if (saveToState) {
          commit('setPlanState', running);
          commit('setPlanExpirationDate', expirationDate);
        }
        return id;
      } catch (e) {
        return Promise.reject(e);
      }
    },
    async completePlan({ state, commit }, payload = {}) {
      const plan = payload.plan || state.plan;
      const { saveToState = true } = payload;
      try {
          const res = await completePlanRequest(plan);
          if (saveToState) {
            commit('setPlanState', false);
            commit('resetDoneActivity');
          }
          return res;
      } catch (e) {
        return Promise.reject();
      }
    },
    async addPlanActivity(context, payload) {
      const { activityId, planId } = payload;
      try {
        await addPlanActivityRequest(activityId, planId);
        return activityId;
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
};
