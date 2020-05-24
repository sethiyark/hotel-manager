import * as React from 'react';
import loadable from '@loadable/component';
import { Loader } from 'semantic-ui-react';

import Login from './modules/Login';
import Registration from './modules/Registration';

const fallbackOption = { fallback: <Loader active /> };

const getRouteConfig = ({ setClient }) => {
  return [
    {
      path: '/',
      component: loadable(() => import('./modules/Home'), fallbackOption),
      exact: true,
    },
    {
      path: '/dashboard',
      component: loadable(() => import('./modules/Dashboard'), fallbackOption),
      exact: true,
    },
    {
      path: '/checkin/:id',
      component: loadable(() => import('./modules/CheckIn'), fallbackOption),
      exact: true,
    },
    {
      path: '/login',
      render: () => <Login setClient={setClient} />,
      exact: true,
    },
    {
      path: '/registration',
      render: () => <Registration />,
      exact: true,
    },
  ];
};

export default getRouteConfig;
