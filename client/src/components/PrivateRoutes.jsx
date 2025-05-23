import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

export default function PrivateRoutes({ roles = [] }) {
  const { role, loading } = useContext(AuthContext);

  if (loading) return null;

  const allowGuest = roles.includes('NONE');
  const allowUser  = role && roles.includes(role);

  if (allowGuest || allowUser) {
    return <Outlet />;
  }

  const redirectTo = role ? '/error' : '/login';
  return <Navigate to={redirectTo} replace />;
}