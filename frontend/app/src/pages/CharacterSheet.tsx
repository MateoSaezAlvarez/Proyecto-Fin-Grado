import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useParams } from 'react-router-dom';
import DiceRollModal from '../components/DiceRollModal';

const CharacterSheet = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('core');
  const [currentHp, setCurrentHp] = useState<number>(0);
  
  // Dice Roll State
  const [isRollModalOpen, setIsRollModalOpen] = useState(false);
  const [rollData, setRollData] = useState({
    name: '',
    baseRoll: 0,
    modifier: 0,
    total: 0
  });

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) return;
      try {
        const data = await api.getCharacter(parseInt(id, 10));
        setCharacter(data);
        setCurrentHp(data.hitPoints); // Initialize local tracker with max HP from DB
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [id]);

  const handleStatChange = async (statName: string, value: number) => {
    // Optimistic update
    setCharacter((prev: any) => ({
      ...prev,
      characteristics: prev.characteristics.map((stat: any) => 
        stat.name === statName ? { ...stat, score: value } : stat
      )
    }));

    try {
      await api.updateStat(character.id, statName, value);
    } catch (err) {
      console.error('Failed to save stat', err);
    }
  };

  const handleCharacterUpdate = async (updates: any) => {
    // Optimistic update
    setCharacter((prev: any) => ({
      ...prev,
      ...updates
    }));

    try {
      await api.updateCharacter(character.id, updates);
    } catch (err) {
      console.error('Failed to update character', err);
    }
  };

  const handleProficiencyToggle = async (abilityId: number, currentProficiency: boolean) => {
    const newProficiency = !currentProficiency;
    
    // Optimistic update
    setCharacter((prev: any) => ({
      ...prev,
      characteristics: prev.characteristics.map((stat: any) => ({
        ...stat,
        abilities: stat.abilities.map((ab: any) => 
          ab.id === abilityId ? { ...ab, proficiency: newProficiency } : ab
        )
      }))
    }));

    try {
      await api.updateAbility(abilityId, newProficiency);
    } catch (err) {
      console.error('Failed to toggle proficiency', err);
    }
  };

  const handleSaveProficiencyToggle = async (statName: string, currentProficiency: boolean) => {
    const newProficiency = !currentProficiency;

    // Optimistic update
    setCharacter((prev: any) => ({
      ...prev,
      characteristics: prev.characteristics.map((stat: any) => 
        stat.name === statName ? { ...stat, saveProficient: newProficiency } : stat
      )
    }));

    try {
      await api.updateStat(character.id, statName, undefined, newProficiency);
    } catch (err) {
      console.error('Failed to toggle save proficiency', err);
    }
  };

  const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

  const handleRoll = async (name: string, modifier: number, abilityId?: number, characteristicId?: number) => {
    const baseRoll = Math.floor(Math.random() * 20) + 1;
    const total = baseRoll + modifier;

    setRollData({
      name: name,
      baseRoll: baseRoll,
      modifier: modifier,
      total: total
    });
    setIsRollModalOpen(true);

    try {
      await api.submitRoll({
        campaignId: character.campaign.id,
        abilityId: abilityId,
        characteristicId: characteristicId,
        rollValue: total,
        dice: 20
      });
    } catch (err) {
      console.error('Failed to upload roll', err);
    }
  };

  if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Loading Character Sheet...</div>;

  if (!character) return <div style={{ padding: '2rem', color: 'white' }}>Character not found</div>;

  return (
    <main style={{ padding: '2rem', width: '100%', overflowY: 'auto', backgroundColor: '#1e1e1e', height: '100%' }}>
      
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
      }}>
        <div>
          <input 
            type="text" 
            value={character.name}
            onChange={(e) => handleCharacterUpdate({ name: e.target.value })}
            style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold',
              background: 'transparent', 
              border: 'none', 
              borderBottom: '1px solid transparent',
              color: 'white',
              width: '100%',
              marginBottom: '0.5rem',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderBottom = '1px solid var(--accent-color)'}
            onBlur={(e) => e.target.style.borderBottom = '1px solid transparent'}
          />
          <div style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Nivel</span>
            <input 
              type="number" 
              value={character.level}
              onChange={(e) => handleCharacterUpdate({ level: parseInt(e.target.value) || 0 })}
              style={{ 
                background: 'transparent', 
                border: '1px solid transparent', 
                borderBottom: '1px solid var(--border-color)',
                color: 'white', 
                width: '40px',
                textAlign: 'center',
                fontSize: '1rem'
              }}
            />
            <input 
              type="text" 
              value={character.classSubclass}
              onChange={(e) => handleCharacterUpdate({ classSubclass: e.target.value })}
              style={{ 
                background: 'transparent', 
                border: '1px solid transparent', 
                borderBottom: '1px solid var(--border-color)',
                color: 'white', 
                fontSize: '1rem',
                flex: 1
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Bono Comp.</span>
              <input 
                type="number" 
                value={character.proficiencyBonus}
                onChange={(e) => handleCharacterUpdate({ proficiencyBonus: parseInt(e.target.value) || 0 })}
                style={{ 
                  background: 'transparent', 
                  border: 'none',
                  color: 'var(--accent-color)', 
                  width: '35px',
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Vida (Puntos de Golpe)</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.8rem' }}>
            
            {/* Local HP Tracker (For damage/healing during session) */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'rgba(0,0,0,0.3)', 
              borderRadius: '12px', 
              padding: '0.3rem 0.6rem',
              border: '1px solid var(--border-color)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}>
              <button 
                onClick={() => setCurrentHp(prev => Math.max(0, prev - 1))}
                style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.4rem', fontWeight: 'bold' }}
              >−</button>
              <input 
                type="number" 
                value={currentHp}
                onChange={(e) => setCurrentHp(parseInt(e.target.value) || 0)}
                title="Vida Actual"
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: 'white', 
                  width: '45px', 
                  textAlign: 'center', 
                  fontSize: '1.6rem', 
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
              <button 
                onClick={() => setCurrentHp(prev => Math.min(character.hitPoints + 100, prev + 1))}
                style={{ background: 'transparent', border: 'none', color: 'var(--success-color)', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.4rem', fontWeight: 'bold' }}
              >+</button>
            </div>

            <span style={{ fontSize: '1.5rem', opacity: 0.3, fontWeight: 'light' }}>/</span>

            {/* Max HP (Editable, Saved to DB) */}
            <div style={{ position: 'relative' }} title="Vida Máxima">
              <input 
                type="number" 
                value={character.hitPoints}
                onChange={(e) => handleCharacterUpdate({ hitPoints: parseInt(e.target.value) || 0 })}
                style={{ 
                  background: 'transparent', 
                  border: 'none',
                  borderBottom: '2px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.6)', 
                  width: '60px',
                  textAlign: 'left',
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  outline: 'none',
                  padding: '0'
                }}
              />
              <div style={{ position: 'absolute', bottom: '-15px', right: '0', fontSize: '0.6rem', opacity: 0.4, textTransform: 'uppercase' }}>Máx</div>
            </div>
          </div>
          <div style={{ fontSize: '0.7rem', opacity: 0.4, marginTop: '1rem', fontStyle: 'italic' }}>*La vida actual se recupera al descansar (actualizar)</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { id: 'core', label: 'Estadísticas' },
          { id: 'bio', label: 'Historia' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === tab.id ? 'var(--accent-color)' : 'var(--border-color)'}`,
              padding: '0.5rem 2rem'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'core' && (
        <div className="grid-cols-2" style={{ gap: '2rem' }}>
          {/* Stats & Skills Grouped */}
          {Object.entries({
            'Strength': 'Fuerza',
            'Dexterity': 'Destreza',
            'Constitution': 'Constitución',
            'Intelligence': 'Inteligencia',
            'Wisdom': 'Sabiduría',
            'Charisma': 'Carisma'
          }).map(([statKey, statDisplay]) => {
              const stat = character.characteristics.find((s: any) => s.name === statKey);
              if (!stat) return null;
              
              const mod = calculateModifier(stat.score);
              const statAbilities = character.characteristics
                 .flatMap((s: any) => s.abilities)
                 .filter((a: any) => a.characteristicId === stat.id);

              return (
                  <div 
                    key={stat.id} 
                    className="card" 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '1rem',
                      cursor: 'default'
                    }} 
                  >
                      {/* Stat Header */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                          <h3 
                            title="Click para una tirada de característica"
                            onClick={() => handleRoll(`Tirada de ${statDisplay}`, mod, undefined, stat.id)}
                            style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)', cursor: 'pointer' }}
                          >
                            {statDisplay}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{mod > 0 ? '+' : ''}{mod}</div>
                              <input 
                                type="number" 
                                value={stat.score}
                                onChange={(e) => handleStatChange(stat.name, parseInt(e.target.value))}
                                style={{ 
                                  background: 'var(--bg-input)', 
                                  border: '1px solid var(--border-color)', 
                                  color: 'white', 
                                  textAlign: 'center', 
                                  fontSize: '1.2rem', 
                                  width: '50px',
                                  padding: '0.2rem',
                                  borderRadius: '4px'
                                }}
                              />
                          </div>
                      </div>

                        {/* Skills List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {/* Saving Throw (Implicit skill-like check) */}
                            <div 
                              style={{ display: 'flex', alignItems: 'center', padding: '0.2rem 0', opacity: 0.8 }}
                            >
                                <div 
                                  title={stat.saveProficient ? "Quitar competencia" : "Añadir competencia"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveProficiencyToggle(stat.name, stat.saveProficient);
                                  }}
                                  style={{ 
                                    width: '12px', 
                                    height: '12px', 
                                    borderRadius: '50%', 
                                    background: stat.saveProficient ? 'var(--accent-color)' : 'transparent',
                                    border: `2px solid ${stat.saveProficient ? 'var(--accent-color)' : 'var(--text-secondary)'}`,
                                    marginRight: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: stat.saveProficient ? '0 0 8px var(--accent-color)' : 'none'
                                  }} 
                                />
                                <div 
                                  title="Click para tirar la Tirada de Salvación"
                                  onClick={() => handleRoll(`Salvación de ${statDisplay}`, mod + (stat.saveProficient ? character.proficiencyBonus : 0), undefined, stat.id)}
                                  style={{ cursor: 'pointer', flex: 1, display: 'flex' }}
                                >
                                  <span style={{ fontSize: '0.9rem' }}>Tirada de salvación</span>
                                  <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                                    {(() => {
                                      const saveMod = mod + (stat.saveProficient ? character.proficiencyBonus : 0);
                                      return (saveMod > 0 ? '+' : '') + saveMod;
                                    })()}
                                  </span>
                                </div>
                            </div>

                             {statAbilities.map((ability: any) => {
                              const abilityMod = mod + (ability.proficiency ? character.proficiencyBonus : 0);
                            const skillTranslations: { [key: string]: string } = {
                                'Athletics': 'Atletismo',
                                'Acrobatics': 'Acrobacias',
                                'Sleight of Hand': 'Juego de manos',
                                'Stealth': 'Sigilo',
                                'Arcana': 'Conocimiento arcano',
                                'History': 'Historia',
                                'Investigation': 'Investigación',
                                'Nature': 'Naturaleza',
                                'Religion': 'Religión',
                                'Animal Handling': 'Trato con animales',
                                'Insight': 'Perspicacia',
                                'Medicine': 'Medicina',
                                'Perception': 'Percepción',
                                'Survival': 'Supervivencia',
                                'Deception': 'Engaño',
                                'Intimidation': 'Intimidación',
                                'Performance': 'Interpretación',
                                'Persuasion': 'Persuasión'
                            };
                            const displayName = skillTranslations[ability.name] || ability.name;
                            
                            return (
                              <div 
                                key={ability.id} 
                                style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}
                              >
                                <div 
                                  title={ability.proficiency ? "Quitar competencia" : "Añadir competencia"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleProficiencyToggle(ability.id, ability.proficiency);
                                  }}
                                  style={{ 
                                    width: '12px', 
                                    height: '12px', 
                                    borderRadius: '50%', 
                                    background: ability.proficiency ? 'var(--accent-color)' : 'transparent',
                                    border: `2px solid ${ability.proficiency ? 'var(--accent-color)' : 'var(--text-secondary)'}`,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    boxShadow: ability.proficiency ? '0 0 8px var(--accent-color)' : 'none'
                                  }} 
                                />
                                <div 
                                  title={`Click para tirar ${displayName}`}
                                  onClick={() => handleRoll(displayName, abilityMod, ability.id)}
                                  style={{ cursor: 'pointer', flex: 1, display: 'flex', alignItems: 'center' }}
                                >
                                  <span>{displayName}</span>
                                  <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }}>
                                    {abilityMod > 0 ? '+' : ''}{abilityMod}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                          {statAbilities.length === 0 && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>Sin habilidades</div>
                          )}
                      </div>
                  </div>
              );
          })}
        </div>
      )}

      {activeTab === 'bio' && (
         <div className="card">
           <h3>Trasfondo</h3>
           <textarea
             value={character.lore || ''}
             onChange={(e) => handleCharacterUpdate({ lore: e.target.value })}
             placeholder="Escribe el trasfondo de tu personaje aquí..."
             style={{
               width: '100%',
               minHeight: '200px',
               background: 'var(--bg-input)',
               border: '1px solid var(--border-color)',
               color: 'white',
               padding: '1rem',
               borderRadius: '8px',
               resize: 'vertical',
               fontFamily: 'inherit',
               fontSize: '1rem',
               lineHeight: '1.6'
             }}
           />
         </div>
      )}


       <DiceRollModal 
          isOpen={isRollModalOpen}
          onClose={() => setIsRollModalOpen(false)}
          rollName={rollData.name}
          baseRoll={rollData.baseRoll}
          modifier={rollData.modifier}
          total={rollData.total}
       />

    </main>
  );
};

export default CharacterSheet;
