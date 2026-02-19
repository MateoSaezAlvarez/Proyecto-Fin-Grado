import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const CampaignDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<any>(null);
    const [characters, setCharacters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaignData = async () => {
            if (!id) return;
            try {
                const campaignId = parseInt(id, 10);
                const [campaignData, charactersData] = await Promise.all([
                    api.getCampaign(campaignId),
                    api.getCampaignCharacters(campaignId)
                ]);
                setCampaign(campaignData);
                setCharacters(charactersData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaignData();
    }, [id]);

    if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Cargando detalles de la campaña...</div>;
    if (!campaign) return <div style={{ padding: '2rem', color: 'white' }}>Campaña no encontrada</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                    <div 
                        style={{ 
                            width: '200px', 
                            height: '120px', 
                            borderRadius: '8px', 
                            backgroundImage: `url(${campaign.imageUrl || 'https://via.placeholder.com/300x150?text=Campaign'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }} 
                    />
                    <div>
                        <h1 style={{ color: 'var(--accent-color)', fontFamily: 'Cinzel, serif', margin: 0 }}>{campaign.name}</h1>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{campaign.gameSystem} - {campaign.status}</p>
                        <p style={{ marginTop: '1rem', maxWidth: '600px' }}>{campaign.description || 'No hay descripción en el archivo.'}</p>
                    </div>
                </div>
            </header>

            <section>
                <h2 style={{ fontFamily: 'Cinzel, serif', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                    Aventureros
                </h2>
                
                {characters.length === 0 ? (
                    <div style={{ color: 'var(--text-secondary)' }}>
                        Ningún aventurero se ha unido a esta campaña.
                    </div>
                ) : (
                    <div className="grid-cols-3">
                        {characters.map((char) => (
                            <div 
                                key={char.id} 
                                className="card" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/character/${char.id}`)}
                            >
                                <div 
                                    style={{ 
                                        borderRadius: '8px', 
                                        marginBottom: '1rem',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }} 
                                />
                                <h3>{char.name}</h3>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    {char.classSubclass} - Nivel {char.level}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Jugador: {char.playerName || 'Unknown'}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default CampaignDetail;
