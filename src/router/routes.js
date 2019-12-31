const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Users.vue') },
      { path: '/chat/:otherUserId', component: () => import('pages/Chat.vue') },
      { path: '/auth', component: () => import('pages/Auth.vue') },
      { path: '/info', component: () => import('pages/Info.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
