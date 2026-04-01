import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { HiOutlineUser } from 'react-icons/hi'
import { useLocation, useNavigate } from 'react-router-dom'
import z from 'zod/v3'

import Form from '@/components/shared/form'
import FormInput from '@/components/shared/form-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useLogin } from '@/services/auth.service'

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es obligatorio'),
  password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const AuthForm = () => {
  // Antes el login siempre redirigia de forma fija a /dashboard.
  const location = useLocation()
  const navigate = useNavigate()
  const loginMutation = useLogin()
  // Ahora respetamos la ruta de origen guardada por AuthGuard.
  const redirectTo = location.state?.from?.pathname ?? '/dashboard'

  const handleLogin = (data: LoginFormValues) => {
    loginMutation.mutate(
      { username: data.username, password: data.password },
      {
        onSuccess: () => {
          toast.success('Sesión iniciada correctamente')
          // Antes: navigate('/dashboard')
          // Ahora: si el usuario venia de una privada, vuelve a ese destino.
          void navigate(redirectTo, { replace: true })
        },
        onError: (error) => {
          toast.error(error.message)
        },
      },
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <HiOutlineUser className="text-primary h-6 w-6" />
        </div>
        <CardTitle>Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tus credenciales para acceder</CardDescription>
      </CardHeader>
      <Form<LoginFormValues>
        onSubmit={handleLogin}
        useFormProps={{ resolver: zodResolver(loginSchema) }}
      >
        <CardContent className="space-y-4">
          <FormInput<LoginFormValues> name="username" label="Usuario" placeholder="emilys" />
          <FormInput<LoginFormValues>
            name="password"
            label="Contraseña"
            type="password"
            placeholder="••••••••"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
            Iniciar Sesión
          </Button>
          <Button
            type="button"
            variant="link"
            className="text-sm"
            onClick={() => void navigate('/auth/reset-password')}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </CardFooter>
      </Form>
    </Card>
  )
}

export default AuthForm
