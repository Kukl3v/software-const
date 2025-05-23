import { z } from 'zod';

export const AccountUpdateSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно').regex(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, 'Имя может содержать только буквы'),
  lastName: z.string().min(1, 'Фамилия обязательна').regex(/^[a-zA-Zа-яА-ЯёЁ\s]+$/, 'Фамилия может содержать только буквы'),
  email: z.string().email('Формат почты должен быть верным'),
});

export const PasswordUpdateSchema = z.object({
  passwordCurrent: z.string().min(1, 'Введите текущий пароль'),
  password: z.string()
    .min(8, 'Минимум 8 символов')
    .max(20, 'Максимум 20 символов')
    .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#\$%\^&\*])/, 'Должен содержать букву, цифру и спецсимвол'),
  passwordConfirm: z.string().min(1, 'Повторите пароль'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: 'Пароли не совпадают',
});
