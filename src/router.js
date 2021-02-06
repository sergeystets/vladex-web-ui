import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/components/Chat/Chat'
import AuthGuard from './auth-guard'
import SignIn from "@/components/Signin";
import SignInSuccess from "@/components/SigninSuccess";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Chat,
      beforeEnter: AuthGuard
    },
    {
      path: '/chat/:id',
      name: 'Chat',
      component: Chat,
      props: true,
      beforeEnter: AuthGuard
    },
    {
      path: "/sign-in",
      name: 'SignIn',
      component: SignIn,
    },
    {
      path: "/sign-in/success",
      name: 'SignInSuccess',
      component: SignInSuccess,
    }
  ]
});

export default router;