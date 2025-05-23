import { Outlet } from 'react-router-dom';
import Header from '../components/Header'
import Footer from '../components/Footer'

function MainLayout({ links }) {
  return (
      <>
          <Header links={links}/>
          <Outlet />
          <Footer />
      </>
  )
}

export default MainLayout