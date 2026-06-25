import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../utils/auth';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, _from, next) => {
  const auth = useAuth();
  
  // If user is opening page, restore their session once before guarding
  if (auth.isAuthenticated.value && !auth.user.value && !auth.isLoading.value) {
    await auth.initSession();
  }

  const isAuth = auth.isAuthenticated.value;

  if (to.meta.requiresAuth && !isAuth) {
    next({ name: 'Login' });
  } else if (to.meta.guestOnly && isAuth) {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
