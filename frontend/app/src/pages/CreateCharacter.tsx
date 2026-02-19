import { useState, useEffect } from 'react';
import { api } from '../services/api'; 
import { useParams, useNavigate } from 'react-router-dom';

const CreateCharacter = () => {
    const { id: urlCampaignId } = useParams();
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState<string>(urlCampaignId || '');
    const [error, setError] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        classSubclass: '',
        hitPoints: 10,
        level: 1,
        proficiencyBonus: 2,
        lore: '',
        scores: {
            'Fuerza': 10,
            'Destreza': 10,
            'Constitucion': 10,
            'Inteligencia': 10,
            'Sabiduria': 10,
            'Carisma': 10
        },
        proficiencies: [] as string[]
    });

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const data = await api.getCampaigns();
                setCampaigns(data);
                if (!selectedCampaignId && data.length > 0) {
                    setSelectedCampaignId(data[0].id.toString());
                }
            } catch (err) {
                console.error("Failed to fetch campaigns", err);
            }
        };
        fetchCampaigns();
    }, [selectedCampaignId]);

    // Defined skills mapping for UI
    const statsData: { [key: string]: string[] } = {
        'Fuerza': ['Atletismo'],
        'Destreza': ['Acrobacias', 'Juego de manos', 'Sigilo'],
        'Constitucion': [],
        'Inteligencia': ['Conocimiento arcano', 'Historia', 'Investigación', 'Naturaleza', 'Religion'],
        'Sabiduria': ['Trato con animales', 'Perspicacia', 'Medicina', 'Percepción', 'Supervivencia'],
        'Carisma': ['Engaño', 'Intimidación', 'Interpretación', 'Persuasión']
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'campaignId') {
            setSelectedCampaignId(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleScoreChange = (stat: string, val: string) => {
        setFormData(prev => ({
            ...prev,
            scores: { ...prev.scores, [stat]: parseInt(val) || 0 }
        }));
    };

    const toggleProficiency = (skillName: string) => {
        setFormData(prev => {
            const current = prev.proficiencies;
            if (current.includes(skillName)) {
                return { ...prev, proficiencies: current.filter(s => s !== skillName) };
            } else {
                return { ...prev, proficiencies: [...current, skillName] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCampaignId) {
            alert("Please select a campaign");
            return;
        }
        try {
            const result = await api.createCharacter({
                ...formData,
                campaignId: selectedCampaignId
            });
            if (result.id) {
                navigate(`/character/${result.id}`);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create character");
        }
    };

    const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

    return (
        <div style={{ padding: '2rem', color: 'white', maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <h1>¿Quién eres?</h1>
            
            {error && (
                <div style={{ 
                    backgroundColor: 'rgba(220, 38, 38, 0.1)', 
                    border: '1px solid #dc2626', 
                    color: '#dc2626', 
                    padding: '1rem', 
                    borderRadius: '4px',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="form-group">
                    <label>Nombre del personaje</label>
                    <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Campaña en la que se encuentra el personaje</label>
                    <select 
                        name="campaignId" 
                        value={selectedCampaignId} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'white' }}
                    >
                        <option value="" disabled>Select a campaign</option>
                        {campaigns.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="grid-cols-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                        <label>Clase & Subclase</label>
                        <input 
                            name="classSubclass" 
                            value={formData.classSubclass} 
                            onChange={handleChange} 
                            placeholder="Guerrero, Campeón"
                            required 
                            className="input-field"
                        />
                    </div>
                
                    <div className="form-group">
                        <label>Nivel</label>
                        <input 
                            name="level" 
                            type="number"
                            value={formData.level} 
                            onChange={handleChange} 
                            required 
                            className="input-field"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Bonificador de competencia</label>
                        <input 
                            name="proficiencyBonus" 
                            type="number"
                            value={formData.proficiencyBonus} 
                            onChange={handleChange} 
                            required 
                            className="input-field"
                        />
                    </div>

                    <div className="form-group">
                        <label>Puntos de golpe</label>
                        <input 
                            name="hitPoints" 
                            type="number"
                            value={formData.hitPoints} 
                            onChange={handleChange} 
                            required 
                            className="input-field"
                        />
                    </div>
                </div>

                <h3>Características & competencias</h3>
                <div className="grid-cols-2" style={{ gap: '2rem' }}>
                    {Object.keys(statsData).map(stat => {
                         const score = (formData.scores as any)[stat];
                         const modifier = calculateModifier(score);
                         return (
                        <div key={stat} className="card" style={{ padding: '1rem' }}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{stat}</label>
                                    <span style={{ color: 'var(--text-secondary)' }}>{modifier > 0 ? '+' : ''}{modifier}</span>
                                </div>
                                <input 
                                    type="number"
                                    value={score}
                                    onChange={(e) => handleScoreChange(stat, e.target.value)}
                                    className="input-field"
                                    style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                                />
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {/* Saving Throw */}
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={formData.proficiencies.includes(`Saving Throw: ${stat}`)}
                                        onChange={() => toggleProficiency(`Saving Throw: ${stat}`)}
                                    />
                                    <span>Tirada de salvación</span>
                                </label>
                                
                                {/* Skills */}
                                {statsData[stat].map(skill => (
                                    <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={formData.proficiencies.includes(skill)}
                                            onChange={() => toggleProficiency(skill)}
                                        />
                                        <span>{skill}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )})}
                </div>

                <div className="form-group">
                    <label>Lore</label>
                    <textarea 
                        name="lore"
                        value={formData.lore}
                        onChange={handleChange}
                        className="input-field"
                        style={{ minHeight: '100px', resize: 'vertical' }}
                    />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                    Crear personaje
                </button>
            </form>
        </div>
    );
};

export default CreateCharacter;
