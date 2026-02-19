import { useEffect, useState } from 'react';
import { api, getAuthToken, removeAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
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
        setCampaigns(data);
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
      if (event.key === 'Escape') {
        setShowCreateModal(false);
      }
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
      // Refresh list to get full data and correct IDs
      const data = await api.getCampaigns();
      setCampaigns(data);
      setShowCreateModal(false);
      setNewCampaign({ name: '', gameSystem: 'D&D 5.5e', description: '' });
    } catch (err) {
      alert("No se pudo crear la campaña");
    }
  };

  const handleLogout = () => {
      removeAuthToken();
      setIsGuest(true);
      setCampaigns([]);
      navigate('/login');
  }





  const handleLaunchGame = (campaign: any) => {
      navigate(`/campaign/${campaign.id}`);
  };

  const handleJoinCampaign = async (id: number) => {
      try {
          await api.joinCampaign(id);
          alert("Te has unido a la campaña exitosamente");
          // Refresh list
          const data = await api.getCampaigns();
          setCampaigns(data);
      } catch (err) {
          alert("No se pudo unir a la campaña.");
      }
  };

    return (
        <main style={{ padding: '2rem', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1>{isGuest ? 'Bienvenido al multiverso de D&D' : 'Todas las campañas'}</h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {isGuest ? (
                    <>
                    <button className="btn-primary" onClick={() => navigate('/login')} style={{ backgroundColor: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>
                        Iniciar sesion
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/register')}>
                        Registrarse
                    </button>
                    </>
                ) : (
                    <>
                    <button className="btn-primary" onClick={handleCreateNewGame}>
                        Crear nueva campaña
                    </button>
                    <button className="btn-primary" onClick={handleLogout} style={{ backgroundColor: 'var(--danger-color)' }}>
                        Cerrar sesión
                    </button>
                    </>
                )}
            </div>
        </header>

        {loading ? (
            <div>Cargando las campañas...</div>
        ) : (
            <div className="grid-cols-3">
            {isGuest ? (
                <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <h2>Únete a la aventura</h2>
                    <p style={{ marginBottom: '2rem' }}>Inicia sesión para ver y unirte a las campañas activas.</p>
                    <button className="btn-primary" onClick={() => navigate('/register')}>Comenzar</button>
                    
                    <div className="card" style={{ marginTop: '2rem', maxWidth: '400px', margin: '2rem auto', textAlign: 'left', opacity: 0.7 }}>
                         <h3 style={{ marginBottom: '0.5rem' }}>Campaña de demostración</h3>
                         <p>Inicia sesión para jugar</p>
                    </div>
                </div>
            ) : campaigns.length === 0 ? (
                <div style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No hay campañas disponibles. ¡Crea una!
                </div>
            ) : (
                campaigns.map((campaign) => (
                <div 
                key={campaign.id} 
                className="card"
                style={{ cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' }}
                onClick={() => {
                    if (campaign.isJoined || campaign.isDm) {
                        handleLaunchGame(campaign);
                    }
                }}
                >
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
                    {!campaign.isJoined && !campaign.isDm && (
                        <button 
                            className="btn-primary"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', backgroundColor: 'var(--success-color)' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleJoinCampaign(campaign.id);
                            }}
                        >
                            Unirse a la campaña
                        </button>
                    )}
                </div>
                
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    DM: {campaign.dungeonMaster?.username || 'Tú'} {campaign.isDm && '(Tú)'}
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{campaign.gameSystem || '5e'}</span>
                    {(campaign.isJoined || campaign.isDm) && (
                        <button 
                        className="btn-primary" 
                        style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleLaunchGame(campaign);
                        }}
                        >
                        Jugar
                        </button>
                    )}
                </div>
                </div>
            )))} 
            </div>
        )}

        {showCreateModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Contar una nueva historia</h2>
                    <form onSubmit={handleSubmitCreate}>
                        <div className="form-group">
                            <label htmlFor="name">Nombre de la campaña</label>
                            <input 
                                id="name"
                                type="text" 
                                className="input-field" 
                                value={newCampaign.name}
                                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                                placeholder="El nombre de tu aventura..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gameSystem">Sistema de juego</label>
                            <input 
                                id="gameSystem"
                                type="text" 
                                className="input-field" 
                                value={newCampaign.gameSystem}
                                onChange={(e) => setNewCampaign({...newCampaign, gameSystem: e.target.value})}
                                placeholder="D&D 5.5e, Pathfinder, La llamada de Cthulhu..."
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Descripción</label>
                            <textarea 
                                id="description"
                                className="textarea-field" 
                                value={newCampaign.description}
                                onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
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

export default Dashboard;
