import type { RouteObject } from 'react-router-dom'

import PrivateLayout from '@/components/layouts/private-layout'
import DashboardPage from '@/pages/dashboard/dashboard-page'

const privateRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <PrivateLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },
]

export default privateRoutes
