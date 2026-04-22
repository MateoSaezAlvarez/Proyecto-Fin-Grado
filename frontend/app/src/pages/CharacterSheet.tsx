import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import DiceRollModal from '../components/DiceRollModal';

const STAT_LABELS: Record<string, string> = {
  Strength: 'Fuerza',
  Dexterity: 'Destreza',
  Constitution: 'Constitución',
  Intelligence: 'Inteligencia',
  Wisdom: 'Sabiduría',
  Charisma: 'Carisma',
};

const CharacterSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('core');
  const [currentHp, setCurrentHp] = useState<number>(0);

  // Dice Roll State
  const [isRollModalOpen, setIsRollModalOpen] = useState(false);
  const [rollData, setRollData] = useState({ name: '', baseRoll: 0, modifier: 0, total: 0 });

  // Attack editing state: attackId -> partial data being edited
  const [editingAttacks, setEditingAttacks] = useState<Record<number, any>>({});

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) return;
      try {
        const data = await api.getCharacter(parseInt(id, 10));
        setCharacter(data);
        setCurrentHp(data.hitPoints);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [id]);

  const handleStatChange = async (statName: string, value: number) => {
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
    setCharacter((prev: any) => ({ ...prev, ...updates }));
    try {
      await api.updateCharacter(character.id, updates);
    } catch (err) {
      console.error('Failed to update character', err);
    }
  };

  const handleProficiencyToggle = async (abilityId: number, currentProficiency: boolean) => {
    const newProficiency = !currentProficiency;
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

  const handleRoll = async (name: string, modifier: number, abilityId?: number, characteristicId?: number, attackId?: number) => {
    const baseRoll = Math.floor(Math.random() * 20) + 1;
    const total = baseRoll + modifier;
    setRollData({ name, baseRoll, modifier, total });
    setIsRollModalOpen(true);
    try {
      await api.submitRoll({
        campaignId: character.campaign.id,
        abilityId,
        characteristicId,
        attackId,
        rollValue: total,
        dice: 20
      });
    } catch (err) {
      console.error('Failed to upload roll', err);
    }
  };

  /* ─── Attack helpers ─── */

  const getAttackEdit = (attack: any) =>
    editingAttacks[attack.id] ?? {
      name: attack.name,
      damage: attack.damage,
      description: attack.description ?? '',
      characteristicId: attack.characteristicId ? String(attack.characteristicId) : '',
      proficiencyBonus: attack.proficiencyBonus ?? false,
      modifier: attack.modifier ?? 0,
    };

  const patchAttackEdit = (attackId: number, patch: any) => {
    setEditingAttacks(prev => ({
      ...prev,
      [attackId]: { ...getAttackEdit({ id: attackId, ...character.attacks.find((a: any) => a.id === attackId) }), ...patch }
    }));
  };

  const saveAttack = async (attackId: number) => {
    const draft = editingAttacks[attackId];
    if (!draft) return;
    const payload = {
      ...draft,
      modifier: Number(draft.modifier),
      characteristicId: draft.characteristicId ? parseInt(draft.characteristicId, 10) : null,
    };
    // Optimistic update
    setCharacter((prev: any) => ({
      ...prev,
      attacks: prev.attacks.map((a: any) => a.id === attackId ? { ...a, ...payload } : a)
    }));
    try {
      await api.updateAttack(attackId, payload);
    } catch (err) {
      console.error('Failed to save attack', err);
    }
  };

  const deleteAttack = async (attackId: number) => {
    if (!window.confirm('¿Eliminar este ataque?')) return;
    setCharacter((prev: any) => ({
      ...prev,
      attacks: prev.attacks.filter((a: any) => a.id !== attackId)
    }));
    try {
      await api.deleteAttack(attackId);
    } catch (err) {
      console.error('Failed to delete attack', err);
    }
  };

  const getAttackBonus = (attack: any) => {
    const edit = editingAttacks[attack.id];
    const current = edit ?? attack;
    let base = 0;
    if (current.characteristicId && character) {
      const stat = character.characteristics.find((s: any) => s.id === parseInt(current.characteristicId, 10));
      if (stat) base = calculateModifier(stat.score);
    }
    const prof = current.proficiencyBonus ? (character?.proficiencyBonus ?? 0) : 0;
    return base + prof + Number(current.modifier ?? 0);
  };

  /* ─── Shared input style ─── */
  const inlineInputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid transparent',
    color: 'white',
    outline: 'none',
    fontSize: '1rem',
    width: '100%',
  };

  const addAttackBtn = (
    <button
      onClick={() => navigate(`/character/${id}/create-attack`)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: 'transparent',
        border: '2px dashed var(--border-color)',
        borderRadius: '10px',
        color: 'var(--text-secondary)',
        padding: '0.7rem 1.2rem',
        cursor: 'pointer',
        fontSize: '0.95rem',
        transition: 'all 0.2s ease',
        marginTop: '0.5rem',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-color)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-color)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-color)';
        (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
      }}
    >
      <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>+</span>
      Añadir ataque
    </button>
  );

  if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Loading Character Sheet...</div>;
  if (!character) return <div style={{ padding: '2rem', color: 'white' }}>Character not found</div>;

  return (
    <main style={{ padding: '2rem', width: '100%', overflowY: 'auto', backgroundColor: '#1e1e1e', height: '100%' }}>

      {/* Header Section */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem'
      }}>
        <div>
          <input
            type="text"
            value={character.name}
            onChange={(e) => handleCharacterUpdate({ name: e.target.value })}
            style={{
              fontSize: '2.5rem', fontWeight: 'bold', background: 'transparent',
              border: 'none', borderBottom: '1px solid transparent', color: 'white',
              width: '100%', marginBottom: '0.5rem', outline: 'none'
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
                background: 'transparent', border: '1px solid transparent',
                borderBottom: '1px solid var(--border-color)', color: 'white',
                width: '40px', textAlign: 'center', fontSize: '1rem'
              }}
            />
            <input
              type="text"
              value={character.classSubclass}
              onChange={(e) => handleCharacterUpdate({ classSubclass: e.target.value })}
              style={{
                background: 'transparent', border: '1px solid transparent',
                borderBottom: '1px solid var(--border-color)', color: 'white',
                fontSize: '1rem', flex: 1
              }}
            />
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem',
              padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)'
            }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Bono Comp.</span>
              <input
                type="number"
                value={character.proficiencyBonus}
                onChange={(e) => handleCharacterUpdate({ proficiencyBonus: parseInt(e.target.value) || 0 })}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--accent-color)',
                  width: '35px', textAlign: 'center', fontSize: '1rem', fontWeight: 'bold', outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Vida (Puntos de Golpe)</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.8rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)',
              borderRadius: '12px', padding: '0.3rem 0.6rem',
              border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}>
              <button onClick={() => setCurrentHp(prev => Math.max(0, prev - 1))} style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.4rem', fontWeight: 'bold' }}>−</button>
              <input
                type="number" value={currentHp}
                onChange={(e) => setCurrentHp(parseInt(e.target.value) || 0)}
                title="Vida Actual"
                style={{ background: 'transparent', border: 'none', color: 'white', width: '45px', textAlign: 'center', fontSize: '1.6rem', fontWeight: 'bold', outline: 'none' }}
              />
              <button onClick={() => setCurrentHp(prev => Math.min(character.hitPoints + 100, prev + 1))} style={{ background: 'transparent', border: 'none', color: 'var(--success-color)', fontSize: '1.2rem', cursor: 'pointer', padding: '0 0.4rem', fontWeight: 'bold' }}>+</button>
            </div>
            <span style={{ fontSize: '1.5rem', opacity: 0.3, fontWeight: 'light' }}>/</span>
            <div style={{ position: 'relative' }} title="Vida Máxima">
              <input
                type="number" value={character.hitPoints}
                onChange={(e) => handleCharacterUpdate({ hitPoints: parseInt(e.target.value) || 0 })}
                style={{
                  background: 'transparent', border: 'none', borderBottom: '2px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.6)', width: '60px', textAlign: 'left',
                  fontSize: '1.6rem', fontWeight: 'bold', outline: 'none', padding: '0'
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
          { id: 'ataques', label: 'Ataques' },
          { id: 'bio', label: 'Historia' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${activeTab === tab.id ? 'var(--accent-color)' : 'var(--border-color)'}`,
              padding: '0.5rem 2rem',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
            {tab.id === 'ataques' && character.attacks?.length > 0 && (
              <span style={{
                marginLeft: '0.5rem', background: 'rgba(255,255,255,0.2)',
                borderRadius: '10px', padding: '0 0.4rem', fontSize: '0.75rem'
              }}>
                {character.attacks.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Estadísticas tab ─── */}
      {activeTab === 'core' && (
        <div className="grid-cols-2" style={{ gap: '2rem' }}>
          {Object.entries({
            'Strength': 'Fuerza', 'Dexterity': 'Destreza', 'Constitution': 'Constitución',
            'Intelligence': 'Inteligencia', 'Wisdom': 'Sabiduría', 'Charisma': 'Carisma'
          }).map(([statKey, statDisplay]) => {
            const stat = character.characteristics.find((s: any) => s.name === statKey);
            if (!stat) return null;
            const mod = calculateModifier(stat.score);
            const statAbilities = character.characteristics
              .flatMap((s: any) => s.abilities)
              .filter((a: any) => a.characteristicId === stat.id);

            return (
              <div key={stat.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'default' }}>
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
                      type="number" value={stat.score}
                      onChange={(e) => handleStatChange(stat.name, parseInt(e.target.value))}
                      style={{
                        background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                        color: 'white', textAlign: 'center', fontSize: '1.2rem',
                        width: '50px', padding: '0.2rem', borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0.2rem 0', opacity: 0.8 }}>
                    <div
                      title={stat.saveProficient ? 'Quitar competencia' : 'Añadir competencia'}
                      onClick={(e) => { e.stopPropagation(); handleSaveProficiencyToggle(stat.name, stat.saveProficient); }}
                      style={{
                        width: '12px', height: '12px', borderRadius: '50%',
                        background: stat.saveProficient ? 'var(--accent-color)' : 'transparent',
                        border: `2px solid ${stat.saveProficient ? 'var(--accent-color)' : 'var(--text-secondary)'}`,
                        marginRight: '0.8rem', cursor: 'pointer', transition: 'all 0.2s ease',
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
                        {(() => { const m = mod + (stat.saveProficient ? character.proficiencyBonus : 0); return (m > 0 ? '+' : '') + m; })()}
                      </span>
                    </div>
                  </div>
                  {statAbilities.map((ability: any) => {
                    const abilityMod = mod + (ability.proficiency ? character.proficiencyBonus : 0);
                    const skillTranslations: { [key: string]: string } = {
                      'Athletics': 'Atletismo', 'Acrobatics': 'Acrobacias', 'Sleight of Hand': 'Juego de manos',
                      'Stealth': 'Sigilo', 'Arcana': 'Conocimiento arcano', 'History': 'Historia',
                      'Investigation': 'Investigación', 'Nature': 'Naturaleza', 'Religion': 'Religión',
                      'Animal Handling': 'Trato con animales', 'Insight': 'Perspicacia', 'Medicine': 'Medicina',
                      'Perception': 'Percepción', 'Survival': 'Supervivencia', 'Deception': 'Engaño',
                      'Intimidation': 'Intimidación', 'Performance': 'Interpretación', 'Persuasion': 'Persuasión'
                    };
                    const displayName = skillTranslations[ability.name] || ability.name;
                    return (
                      <div key={ability.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <div
                          title={ability.proficiency ? 'Quitar competencia' : 'Añadir competencia'}
                          onClick={(e) => { e.stopPropagation(); handleProficiencyToggle(ability.id, ability.proficiency); }}
                          style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: ability.proficiency ? 'var(--accent-color)' : 'transparent',
                            border: `2px solid ${ability.proficiency ? 'var(--accent-color)' : 'var(--text-secondary)'}`,
                            cursor: 'pointer', transition: 'all 0.2s ease',
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

      {/* ─── Ataques tab ─── */}
      {activeTab === 'ataques' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>

          {/* Empty state */}
          {(!character.attacks || character.attacks.length === 0) && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', minHeight: '300px', gap: '1rem'
            }}>
              <div style={{ fontSize: '3rem', opacity: 0.2 }}>⚔️</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                Este personaje aún no tiene ataques registrados
              </div>
              <button
                onClick={() => navigate(`/character/${id}/create-attack`)}
                className="btn-primary"
                style={{ padding: '0.8rem 2rem', fontSize: '1rem', borderRadius: '8px' }}
              >
                + Añadir primer ataque
              </button>
            </div>
          )}

          {/* Attack list */}
          {character.attacks?.map((attack: any) => {
            const edit = getAttackEdit(attack);
            const bonus = getAttackBonus(attack);

            return (
              <div
                key={attack.id}
                className="card"
                style={{ marginBottom: '1rem', cursor: 'default', position: 'relative' }}
              >
                {/* Row 1: Name + bonus badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
                  <input
                    value={edit.name}
                    onChange={e => patchAttackEdit(attack.id, { name: e.target.value })}
                    style={{
                      ...inlineInputStyle,
                      fontSize: '1.2rem', fontWeight: 'bold', flex: 1,
                    }}
                    onFocus={e => e.target.style.borderBottom = '1px solid var(--accent-color)'}
                    onBlur={e => {
                      e.target.style.borderBottom = '1px solid transparent';
                      if (editingAttacks[attack.id]) saveAttack(attack.id);
                    }}
                  />

                  {/* Hit badge */}
                  <div 
                    title="Click para tirar impacto"
                    onClick={() => handleRoll(edit.name, bonus, undefined, undefined, attack.id)}
                    style={{
                      background: 'rgba(255,255,255,0.08)', borderRadius: '8px',
                      padding: '0.3rem 0.8rem', fontSize: '0.9rem', whiteSpace: 'nowrap',
                      color: 'var(--accent-color)', fontWeight: 'bold', cursor: 'pointer'
                    }}
                  >
                    Impacto: {bonus >= 0 ? '+' : ''}{bonus}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteAttack(attack.id)}
                    title="Eliminar ataque"
                    style={{
                      background: 'transparent', border: 'none', color: 'var(--error-color)',
                      cursor: 'pointer', fontSize: '1.1rem', opacity: 0.6, padding: '0.2rem 0.4rem',
                      transition: 'opacity 0.15s'
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
                  >
                    ✕
                  </button>
                </div>

                {/* Row 2: Damage + stat + proficiency + flat mod */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.8rem' }}>

                  {/* Damage */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Daño</div>
                    <input
                      value={edit.damage}
                      onChange={e => patchAttackEdit(attack.id, { damage: e.target.value })}
                      onFocus={e => e.target.style.borderBottom = '1px solid var(--accent-color)'}
                      onBlur={e => {
                        e.target.style.borderBottom = '1px solid transparent';
                        if (editingAttacks[attack.id]) saveAttack(attack.id);
                      }}
                      style={{ ...inlineInputStyle, fontSize: '1rem' }}
                      placeholder="1d8+3"
                    />
                  </div>

                  {/* Stat */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Característica</div>
                    <select
                      value={edit.characteristicId}
                      onChange={e => {
                        patchAttackEdit(attack.id, { characteristicId: e.target.value });
                        setTimeout(() => saveAttack(attack.id), 0);
                      }}
                      style={{
                        background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                        borderRadius: '6px', color: 'white', fontSize: '0.9rem',
                        padding: '0.3rem 0.5rem', width: '100%', cursor: 'pointer'
                      }}
                    >
                      <option value="">— Ninguna —</option>
                      {character.characteristics.map((stat: any) => {
                        const m = calculateModifier(stat.score);
                        return (
                          <option key={stat.id} value={stat.id}>
                            {STAT_LABELS[stat.name] ?? stat.name} ({m >= 0 ? '+' : ''}{m})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Proficiency toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      onClick={() => {
                        const newVal = !edit.proficiencyBonus;
                        patchAttackEdit(attack.id, { proficiencyBonus: newVal });
                        setTimeout(() => saveAttack(attack.id), 0);
                      }}
                      style={{
                        width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0,
                        border: `2px solid ${edit.proficiencyBonus ? 'var(--accent-color)' : 'var(--text-secondary)'}`,
                        background: edit.proficiencyBonus ? 'var(--accent-color)' : 'transparent',
                        cursor: 'pointer', transition: 'all 0.15s ease',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: edit.proficiencyBonus ? '0 0 6px var(--accent-color)' : 'none',
                      }}
                    >
                      {edit.proficiencyBonus && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 'bold' }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Competencia (+{character.proficiencyBonus ?? 0})
                    </span>
                  </div>

                  {/* Flat modifier counter */}
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>Mod. adicional</div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-input)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                      <button
                        type="button"
                        onClick={() => {
                          patchAttackEdit(attack.id, { modifier: (edit.modifier ?? 0) - 1 });
                          setTimeout(() => saveAttack(attack.id), 0);
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--error-color)', fontSize: '1.1rem', cursor: 'pointer', padding: '0.1rem 0.5rem', fontWeight: 'bold', lineHeight: 1 }}
                      >−</button>
                      <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 'bold' }}>{edit.modifier ?? 0}</span>
                      <button
                        type="button"
                        onClick={() => {
                          patchAttackEdit(attack.id, { modifier: (edit.modifier ?? 0) + 1 });
                          setTimeout(() => saveAttack(attack.id), 0);
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'var(--success-color)', fontSize: '1.1rem', cursor: 'pointer', padding: '0.1rem 0.5rem', fontWeight: 'bold', lineHeight: 1 }}
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* Row 3: Description */}
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.3rem' }}>Descripción</div>
                  <textarea
                    value={edit.description}
                    onChange={e => patchAttackEdit(attack.id, { description: e.target.value })}
                    onBlur={() => { if (editingAttacks[attack.id]) saveAttack(attack.id); }}
                    rows={2}
                    placeholder="Efectos especiales, alcance, notas…"
                    style={{
                      width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                      borderRadius: '6px', color: 'white', padding: '0.5rem 0.7rem',
                      fontSize: '0.9rem', resize: 'vertical', lineHeight: '1.4',
                      outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Add-below button (only if there are attacks already) */}
          {character.attacks?.length > 0 && addAttackBtn}
        </div>
      )}

      {/* ─── Historia tab ─── */}
      {activeTab === 'bio' && (
        <div className="card">
          <h3>Trasfondo</h3>
          <textarea
            value={character.lore || ''}
            onChange={(e) => handleCharacterUpdate({ lore: e.target.value })}
            placeholder="Escribe el trasfondo de tu personaje aquí..."
            style={{
              width: '100%', minHeight: '200px', background: 'var(--bg-input)',
              border: '1px solid var(--border-color)', color: 'white',
              padding: '1rem', borderRadius: '8px', resize: 'vertical',
              fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.6'
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
