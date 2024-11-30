import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'LoginView',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/cadastro',
      name: 'RegistrationUserView',
      component: () => import('../views/RegistrationUserView.vue'),
    },
    {
      path: '/sandbox',
      name: 'sandbox',
      component: () => import("@/components/InterestZone.vue")
    }
  ],
});

export default router;