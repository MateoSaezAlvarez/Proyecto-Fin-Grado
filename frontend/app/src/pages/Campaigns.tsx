import { useEffect, useState } from 'react';
import { api, getAuthToken, removeAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    gameSystem: 'D&D 5.5e',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setIsGuest(true);
          setLoading(false);
          return;
        }
        const data = await api.getCampaigns();
        // Only show campaigns where the current user is the DM
        setCampaigns(data.filter((c: any) => c.isDm));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowCreateModal(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleCreateNewGame = () => {
    if (isGuest) {
      navigate('/register');
      return;
    }
    setShowCreateModal(true);
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!getAuthToken()) {
        navigate('/login');
        return;
      }
      await api.createCampaign(newCampaign);
      const data = await api.getCampaigns();
      setCampaigns(data.filter((c: any) => c.isDm));
      setShowCreateModal(false);
      setNewCampaign({ name: '', gameSystem: 'D&D 5.5e', description: '' });
    } catch (err: any) {
      alert(err.message || 'No se pudo crear la campaña');
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsGuest(true);
    setCampaigns([]);
    navigate('/login');
  };

  const handleLaunchGame = (campaign: any) => {
    navigate(`/campaign/${campaign.id}`);
  };

  return (
    <main style={{ padding: '2rem', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--accent-color)'}}>Mis Campañas</h1>
          <p style={{ margin: '0.4rem 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Campañas en las que eres el Dungeon Master
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isGuest ? (
            <>
              <button className="btn-primary" onClick={() => navigate('/login')} style={{ backgroundColor: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>
                Iniciar sesión
              </button>
              <button className="btn-primary" onClick={() => navigate('/register')}>
                Registrarse
              </button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={handleCreateNewGame}>
                Nueva Campaña
              </button>
              <button className="btn-primary" onClick={handleLogout} style={{ backgroundColor: 'var(--danger-color)' }}>
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </header>

      {loading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Cargando campañas...</div>
      ) : isGuest ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <h2>Acceso restringido</h2>
          <p style={{ marginBottom: '2rem' }}>Inicia sesión para gestionar tus campañas como DM.</p>
          <button className="btn-primary" onClick={() => navigate('/login')}>Iniciar sesión</button>
        </div>
      ) : campaigns.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '5rem 2rem',
          color: 'var(--text-secondary)',
          border: '1px dashed var(--border-color)',
          borderRadius: '12px',
          marginTop: '2rem'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎲</div>
          <h2 style={{ marginBottom: '0.5rem' }}>Aún no eres DM de ninguna campaña</h2>
          <p style={{ marginBottom: '2rem' }}>
            Crea tu primera campaña y comienza a narrar épicas aventuras.
          </p>
          <button className="btn-primary" onClick={handleCreateNewGame}>
            Crear mi primera campaña
          </button>
        </div>
      ) : (
        <div className="grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="card"
              style={{ cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' }}
              onClick={() => handleLaunchGame(campaign)}
            >
              {/* DM Badge */}
              <div style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                backgroundColor: 'var(--accent-color)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                zIndex: 1,
              }}>
                DM
              </div>

              <div
                style={{
                  height: '150px',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  backgroundImage: `url(${campaign.imageUrl || 'https://via.placeholder.com/300x150?text=Fantasy+Map'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0 }}>{campaign.name}</h3>
              </div>

              {campaign.description && (
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  margin: '0.25rem 0 0.75rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {campaign.description}
                </p>
              )}

              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {campaign.gameSystem || '5e'}
                </span>
                <button
                  className="btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchGame(campaign);
                  }}
                >
                  Gestionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Contar una nueva historia</h2>
            <form onSubmit={handleSubmitCreate}>
              <div className="form-group">
                <label htmlFor="camp-name">Nombre de la campaña</label>
                <input
                  id="camp-name"
                  type="text"
                  className="input-field"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="El nombre de tu aventura..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="camp-system">Sistema de juego</label>
                <input
                  id="camp-system"
                  type="text"
                  className="input-field"
                  value={newCampaign.gameSystem}
                  onChange={(e) => setNewCampaign({ ...newCampaign, gameSystem: e.target.value })}
                  placeholder="D&D 5.5e, Pathfinder, La llamada de Cthulhu..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="camp-desc">Descripción</label>
                <textarea
                  id="camp-desc"
                  className="textarea-field"
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                  placeholder="Cuéntanos un poco sobre el mundo..."
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  style={{ backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Campaigns;
