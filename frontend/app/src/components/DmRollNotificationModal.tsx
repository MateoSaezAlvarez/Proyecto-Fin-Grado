import React from 'react';

export interface RollNotification {
  id: number;
  characterName: string | null;
  rollName: string | null;
  rollType?: string | null;
  baseRoll: number | null;
  modifier: number | null;
  total: number;
  rollDate: string;
}

interface Props {
  notification: RollNotification | null;
  onClose: () => void;
}

const DmRollNotificationModal: React.FC<Props> = ({ notification, onClose }) => {
  if (!notification) return null;

  const isCrit   = notification.baseRoll === 20;
  const isFumble = notification.baseRoll === 1;
  const accentColor = isCrit ? '#ffd700' : isFumble ? 'var(--danger-color)' : 'var(--accent-color)';
  const mod = notification.modifier ?? 0;
  const modLabel = mod >= 0 ? `+${mod}` : `${mod}`;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1100,
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: '380px',
          textAlign: 'center',
          padding: '2rem',
          border: `2px solid ${accentColor}`,
          boxShadow: `0 0 50px ${isCrit ? 'rgba(255,215,0,0.25)' : isFumble ? 'rgba(220,38,38,0.25)' : 'rgba(139,92,246,0.25)'}`,
          animation: 'dmRollIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Banner */}
        <div style={{
          display: 'inline-block',
          fontSize: '0.65rem',
          fontWeight: 800,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: accentColor,
          border: `1px solid ${accentColor}`,
          borderRadius: '4px',
          padding: '0.15rem 0.6rem',
          marginBottom: '1.25rem',
        }}>
          Tirada del jugador
        </div>

        {/* Nombre del personaje */}
        <h2 style={{
          fontFamily: 'Cinzel, serif',
          color: 'white',
          fontSize: '1.5rem',
          margin: '0 0 0.25rem',
        }}>
          {notification.characterName ?? '—'}
        </h2>

        {/* Categoría de la tirada */}
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          {notification.rollName ?? 'Tirada'}
        </div>

        {/* Crítico / pifia */}
        {isCrit && (
          <div style={{ color: '#ffd700', fontFamily: 'Cinzel, serif', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            ¡Un 20 natural! ¡Eso es un crítico!
          </div>
        )}
        {isFumble && (
          <div style={{ color: 'var(--danger-color)', fontFamily: 'Cinzel, serif', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            ¡Oh oh, has sacado un 1! ¡Pifia!
          </div>
        )}

        {/* Total de la tirada */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{
            fontSize: '4.5rem',
            fontWeight: 900,
            lineHeight: 1,
            fontFamily: 'Cinzel, serif',
            color: accentColor,
          }}>
            {notification.total}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Resultado Total
          </div>
        </div>

        {/* Desglose de la tirada */}
        {notification.baseRoll !== null && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.9rem',
            borderTop: '1px solid var(--border-color)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0',
            marginBottom: '1.25rem',
          }}>
            {/* d20 */}
            <div style={{ textAlign: 'center', minWidth: '48px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: accentColor }}>
                {notification.baseRoll}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                d20
              </div>
            </div>

            <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: 300 }}>+</div>

            {/* Modificador */}
            <div style={{ textAlign: 'center', minWidth: '48px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                {modLabel}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                mod
              </div>
            </div>

            <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: 300 }}>=</div>

            {/* Total */}
            <div style={{ textAlign: 'center', minWidth: '48px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
                {notification.total}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                total
              </div>
            </div>
          </div>
        )}


        <button className="btn-primary" onClick={onClose} style={{ width: '100%' }}>
          Entendido
        </button>
      </div>

      <style>{`
        @keyframes dmRollIn {
          from { transform: scale(0.75) translateY(-20px); opacity: 0; }
          to   { transform: scale(1)    translateY(0);     opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DmRollNotificationModal;
