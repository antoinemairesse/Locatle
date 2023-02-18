import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/game',
      children: [
        {
          name: 'dailyGame',
          path: 'daily',
          component: () => import('@/views/Game.vue'),
        },
        {
          name: 'practiceGame',
          path: 'practice',
          component: () => import('@/views/Game.vue'),
        },
      ],
    },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/Home.vue') }
  ]
})

router.beforeEach((to) => {
  if(!to.name){
    return { name: 'Home' }
  }
})

export default router
