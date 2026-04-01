import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useGetMe } from '@/services/auth.service'
import useAuthStore from '@/store/auth.store'

// AuthGuard protege rutas privadas.
// Su responsabilidad es impedir el acceso si no hay una sesión valida.
// Tambien guarda la ruta de origen para poder redirigir al usuario al destino correcto despues del login.
const AuthGuard = () => {
  const location = useLocation()
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  const meQuery = useGetMe()

  // Esperamos a que Zustand termine de hidratar la sesión persistida
  // antes de decidir si dejamos pasar o redirigimos.
  if (!hasHydrated) {
    return <div>Recuperando datos...</div>
  }

  // Si no hay token en el store, la ruta privada debe redirigir al login.
  if (!accessToken) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  // Si existe token pero todavia estamos validando la sesión.
  // evitamos renderizar contenido privado.
  if (meQuery.isLoading) {
    return <div>Estamos validando los datos de sesión...</div>
  }

  // Si la validacion contra la API falla, la sesión es invalidada.
  // El logout ya se centraliza fuera del render; el guard solo redirige.
  if (meQuery.isError) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default AuthGuard
