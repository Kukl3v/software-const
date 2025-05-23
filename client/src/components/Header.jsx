import { useContext, useState } from 'react'
import { APP_NAME } from '../config/Constants'
import { AuthContext } from '../AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { HiChevronDown, HiMenu } from 'react-icons/hi'
import { toast } from 'sonner'

export default function Header({ links = [] }) {
  const { user, role, loading, logout } = useContext(AuthContext)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const validate = (roles = []) => {
    if (roles.includes('NONE')) return true
    return roles.includes(role);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    toast.success('Успешный выход')
    navigate('/login')
  };

  if (loading) return null

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <nav className="max-w-screen-xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-semibold text-gray-900 select-none">
          {APP_NAME}
        </Link>

        <ul className="hidden md:flex space-x-8">
          {links
            .filter(({ roles }) => validate(roles))
            .map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className="font-medium text-gray-700 hover:text-gray-900"
                >
                  {label}
                </Link>
              </li>
            ))}
        </ul>

        <div className="relative">
          {!user ? (
            <Link
              to="/login"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Вход
            </Link>
          ) : (
            <>
              <button
                onClick={() => setIsDropdownOpen(o => !o)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
              >
                {user}
                <HiChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}/>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
                    Роль: <span className="font-medium text-gray-800">{role}</span>
                  </div>
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Профиль
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Выход
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden ml-4 p-2 rounded-md text-gray-500 hover:bg-gray-100"
          onClick={() => setMobileOpen(o => !o)}
        >
          <HiMenu className="w-6 h-6" />
        </button>
      </nav>
    </header>
  )
}