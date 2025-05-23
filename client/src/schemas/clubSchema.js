import { z } from 'zod'

export const ClubSchema = z.object({
  address: z.string().nonempty('Поле адреса обязательно для заполнения'),
  city: z.string().nonempty('Поле города обязательно для заполнения')
})