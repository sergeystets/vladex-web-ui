import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/components/Chat/Chat'
import VideoChat from '@/components/Chat/VideoChat'
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
      path: '/chat/:id/video',
      name: 'VideoCall',
      component: VideoChat,
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