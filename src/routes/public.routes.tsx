import type { RouteObject } from 'react-router-dom'

import PublicOnlyGuard from '@/components/auth/public-guard'
import AuthLayout from '@/components/layouts/auth-layout'
import LoginPage from '@/pages/auth/login-page'
import NotFoundPage from '@/pages/not-found-page'

const publicRoutes: RouteObject[] = [
  {
    // Antes /auth se exponia siempre.
    // Ahora el arbol público queda envuelto por PublicOnlyGuard para evitar que un usuario autenticado vuelva al login.
    element: <PublicOnlyGuard />,
    children: [
      {
        path: '/auth',
        element: <AuthLayout />,
        children: [
          { index: true, element: <LoginPage /> },
          { path: 'reset-password', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]

export default publicRoutes
