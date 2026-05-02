import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import CreateCharacter from './pages/CreateCharacter';
import CreateAttack from './pages/CreateAttack';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CharacterSheet from './pages/CharacterSheet';
import Register from './pages/Register';
import MyCharacters from './pages/MyCharacters';
import CampaignDetail from './pages/CampaignDetail';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes wrapped in Layout (Sidebar) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/characters" element={<MyCharacters />} />
          <Route path="/characters/new" element={<CreateCharacter />} />
          <Route path="/campaign/:id" element={<CampaignDetail />} />
          <Route path="/character/:id" element={<CharacterSheet />} />
          <Route path="/campaign/:id/create-character" element={<CreateCharacter />} />
          <Route path="/character/:characterId/create-attack" element={<CreateAttack />} />
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;