import { Navigate, Outlet } from 'react-router-dom'

import { useGetMe } from '@/services/auth.service'
import useAuthStore from '@/store/auth.store'

// PublicOnlyGuard protege rutas publicas.
// Si el usuario ya esta autenticado, lo redirige al dashboard.
const PublicOnlyGuard = () => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  const meQuery = useGetMe()

  // Igual que en AuthGuard, esperamos a que el store restaure la sesión.
  if (!hasHydrated) {
    return <div>Recuperando datos...</div>
  }

  // Si no hay token, el usuario sigue siendo visitante y puede ver login.
  if (!accessToken) {
    return <Outlet />
  }

  // Mientras validamos, informamos a la ui.
  if (meQuery.isLoading) {
    return <div>Estamos validando los datos de sesión...</div>
  }

  // Si el token es valido redirigimos.
  if (meQuery.isSuccess) {
    return <Navigate to="/dashboard" replace />
  }

  // Si la validación falla, dejamos pasar para que el usuario vuelva a autenticarse.
  return <Outlet />
}

export default PublicOnlyGuard
