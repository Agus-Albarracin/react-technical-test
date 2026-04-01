import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import apiClient from '@/lib/api-client'
import useAuthStore from '@/store/auth.store'
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from '@/types/auth.type'

const MOCK_DELAY = 1500

const mockDelay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY))

const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

const useGetMe = (): UseQueryResult<AuthUser> => {
  const accessToken = useAuthStore((state) => state.accessToken)
  const setUser = useAuthStore((state) => state.setUser)

  const query = useQuery<AuthUser, Error>({
    queryKey: authKeys.me(),
    queryFn: async (): Promise<AuthUser> => {
      const response = await apiClient.get<AuthUser>('/auth/me')
      return response.data
    },
    // Antes la query dependia de localStorage directamente.
    // enabled: !!localStorage.getItem('access_token'),
    // Ahora la sesion se consulta desde el STORE de Zustand.
    enabled: !!accessToken,
    retry: false,
  })

  useEffect(() => {
    // Guardamos el usuario autenticado en el STORE.
    // Antes intentabamos hacerlo con onSuccess dentro de useQuery.
    // onSuccess: (user) => {
    //   setUser(user)
    // }
    // Ahora usamos un efecto.
    if (query.data) {
      setUser(query.data)
    }
  }, [query.data, setUser])

  return query
}

const useLogin = (): UseMutationResult<LoginResponse, Error, LoginRequest> => {
  const setSession = useAuthStore((state) => state.setSession)

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<LoginResponse> => {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        username: data.username,
        password: data.password,
      })
      return response.data
    },
    onSuccess: (data) => {
      // Antes persistiamos el token manualmente.
      // localStorage.setItem('access_token', data.accessToken)
      // Ahora delegamos la persistencia y el estado de auth al store.
      setSession(data)
    },
  })
}

const useResetPassword = (): UseMutationResult<
  ResetPasswordResponse,
  Error,
  ResetPasswordRequest
> => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
      return mockDelay({
        message: `Se ha enviado un enlace de recuperación a ${data.email}`,
      })
    },
  })
}

export { authKeys, useGetMe, useLogin, useResetPassword }
