import { useEffect, useState } from 'react';
import { api, getAuthToken, removeAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
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

  const handleCreateNewGame = async () => {
    if (isGuest) {
        navigate('/register');
        return;
    }
    
    try {
      if (!getAuthToken()) {
        navigate('/login');
        return;
      }
      const name = prompt("Enter Game Name:");
      if (!name) return;
      
      const newGame = await api.createCampaign({ name });
      setCampaigns([...campaigns, { ...newGame, name, id: campaigns.length + 1 }]);
    } catch (err) {
      alert("Failed to create game");
    }
  };

  const handleLogout = () => {
      removeAuthToken();
      setIsGuest(true);
      setCampaigns([]);
      navigate('/login');
  }





  const handleLaunchGame = async (campaign: any) => {
      if (campaign.isDm) {
          navigate(`/campaign/${campaign.id}`);
      } else {
          // If Player, try to find character
          try {
              const character = await api.getMyCharacterInCampaign(campaign.id);
              if (character) {
                  navigate(`/character/${character.id}`);
              } else {
                  // No character, redirect to create one
                  const doCreate = window.confirm("You don't have a character in this campaign yet. Create one?");
                  if (doCreate) {
                      navigate(`/campaign/${campaign.id}/create-character`);
                  }
              }
          } catch (err) {
              console.error("Error checking character", err);
              // Fallback to create character if error suggests 404/not found
              navigate(`/campaign/${campaign.id}/create-character`);
          }
      }
  };

  const handleJoinCampaign = async (id: number) => {
      try {
          await api.joinCampaign(id);
          alert("Joined successfully!");
          // Refresh list
          const data = await api.getCampaigns();
          setCampaigns(data);
      } catch (err) {
          alert("Failed to join campaign.");
      }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
        {!isGuest && <Sidebar />}
        <main style={{ padding: '2rem', width: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', marginLeft: isGuest ? 0 : '64px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1>{isGuest ? 'Welcome to d20 Clone' : 'All Games'}</h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
                {isGuest ? (
                    <>
                    <button className="btn-primary" onClick={() => navigate('/login')} style={{ backgroundColor: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>
                        Login
                    </button>
                    <button className="btn-primary" onClick={() => navigate('/register')}>
                        Register
                    </button>
                    </>
                ) : (
                    <>
                    <button className="btn-primary" onClick={handleCreateNewGame}>
                        Create New Game
                    </button>
                    <button className="btn-primary" onClick={handleLogout} style={{ backgroundColor: 'var(--danger-color)' }}>
                        Logout
                    </button>
                    </>
                )}
            </div>
        </header>

        {loading ? (
            <div>Loading campaigns...</div>
        ) : (
            <div className="grid-cols-3">
            {isGuest ? (
                <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                    <h2>Join the Adventure</h2>
                    <p style={{ marginBottom: '2rem' }}>Login to view and join active campaigns.</p>
                    <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
                    
                    <div className="card" style={{ marginTop: '2rem', maxWidth: '400px', margin: '2rem auto', textAlign: 'left', opacity: 0.7 }}>
                         <h3 style={{ marginBottom: '0.5rem' }}>Demo Campaign</h3>
                         <p>Login to play</p>
                    </div>
                </div>
            ) : campaigns.length === 0 ? (
                <div style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No campaigns available. Create one!
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
                            Join Campaign
                        </button>
                    )}
                </div>
                
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Host: {campaign.dungeonMaster?.username || 'You'} {campaign.isDm && '(You)'}
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
                        Launch Game &gt;
                        </button>
                    )}
                </div>
                </div>
            )))} 
            </div>
        )}
        </main>
    </div>
  );
};

export default Dashboard;
