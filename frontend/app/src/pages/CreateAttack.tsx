import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const STAT_LABELS: Record<string, string> = {
  Strength: 'Fuerza',
  Dexterity: 'Destreza',
  Constitution: 'Constitución',
  Intelligence: 'Inteligencia',
  Wisdom: 'Sabiduría',
  Charisma: 'Charisma',
};

const CreateAttack = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const navigate = useNavigate();

  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    damageDice: '8',          // default to d8
    damageCharacteristicId: '',
    damageModifier: 0,
    description: '',
    characteristicId: '',     // attack characteristic
    proficiencyBonus: false,
    modifier: 0,              // attack modifier
  });

  useEffect(() => {
    if (!characterId) return;
    api.getCharacter(parseInt(characterId, 10))
      .then((char) => {
        setCharacter(char);
        // Default damage stat to Strength or first available
        if (char.characteristics && char.characteristics.length > 0) {
            setFormData(prev => ({ 
                ...prev, 
                damageCharacteristicId: String(char.characteristics[0].id),
                characteristicId: String(char.characteristics[0].id) 
            }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [characterId]);

  const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

  // Effective attack bonus = selected stat modifier + (proficiency ? profBonus : 0) + flat modifier
  const getEffectiveBonus = () => {
    if (!character) return formData.modifier;
    let base = 0;
    if (formData.characteristicId) {
      const stat = character.characteristics.find((s: any) => String(s.id) === formData.characteristicId);
      if (stat) base = calculateModifier(stat.score);
    }
    const prof = formData.proficiencyBonus ? (character.proficiencyBonus ?? 0) : 0;
    return base + prof + formData.modifier;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterId) return;
    try {
      await api.createAttack(parseInt(characterId, 10), {
        name: formData.name,
        damageDice: parseInt(formData.damageDice, 10),
        damageModifier: formData.damageModifier,
        damageCharacteristicId: formData.damageCharacteristicId ? parseInt(formData.damageCharacteristicId, 10) : null,
        description: formData.description,
        characteristicId: formData.characteristicId ? parseInt(formData.characteristicId, 10) : null,
        proficiencyBonus: formData.proficiencyBonus,
        modifier: formData.modifier,
      });
      navigate(`/character/${characterId}`);
    } catch (err: any) {
      setError(err.message || 'Error al crear el ataque');
    }
  };

  /* ─────────────────── styles ─────────────────── */
  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.4rem',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: 'white',
    padding: '0.6rem 0.8rem',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
  };

  if (loading) return <div style={{ padding: '2rem', color: 'white' }}>Cargando personaje…</div>;
  if (!character) return <div style={{ padding: '2rem', color: 'white' }}>Personaje no encontrado</div>;

  const effectiveBonus = getEffectiveBonus();

  return (
    <div style={{ padding: '2rem', color: 'white', maxWidth: '680px', margin: '0 auto', paddingBottom: '5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate(`/character/${characterId}`)}
          style={{
            background: 'transparent', border: 'none', color: 'var(--text-secondary)',
            cursor: 'pointer', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex',
            alignItems: 'center', gap: '0.4rem'
          }}
        >
          ← Volver a {character.name}
        </button>
        <h1 style={{ margin: 0, fontSize: '2rem' }}>Nuevo Ataque</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
          Añade un ataque para <strong style={{ color: 'white' }}>{character.name}</strong>
        </p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(220,38,38,0.12)', border: '1px solid #dc2626',
          color: '#f87171', borderRadius: '8px', padding: '0.8rem 1rem', marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

        {/* Name */}
        <div style={cardStyle}>
          <label style={labelStyle}>Nombre del ataque *</label>
          <input
            required
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            placeholder="Ej: Espada larga, Bola de fuego…"
            style={inputStyle}
          />
        </div>

        {/* Modifier section */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Bonificador de impacto
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Característica asociada</label>
            <select
              value={formData.characteristicId}
              onChange={e => setFormData(p => ({ ...p, characteristicId: e.target.value }))}
              style={{ ...inputStyle, backgroundColor: 'var(--bg-input)', cursor: 'pointer' }}
            >
              <option value="">— Sin característica —</option>
              {character.characteristics.map((stat: any) => {
                const mod = calculateModifier(stat.score);
                return (
                  <option key={stat.id} value={stat.id}>
                    {STAT_LABELS[stat.name] ?? stat.name} ({mod >= 0 ? '+' : ''}{mod})
                  </option>
                );
              })}
            </select>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '1rem', userSelect: 'none' }}>
            <div
              onClick={() => setFormData(p => ({ ...p, proficiencyBonus: !p.proficiencyBonus }))}
              style={{
                width: '20px', height: '20px', borderRadius: '4px', flexShrink: 0,
                border: `2px solid ${formData.proficiencyBonus ? 'var(--accent-color)' : 'var(--text-secondary)'}`,
                background: formData.proficiencyBonus ? 'var(--accent-color)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease',
                boxShadow: formData.proficiencyBonus ? '0 0 8px var(--accent-color)' : 'none',
              }}
            >
              {formData.proficiencyBonus && <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold' }}>✓</span>}
            </div>
            <span>
              Añadir bono de competencia
              <span style={{ color: 'var(--text-secondary)', marginLeft: '0.4rem', fontSize: '0.85rem' }}>
                (+{character.proficiencyBonus ?? 0})
              </span>
            </span>
          </label>

          <div>
            <label style={labelStyle}>Modificador adicional</label>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, modifier: p.modifier - 1 }))}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--error-color)',
                  fontSize: '1.4rem', cursor: 'pointer', padding: '0.2rem 0.7rem',
                  fontWeight: 'bold', lineHeight: 1
                }}
              >−</button>
              <span style={{ minWidth: '2.5rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {formData.modifier}
              </span>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, modifier: p.modifier + 1 }))}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--success-color)',
                  fontSize: '1.4rem', cursor: 'pointer', padding: '0.2rem 0.7rem',
                  fontWeight: 'bold', lineHeight: 1
                }}
              >+</button>
            </div>
          </div>

          <div style={{
            marginTop: '1rem', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.04)',
            borderRadius: '8px', borderLeft: '3px solid var(--accent-color)',
            fontSize: '0.9rem', color: 'var(--text-secondary)'
          }}>
            Bono de impacto total:&nbsp;
            <strong style={{ color: 'white', fontSize: '1.1rem' }}>
              {effectiveBonus >= 0 ? '+' : ''}{effectiveBonus}
            </strong>
          </div>
        </div>

        {/* Damage section */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Cálculo de Daño
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Dado de daño</label>
              <select
                value={formData.damageDice}
                onChange={e => setFormData(p => ({ ...p, damageDice: e.target.value }))}
                style={inputStyle}
              >
                <option value="4">1d4</option>
                <option value="6">1d6</option>
                <option value="8">1d8</option>
                <option value="10">1d10</option>
                <option value="12">1d12</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Característica</label>
              <select
                value={formData.damageCharacteristicId}
                onChange={e => setFormData(p => ({ ...p, damageCharacteristicId: e.target.value }))}
                style={inputStyle}
              >
                <option value="">— Ninguna —</option>
                {character.characteristics.map((stat: any) => {
                  const mod = calculateModifier(stat.score);
                  return (
                    <option key={stat.id} value={stat.id}>
                      {STAT_LABELS[stat.name] ?? stat.name} ({mod >= 0 ? '+' : ''}{mod})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Modificador de daño extra</label>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0', background: 'var(--bg-input)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, damageModifier: p.damageModifier - 1 }))}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--error-color)',
                  fontSize: '1.4rem', cursor: 'pointer', padding: '0.2rem 0.7rem',
                  fontWeight: 'bold', lineHeight: 1
                }}
              >−</button>
              <span style={{ minWidth: '2.5rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {formData.damageModifier}
              </span>
              <button
                type="button"
                onClick={() => setFormData(p => ({ ...p, damageModifier: p.damageModifier + 1 }))}
                style={{
                  background: 'transparent', border: 'none', color: 'var(--success-color)',
                  fontSize: '1.4rem', cursor: 'pointer', padding: '0.2rem 0.7rem',
                  fontWeight: 'bold', lineHeight: 1
                }}
              >+</button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={cardStyle}>
          <label style={labelStyle}>Descripción</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            placeholder="Efectos especiales, alcance, notas…"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => navigate(`/character/${characterId}`)}
            style={{
              flex: 1, padding: '0.8rem', background: 'transparent',
              border: '1px solid var(--border-color)', borderRadius: '8px',
              color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem'
            }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn-primary"
            style={{ flex: 2, padding: '0.8rem', fontSize: '1rem', borderRadius: '8px' }}
          >
            Crear ataque
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAttack;
