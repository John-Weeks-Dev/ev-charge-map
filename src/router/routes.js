import { useUserStore } from '../stores/user-store'
const routes = [
  {
    path: '/',
    beforeEnter: (to, from, next) => {
      to.fullPath === '/' ? next('/map') : next()
    },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'map', component: () => import('pages/MapPage.vue') },
      {
        path: '/route',
        component: () => import('pages/RoutePage.vue'),
        children: [
          { path: '', component: () => import('pages/route/RouteSelect.vue') },
          { path: 'saved-routes', component: () => import('pages/route/SavedRoutes.vue') },
          { path: 'add-route', component: () => import('pages/route/AddRoute.vue') }
        ]
      },
      {
        path: '/auth',
        beforeEnter: (to, from, next) => {
          const userStore = useUserStore()
          !userStore.email ? next() : next(from.fullPath)
        },
        component: () => import('pages/AuthPage.vue'),
        children: [
          { path: '', component: () => import('pages/auth/LoginSection.vue') },
          { path: 'register', component: () => import('pages/auth/RegisterSection.vue') }
        ]
      },
      {
        path: '/account',
        component: () => import('pages/AccountPage.vue'),
        children: [
          { path: '', component: () => import('pages/account/AccountMenu.vue') },
          { path: 'my-details', component: () => import('pages/account/MyDetails.vue') }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
