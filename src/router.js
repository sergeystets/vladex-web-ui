import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/components/Chat/Chat'
import Signin from "@/components/User/Signin";
import Signin2 from "@/components/User/Signin2";
import AuthGuard from './auth-guard'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/chat/0'
    },
    {
      path: '/login',
      name: 'Signin',
      component: Signin,
      beforeEnter: AuthGuard
    },
    {
      path: '/login/otp',
      name: 'Signin2',
      component: Signin2,
      beforeEnter: AuthGuard
    },
    {
      path: '/chat/:id',
      name: 'Chat',
      component: Chat,
      props: true,
      beforeEnter: AuthGuard
    }
  ]
});

export default router;