import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{ marginLeft: '64px', width: '100%', flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
