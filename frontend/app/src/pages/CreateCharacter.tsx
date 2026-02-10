import { useState } from 'react';
import { api } from '../services/api'; 
import { useParams, useNavigate } from 'react-router-dom';

const CreateCharacter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        classSubclass: '',
        hitPoints: 10,
        level: 1,
        proficiencyBonus: 2,
        lore: '',
        scores: {
            'Strength': 10,
            'Dexterity': 10,
            'Constitution': 10,
            'Intelligence': 10,
            'Wisdom': 10,
            'Charisma': 10
        },
        proficiencies: [] as string[]
    });

    // Defined skills mapping for UI
    const statsData: { [key: string]: string[] } = {
        'Strength': ['Athletics'],
        'Dexterity': ['Acrobatics', 'Sleight of Hand', 'Stealth'],
        'Constitution': [],
        'Intelligence': ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
        'Wisdom': ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'],
        'Charisma': ['Deception', 'Intimidation', 'Performance', 'Persuasion']
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleScoreChange = (stat: string, val: string) => {
        setFormData(prev => ({
            ...prev,
            scores: { ...prev.scores, [stat]: parseInt(val) }
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
        if (!id) return;
        try {
            const result = await api.createCharacter({
                ...formData,
                campaignId: id
            });
            if (result.id) {
                navigate(`/character/${result.id}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create character");
        }
    };

    const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

    return (
        <div style={{ padding: '2rem', color: 'white', maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
            <h1>Create Your Character</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
                <div className="form-group">
                    <label>Character Name</label>
                    <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        className="input-field"
                    />
                </div>
                
                <div className="grid-cols-2" style={{ gap: '1rem' }}>
                    <div className="form-group">
                        <label>Class & Subclass</label>
                        <input 
                            name="classSubclass" 
                            value={formData.classSubclass} 
                            onChange={handleChange} 
                            placeholder="e.g. Fighter (Champion)"
                            required 
                            className="input-field"
                        />
                    </div>
                
                    <div className="form-group">
                        <label>Level</label>
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
                        <label>Proficiency Bonus</label>
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
                        <label>Hit Points</label>
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

                <h3>Ability Scores & Proficiencies</h3>
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
                                    <span>Saving Throw</span>
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
                    <label>Backstory / Lore</label>
                    <textarea 
                        name="lore"
                        value={formData.lore}
                        onChange={handleChange}
                        className="input-field"
                        style={{ minHeight: '100px', resize: 'vertical' }}
                    />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
                    Create Character
                </button>
            </form>
        </div>
    );
};

export default CreateCharacter;
