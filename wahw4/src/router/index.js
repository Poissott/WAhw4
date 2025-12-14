import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ContactsView from '../views/ContactsView.vue'
const auth = require('../server/auth.js');
import LoginView from '../components/Login.vue'
import SignUpView from '../components/SignUp.vue'
import AddPost from '../views/AddPost.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    beforeEnter: async (to, from, next) => {
      let authResult = await auth.authenticated();
      if (!authResult) {
        next('/login')
      } else {
        next();
      }
    }
  },
  {
    path: '/contacts',
    name: 'contacts',
    component: ContactsView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUpView
  },
   {
    path: '/add-post',
    name: 'add-post',
    component: AddPost,
    beforeEnter: async (to, from, next) => {
      let auth = await (await import('../server/auth.js')).default;
      let authResult = await auth.authenticated();
      if (!authResult) next('/login');
      else next();
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
