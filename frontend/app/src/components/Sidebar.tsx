import { Home, Book, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside style={{
      width: '64px',
      backgroundColor: 'var(--bg-secondary)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '1rem 0',
      borderRight: '1px solid var(--border-color)',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <div style={{ marginBottom: '2rem', color: 'var(--accent-color)' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Cinzel, serif' }}>d20</h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navLinkStyle} title="Home">
          <Home size={24} />
        </NavLink>
        <NavLink to="/campaigns" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navLinkStyle} title="Campaigns">
          <Book size={24} />
        </NavLink>
        <NavLink to="/characters" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navLinkStyle} title="My Characters">
          <Users size={24} />
        </NavLink>
      </nav>
    </aside>
  );
};

const navLinkStyle = {
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'color 0.2s',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '4px',
  textDecoration: 'none'
};

export default Sidebar;
