import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useParams } from 'react-router-dom';
import DiceRollModal from '../components/DiceRollModal';

const CharacterSheet = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('core');
  
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{character.name}</h1>
          <div style={{ color: 'var(--text-secondary)' }}>
            Level {character.level} {character.classSubclass}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>HP</div>
          <div style={{ fontSize: '2rem', color: 'var(--success-color)' }}>{character.hitPoints} / {character.hitPoints}</div>
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
                            title="Click para tirar la Tirada de Salvación"
                            onClick={() => handleRoll(`Salvación de ${statDisplay}`, mod + (stat.saveProficient ? character.proficiencyBonus : 0), undefined, stat.id)}
                            style={{ display: 'flex', alignItems: 'center', padding: '0.2rem 0', opacity: 0.8, cursor: 'pointer' }}
                          >
                              <div style={{ 
                                width: '8px', 
                                height: '8px', 
                                borderRadius: '50%', 
                                background: stat.saveProficient ? 'var(--accent-color)' : 'var(--bg-input)',
                                border: '1px solid var(--text-secondary)',
                                marginRight: '0.5rem'
                              }} />
                              <span style={{ fontSize: '0.9rem' }}>Tirada de salvación</span>
                              <span style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                                {(() => {
                                   const saveMod = mod + (stat.saveProficient ? character.proficiencyBonus : 0);
                                   return (saveMod > 0 ? '+' : '') + saveMod;
                                })()}
                              </span>
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
                                title={`Click para tirar ${displayName}`}
                                onClick={() => handleRoll(displayName, abilityMod, ability.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
                              >
                                <div style={{ 
                                  width: '8px', 
                                  height: '8px', 
                                  borderRadius: '50%', 
                                  background: ability.proficiency ? 'var(--accent-color)' : 'var(--bg-input)',
                                  border: '1px solid var(--text-secondary)'
                                }} />
                                <span>{displayName}</span>
                                <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }}>
                                  {abilityMod > 0 ? '+' : ''}{abilityMod}
                                </span>
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
           <p>{character.lore || 'No hay trasfondo escrito todavia...'}</p>
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
