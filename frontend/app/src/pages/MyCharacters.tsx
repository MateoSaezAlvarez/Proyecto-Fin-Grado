import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const MyCharacters = () => {
    const [characters, setCharacters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const data = await api.getMyCharacters();
                setCharacters(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCharacters();
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'var(--accent-color)', fontFamily: 'Cinzel, serif' }}>Mis Personajes</h1>
                <button 
                    className="btn-primary" 
                    onClick={() => navigate('/characters/new')}
                >
                    Crear Nuevo Personaje
                </button>
            </header>

            {loading ? (
                <div>Cargando personajes...</div>
            ) : characters.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem' }}>
                    <p>No has creado ningun personaje todavia.</p>
                    <button className="btn-primary" onClick={() => navigate('/characters/new')} style={{ marginTop: '1rem' }}>
                        Crea Tu Primer Personaje
                    </button>
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
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                {char.classSubclass} - Nivel {char.level}
                            </div>
                            <div style={{ 
                                fontSize: '0.8rem', 
                                color: 'var(--accent-color)',
                                borderTop: '1px solid var(--border-color)',
                                paddingTop: '0.5rem',
                                marginTop: '0.5rem'
                            }}>
                                Campaña: {char.campaign?.name || 'Unknown Campaign'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCharacters;
