import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getAuthToken } from '../services/api';

const Layout = () => {
  const hasToken = !!getAuthToken();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {hasToken && <Sidebar />}
      <div style={{ marginLeft: hasToken ? '64px' : '0', width: '100%', flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
