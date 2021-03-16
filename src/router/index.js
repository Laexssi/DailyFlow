import Vue from 'vue';
import VueRouter from 'vue-router';

const Login = () => import(/* webpackChunkName: "login" */'screens/Login');
const Plan = () => import(/* webpackChunkName: "plan" */'screens/Plan');
const Library = () => import(/* webpackChunkName: "library" */'screens/Library');
const LibraryActivities = ()/* webpackChunkName: "library-activities" */ => import('screens/Library/LibraryActivities');
const LibraryList = ()/* webpackChunkName: "library-groups" */ => import('screens/Library/LibraryList');
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
    path: '/plan',
    name: 'plan',
    component: Plan,
    meta: { requiresAuth: true },
  },
  {
    path: '/library',
    component: Library,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'library',
        component: LibraryActivities,
        meta: { requiresAuth: true },
      },
      {
        path: '/library/list',
        name: 'library-list',
        component: LibraryList,
        meta: { requiresAuth: true },
      },
    ],
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
