import { Outlet } from 'react-router-dom';

function CleanLayout({ children }) {
    return (
      <>
        <Outlet />
      </>
    )
}

export default CleanLayout