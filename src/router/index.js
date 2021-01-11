import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from 'screens/Login';
import Plan from 'screens/Plan';

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

export default router;
