import { z } from 'zod';

export const ServiceSchema = z.object({
  name: z.string().nonempty('Название услуги обязательно'),
  description: z.string().optional()
});