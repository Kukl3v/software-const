import React, { useEffect, useState, useContext } from 'react'
import ContentBlock from '../components/ContentBlock'
import PageTitle from '../components/PageTitle'
import { toast } from 'sonner'
import { AuthContext } from '../AuthContext'
import { getUserByEmailRequest, updateUserRequest, updatePasswordRequest } from '../services/accountService'
import { AccountUpdateSchema, PasswordUpdateSchema } from '../schemas/accountSchema'

function Account(props) {
  PageTitle(props.title)

  const { user: emailFromContext } = useContext(AuthContext)
  const [userId, setUserId] = useState(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [passwordCurrent, setPasswordCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserByEmailRequest(emailFromContext)
        if (userData) {
          setFirstName(userData.firstName)
          setLastName(userData.lastName)
          setEmail(userData.email)
          setUserId(userData.id)
        }
      } catch (err) {
        toast.error('Не удалось загрузить данные пользователя', { position: 'bottom-right' })
      }
    }

    if (emailFromContext) fetchUser()
  }, [emailFromContext])

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    const formData = { firstName, lastName, email }

    try {
      AccountUpdateSchema.parse(formData)
      await updateUserRequest(userId, formData)
      toast.success('Данные успешно обновлены', { position: 'bottom-right', duration: 2000 })
    } catch (err) {
      if (err.errors) {
        const formErrors = {}
        err.errors.forEach((e) => formErrors[e.path[0]] = e.message)
        setErrors(formErrors)
      } else {
        toast.error('Ошибка при обновлении данных')
      }
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    const formData = { passwordCurrent, password, passwordConfirm }

    try {
      PasswordUpdateSchema.parse(formData)
      await updatePasswordRequest(userId, {
        currentPassword: passwordCurrent,
        newPassword: password,
      })
      toast.success('Пароль успешно обновлён', { position: 'bottom-right', duration: 2000 })
      setPassword('')
      setPasswordConfirm('')
      setPasswordCurrent('')
    } catch (err) {
      if (err.errors) {
        const formErrors = {}
        err.errors.forEach((e) => formErrors[e.path[0]] = e.message)
        setErrors(formErrors)
      } else {
        toast.error('Ошибка при обновлении пароля')
      }
    }
  }

    const Content = (
        <div className="flex justify-center flex-wrap">
            <div className="w-full max-w-4xl bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
                <div className="mt-5">
                    <form onSubmit={handleUpdateUser}>
                        <div className="relative mt-6">
                            <label htmlFor="firstName" className="block text-sm font-medium mb-2 text-gray-900">Имя</label>
                            <input
                                type="text"
                                name="firstName"
                                id="firstName"
                                placeholder="Ввидите имя"
                                value={firstName}
                                onChange={e => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: undefined })) }}
                                className="peer w-full py-2.5 sm:py-3 px-4 border border-gray-200 rounded-lg sm:text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                autoComplete="off"
                            />
                            {errors.firstName && (
                                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                            )}
                        </div>

                        <div className="relative mt-6">
                            <label htmlFor="lastName" className="block text-sm font-medium mb-2 text-gray-900">Фамилия</label>
                            <input
                                type="text"
                                name="lastName"
                                id="lastName"
                                placeholder="Ввидите фамилию"
                                value={lastName}
                                onChange={e => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: undefined })) }}
                                className="peer w-full py-2.5 sm:py-3 px-4 border border-gray-200 rounded-lg sm:text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                autoComplete="off"
                            />
                            {errors.lastName && (
                                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                            )}
                        </div>

                        <div className="relative mt-6">
                            <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-900">Почта</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                placeholder="Ввидите почту"
                                value={email}
                                onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
                                className="peer w-full py-2.5 sm:py-3 px-4 border border-gray-200 rounded-lg sm:text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                                autoComplete="off"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="my-6">
                            <button type="submit" className="w-full rounded-md px-3 py-4 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-400 focus:outline-none focus:bg-yellow-400 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">Изменить данные</button>
                        </div>
                    </form>
                </div>

            </div>

            <div className="w-full max-w-4xl bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10 mt-6">
                <div className="mt-5">
                    <form onSubmit={handleUpdatePassword}>
                        <div className="relative mt-6">
                            <label htmlFor="passwordCurrent" className="block text-sm font-medium mb-2 text-gray-900">Текущий пароль</label>
                            <input
                                type="password"
                                name="passwordCurrent"
                                id="passwordCurrent"
                                placeholder="Введите текущий пароль"
                                autoComplete="off"
                                value={passwordCurrent}
                                onChange={e => { setPasswordCurrent(e.target.value); setErrors(prev => ({ ...prev, passwordCurrent: undefined })) }}
                                className="peer w-full py-2.5 sm:py-3 px-4 border border-gray-200 rounded-lg sm:text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="relative mt-6">
                            <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-900">Новый пароль</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Введите новый пароль"
                                autoComplete="user-password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })) }}
                                className="peer w-full py-2.5 sm:py-3 px-4 border border-gray-200 rounded-lg sm:text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="relative mt-6">
                            <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-2 text-gray-900">Подтверждение пароля</label>
                            <input
                                type="password"
                                name="passwordConfirm"
                                id="passwordConfirm"
                                placeholder="Повторите новый пароль"
                                autoComplete="user-password"
                                value={passwordConfirm}
                                onChange={e => { setPasswordConfirm(e.target.value); setErrors(prev => ({ ...prev, passwordConfirm: undefined })) }}
                                className="peer w-full py-2.5 sm:py-3 px-4 border border-gray-200 rounded-lg sm:text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                            />
                            {errors.passwordConfirm && (
                                <p className="text-red-500 text-sm mt-1">{errors.passwordConfirm}</p>
                            )}
                        </div>

                        <div className="my-6">
                            <button type="submit" className="w-full rounded-md px-3 py-4 text-sm font-medium rounded-lg border border-transparent bg-yellow-500 text-white hover:bg-yellow-400 focus:outline-none focus:bg-yellow-400 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">Изменить пароль</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="w-full max-w-4xl px-6 pt-10 pb-8 sm:px-10">
                <button className="w-full rounded-md px-3 py-4 text-sm font-medium rounded-lg border border-transparent bg-red-500 text-white hover:bg-red-400 focus:outline-none focus:bg-red-400 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">Удалить аккаунт</button>
            </div>
        </div>
    )

    return (
        <ContentBlock valueBlock={Content} />
    )
}

export default Account