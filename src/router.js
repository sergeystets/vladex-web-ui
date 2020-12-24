import Vue from 'vue'
import Router from 'vue-router'
import Chat from '@/components/Chat/Chat'
import Home from '@/components/Home'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {path: '/', component: Home},
    {
      path: '/chat/:id',
      name: 'Chat',
      component: Chat,
      props: true
    }
  ]
});

export default router;