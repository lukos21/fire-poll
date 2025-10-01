import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import CreatePoll from '@/components/CreatePoll.vue'
import PollView from '@/components/PollView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/create', component: CreatePoll },
    { path: '/poll/:id', component: PollView, props: true },
    { path: '/about', component: () => import('@/pages/About.vue') }
  ],
  scrollBehavior() { return { top: 0 } }
})