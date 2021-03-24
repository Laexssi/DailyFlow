import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import(/* webpackChunkName: "login" */'screens/Login');
const PlanList = () => import(/* webpackChunkName: "plans" */'screens/PlanList');
const Plan = () => import(/* webpackChunkName: "plan" */'screens/Plan');
const PlanEditor = () => import(/* webpackChunkName: "plan-editor" */'screens/PlanEditor');
const Library = () => import(/* webpackChunkName: "library" */'screens/Library');
const Analytics = ()/* webpackChunkName: "analytics" */ => import('screens/Analytics');
const ActivityEditor = ()/* webpackChunkName: "activity" */ => import('screens/ActivityEditor');

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
    path: '/plan/list',
    name: 'plans',
    component: PlanList,
    meta: { requiresAuth: true },
  },
  {
    path: '/plan/:id',
    name: 'plan',
    component: Plan,
    meta: { requiresAuth: true },
  },
  {
    path: '/plan/new',
    name: 'plan-editor-new',
    component: PlanEditor,
    meta: { requiresAuth: true },
  },
  {
    path: '/plan/edit/:id',
    name: 'plan-editor-edit',
    component: PlanEditor,
    meta: { requiresAuth: true },
  },
  {
    path: '/library',
    name: 'library',
    component: Library,
    meta: { requiresAuth: true },
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: Analytics,
    meta: { requiresAuth: true },
  },
  {
    path: '/activity/new',
    name: 'activity-editor-new',
    component: ActivityEditor,
    meta: { requiresAuth: true },
  },
  {
    path: '/activity/edit/:id',
    name: 'activity-editor-edit',
    component: ActivityEditor,
    meta: { requiresAuth: true },
  },
  {
    path: '*',
    redirect: { name: 'plans' },
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
  if (requiresAuth && !isAuthenticated && isInited) {
    next('/login');
    return;
  }

  next();
});
export default router;
