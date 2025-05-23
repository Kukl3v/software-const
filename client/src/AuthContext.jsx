import { createContext, useState, useEffect, useCallback } from 'react'
import api from './api/api'
import PropTypes from 'prop-types'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    if (!token || !storedUser) {
      setLoading(false)
      return;
    }
    try {
      const res = await api.get(`/api/auth/role?token=${token}`)
      setRole(res.data)
      setUser(storedUser)
    } catch {
      localStorage.clear()
      setUser(null)
      setRole(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
    const handleLogout = () => {
      setUser(null)
      setRole(null)
    };
    window.addEventListener('logout', handleLogout)
    return () => window.removeEventListener('logout', handleLogout)
  }, [fetchUser])

  const login = (token, username) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', username)
    setLoading(true)
    fetchUser()
  };

  const logout = () => {
    localStorage.clear()
    window.dispatchEvent(new Event('logout'))
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node,
}