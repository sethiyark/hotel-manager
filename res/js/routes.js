import loadable from '@loadable/component';

const routes = [
  {
    path: '/',
    component: loadable(() => import('./modules/Home'), {
      fallback: 'loading',
    }),
    exact: true,
  },
  {
    path: '/dashboard',
    component: loadable(() => import('./modules/Dashboard'), {
      fallback: 'loading',
    }),
    exact: true,
  },
];

export default routes;
