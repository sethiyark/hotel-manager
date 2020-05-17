import * as React from 'react';
import loadable from '@loadable/component';
import { Loader } from 'semantic-ui-react';

const Loading = () => <Loader active />;

const routes = [
  {
    path: '/',
    component: loadable(() => import('./modules/Home'), {
      fallback: <Loading />,
    }),
    exact: true,
  },
  {
    path: '/dashboard',
    component: loadable(() => import('./modules/Dashboard'), {
      fallback: <Loading />,
    }),
    exact: true,
  },
  {
    path: '/checkin',
    component: loadable(() => import('./modules/CheckIn'), {
      fallback: <Loading />,
    }),
    exact: true,
  },
];

export default routes;
