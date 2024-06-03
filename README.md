# Simple_Cloud_Monitor
The project aims to provide a new version of a microservices development scaffolding, built upon a series of components including Spring Boot 3, Spring Cloud, and Spring Cloud Alibaba, to establish a reusable cloud-based monitoring platform.

# Quick Start
This ﻿platform is based on vue3 + typescript + vuestic-ui</br>
After cloning the repository code to the local compiler
```shell
# Install all dependency first
npm run install

# run project  if success http://127.0.0.1:5173/ will show
npm run dev
```

# How to modify ?
## Dynamic interaction method
Firstly, define **API methods** that correspond one-to-one with the interfaces provided by the backend (encapsulated through axios).</br>
Then you can use those function by import just like provided codes , click for detail definition of [UserApi](https://github.com/Charlesbibi/Simple_Cloud_Monitor/blob/main/src/api/system/sysUser/index.ts)
```typescript
import UserApi from '@/api/system/sysUser'
```

## Router push
For newly added routes, you need to define the route node before you can use that route. </br>

Here are two typical examples, and specific definitions can be found in the `router` folder. Note that it is necessary to define the pages referenced in the component in advance!!
```typescript
{
  name: 'monitor',
  path: '/monitor',
  children: [
    {
      name: 'nacos',
      path: 'nacos',
      component: () => import('../pages/monitor/nacos/index.vue'),
    },
    {
      name: 'seata',
      path: 'seata',
      component: () => import('../pages/monitor/seata/index.vue'),
    },
  ],
},
```
After defined it, you can add in sidebar, [click](https://github.com/Charlesbibi/Simple_Cloud_Monitor/blob/main/src/components/sidebar/NavigationRoutes.ts) for detail information.

## Axios configuration
For developers who want to change the Axios configuration, you can focus on [this](https://github.com/Charlesbibi/Simple_Cloud_Monitor/blob/main/src/utils/request.ts), which includes but is not limited to Axios request and response interceptors
