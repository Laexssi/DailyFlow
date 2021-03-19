import cloneDeep from 'lodash/cloneDeeo';

const planSchema = {
  cooldown: 0,
  cooldown_expiration_date: 0,
  complete: [],
  name: null,
  id: null,
  userId: null,
};

export default {
  namespaced: true,
  state: {
    activity: cloneDeep(planSchema),
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
};

