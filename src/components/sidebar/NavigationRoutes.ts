export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'menu.dashboard',
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'system',
      displayName: 'system',
      meta: {
        icon: 'folder_shared',
      },
      children: [
        {
          name: 'User',
          displayName: 'User',
        },
      ],
    },
    {
      name: 'monitor',
      displayName: 'monitor',
      meta: {
        icon: 'folder_shared',
      },
      children: [
        {
          name: 'nacos',
          displayName: 'nacos',
        },
        {
          name: 'seata',
          displayName: 'seata',
        },
        {
          name: 'sentinel',
          displayName: 'sentinel',
        },
        {
          name: 'zipkin',
          displayName: 'zipkin',
        },
      ],
    },
    {
      name: 'business',
      displayName: 'business',
      meta: {
        icon: 'folder_shared',
      },
      children: [
        {
          name: 'orders',
          displayName: 'orders',
        },
      ],
    },
  ] as INavigationRoute[],
}
