import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CreateCharacter from './pages/CreateCharacter';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CharacterSheet from './pages/CharacterSheet';
import Register from './pages/Register';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes wrapped in Layout (Sidebar) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Protected Routes wrapped in Layout (Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/campaign/:id" element={<Dashboard />} /> {/* Placeholder to dash/VTT stub */}
          <Route path="/character/:id" element={<CharacterSheet />} />
          <Route path="/campaign/:id/create-character" element={<CreateCharacter />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;