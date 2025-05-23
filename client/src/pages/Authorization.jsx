import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { APP_NAME } from '../config/Constants'
import PageTitle from '../components/PageTitle'
import { AuthContext } from '../AuthContext'
import { LoginSchema } from '../schemas/authorizationSchema'
import { loginRequest } from '../services/authorizationService'
import { toast } from 'sonner'

function Authorization(props) {
    PageTitle(props.title)
    const { login } = useContext(AuthContext);
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

  const handleLogin = async (e) => {
    e.preventDefault()
    const parseResult = LoginSchema.safeParse({ email, password })
    if (!parseResult.success) {
      const fieldErrors = {}
      parseResult.error.issues.forEach(issue => {
        fieldErrors[issue.path[0]] = issue.message
      });
      setErrors(fieldErrors)
      return
    }

    try {
      const accessToken = await loginRequest({ email, password })
      login(accessToken, email)
      toast.success('Успешный вход', { position: 'bottom-right', duration: 2000 })
      navigate('/clubs')
    } catch (err) {
      const message = err.response?.data || 'Ошибка входа'
      toast.error(message, { position: 'bottom-right', duration: 2000 })
      localStorage.clear()
      setErrors({ login: message })
    }
  }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
                <div className="w-full">
                    <div className="flex justify-center items-center">
                        <div>
                            <h1 className="text-3xl font-semibold text-gray-900 select-none pointer-events-none">Вход {APP_NAME}</h1>
                        </div>
                    </div>
                    <div className="mt-5">
                        <form onSubmit={handleLogin}>
                            <div className="relative mt-6">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    placeholder="Почта"
                                    value={email}
                                    onChange={e => {setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined }))}}
                                    className="peer w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none transition-all duration-100 ease-in-out"
                                    autoComplete="off"
                                />
                                <label htmlFor="email" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Почта</label>
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="relative mt-6">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={e => {setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined }))}}
                                    className="peer w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none transition-all duration-100 ease-in-out"
                                />
                                <label htmlFor="password" className="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Пароль</label>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div className="my-6">
                                <button type="submit" className="w-full rounded-md px-3 py-4 text-sm font-medium rounded-lg border border-transparent bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">Войти</button>
                            </div>
                            <p className="text-center text-sm text-gray-500">Нет аккаунта?{' '}<Link to="/register" className="font-semibold text-gray-600 hover:underline">Создать аккаунт</Link>.</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Authorization