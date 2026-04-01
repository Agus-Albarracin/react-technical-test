import type { RouteObject } from 'react-router-dom'

import AuthLayout from '@/components/layouts/auth-layout'
import LoginPage from '@/pages/auth/login-page'
import NotFoundPage from '@/pages/not-found-page'

const publicRoutes: RouteObject[] = [
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'reset-password', element: <NotFoundPage /> },
    ],
  },
]

export default publicRoutes
