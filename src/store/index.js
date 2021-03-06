import Vue from 'vue';
import Vuex from 'vuex';

import appState from './modules/appState';

import auth from './modules/auth';
import user from './modules/user';
import userList from './modules/user/userList';

import activity from './modules/activity';
import activityEditor from './modules/activity/activityEditor';
import activityList from './modules/activity/activityList';

import label from './modules/label';
import labelEditor from './modules/label/labelEditor';
import labelList from './modules/label/labelList';

import plan from './modules/plan';
import planList from './modules/plan/planList';
import planEditor from './modules/plan/planEditor';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    appState,

    auth,
    user,
    userList,

    activity,
    activityEditor,
    activityList,

    label,
    labelEditor,
    labelList,

    plan,
    planEditor,
    planList,
  },
});

export default store;
