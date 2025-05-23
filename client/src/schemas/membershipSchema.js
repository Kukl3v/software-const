import { z } from 'zod';

export const MembershipSchema = z.object({
  name: z.string().nonempty('Название обязательно'),
  description: z.string().nonempty('Описание обязательно'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Неверный формат цены'),
  durationDays: z.string().regex(/^\d+$/, 'Должно быть целым числом'),
});

export const UserMembershipSchema = z.object({
  userId: z.string().uuid(),
  membershipId: z.string().uuid(),
  startDate: z.string(),
});