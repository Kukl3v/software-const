import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {TITLE_SIGNUP, TITLE_SIGNIN, TITLE_CLUB, TITLE_USER, TITLE_REPORT, TITLE_ACCOUNT, TITLE_SCHEDULE, TITLE_GROUP,TITLE_SERVICE, TITLE_MEMBERSHIP, TITLE_ERROR} from './config/Constants';
import PrivateRoutes from './components/PrivateRoutes'
import CleanLayout from './layouts/CleanLayout'
import MainLayout from './layouts/MainLayout'
import Registration from './pages/Registration'
import Authorization from './pages/Authorization'
import Account from './pages/Account'
import Users from './pages/Users'
import Clubs from './pages/Clubs'
import Report from './pages/Report'
import Schedule from './pages/Schedule'
import Service from './pages/Service'
import Membership from './pages/Membership'
import Group from './pages/Group'
import ErrorPage from './pages/ErrorPage'
import { AuthProvider } from './AuthContext'
import { Toaster } from 'sonner'


function App() {
  const links = [
    { path: '/clubs', label: TITLE_CLUB, roles: ['NONE'] },
    { path: '/users', label: TITLE_USER, roles: ['ADMIN'] },
    { path: '/report', label: TITLE_REPORT, roles: ['ADMIN'] },
    { path: '/service', label: TITLE_SERVICE, roles: ['ADMIN'] },
    { path: '/group', label: TITLE_GROUP, roles: ['EMPLOYEE'] },
    { path: '/membership', label: TITLE_MEMBERSHIP, roles: ['ADMIN', 'USER'] },
    { path: '/schedule', label: TITLE_SCHEDULE, roles: ['USER', 'EMPLOYEE'] }
  ]

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<CleanLayout />}>          
            <Route path="/" element={<Authorization title={TITLE_SIGNIN} />} />
            <Route path="/login" element={<Authorization title={TITLE_SIGNIN} />} />
            <Route path="/register" element={<Registration title={TITLE_SIGNUP} />} />
          </Route>

          <Route element={<MainLayout links={links} />}>
            <Route path="/clubs" element={<Clubs title={TITLE_CLUB} />} />
            <Route path="/error" element={<ErrorPage title={TITLE_ERROR} />} />

            <Route element={<PrivateRoutes roles={['ADMIN']} />}>            
              <Route path="/users" element={<Users title={TITLE_USER} />} />
              <Route path="/service" element={<Service title={TITLE_SERVICE} />} />
              <Route path="/report" element={<Report title={TITLE_REPORT} />} />
            </Route>

            <Route element={<PrivateRoutes roles={['EMPLOYEE']} />}>            
              <Route path="/group" element={<Group title={TITLE_GROUP} />} />
            </Route>

            <Route element={<PrivateRoutes roles={['EMPLOYEE', 'USER']} />}>            
              <Route path="/schedule" element={<Schedule title={TITLE_SCHEDULE} />} />
            </Route>

            <Route element={<PrivateRoutes roles={['ADMIN', 'USER']} />}>            
              <Route path="/membership" element={<Membership title={TITLE_MEMBERSHIP} />} /> 
            </Route>

            <Route element={<PrivateRoutes roles={['ADMIN', 'EMPLOYEE', 'USER']} />}>            
              <Route path="/account" element={<Account title={TITLE_ACCOUNT} />} />
            </Route>
          </Route>
        </Routes>
        <Toaster richColors />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App