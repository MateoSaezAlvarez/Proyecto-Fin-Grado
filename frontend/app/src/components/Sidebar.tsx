import { Home, MessageSquare, Book, Music, Settings, User } from 'lucide-react';
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
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>d20</h1>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} style={navLinkStyle}>
          <Home size={24} />
        </NavLink>
        <div style={navLinkStyle} title="Chat">
          <MessageSquare size={24} />
        </div>
        <div style={navLinkStyle} title="Journal">
          <Book size={24} />
        </div>
        <div style={navLinkStyle} title="Jukebox">
          <Music size={24} />
        </div>
        <div style={navLinkStyle} title="Settings">
          <Settings size={24} />
        </div>
      </nav>

      <div style={{ marginTop: 'auto' }}>
        <NavLink to="/profile" style={navLinkStyle}>
          <User size={24} />
        </NavLink>
      </div>
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
