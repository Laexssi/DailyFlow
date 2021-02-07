import Vue from 'vue';
import Vuex from 'vuex';

import appState from './modules/appState';

import auth from './modules/auth';
import user from './modules/user';
import userList from './modules/user/userList';

import activity from './modules/activity';
import activityEditor from './modules/activity/activityEditor';
import activityList from './modules/activity/activityList';

Vue.use(Vuex);

export default new Vuex.Store({
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
  },
});
