import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().nonempty('Поле пароля обязательно для заполнения')
})