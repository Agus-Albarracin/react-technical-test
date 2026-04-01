import type { RouteObject } from 'react-router-dom'

import AuthGuard from '@/components/auth/auth-guard'
import PrivateLayout from '@/components/layouts/private-layout'
import DashboardPage from '@/pages/dashboard/dashboard-page'

const privateRoutes: RouteObject[] = [
  {
    // Antes la ruta privada renderizaba el layout directamente.
    // Ahora todo el arbol privado queda envuelto por AuthGuard.
    element: <AuthGuard />,
    children: [
      {
        path: '/dashboard',
        element: <PrivateLayout />,
        children: [{ index: true, element: <DashboardPage /> }],
      },
    ],
  },
]

export default privateRoutes
