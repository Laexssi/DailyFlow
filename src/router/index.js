import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from 'screens/Login';
import Plan from 'screens/Plan';

import { auth } from 'firebaseDir';
import store from 'store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/plan',
    name: 'plan',
    component: Plan,
    meta: { requiresAuth: true },
  },
  {
    path: '*',
    redirect: { name: 'plan' },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;
  const isInited = store.getters['auth/getIsInited'];
  console.log('isInited', isInited);

  console.log('isAuth in route', auth.currentUser);
  console.log('before route curr user', isAuthenticated);
  if (requiresAuth && !isAuthenticated && isInited) {
    console.log('redirect');
    next('/login');
    return;
  }

  next();
});
export default router;
