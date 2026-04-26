import React from 'react';

interface DiceRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  rollName: string;
  baseRoll: number;
  modifier: number;
  total: number;
  damageRoll?: {
      total: number;
      baseRoll: number;
      modifier: number;
      dice: number;
  };
  onRollDamage?: () => void;
}

const DiceRollModal: React.FC<DiceRollModalProps> = ({isOpen, onClose, rollName, baseRoll, modifier, total, damageRoll, onRollDamage} : DiceRollModalProps) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{
          width: '350px',
          textAlign: 'center',
          padding: '2rem',
          border: '2px solid var(--accent-color)',
          animation: 'scaleIn 0.2s ease-out'
        }}
      >
        <h2 style={{ fontFamily: 'Cinzel, serif', color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
          {rollName}
        </h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white' }}>
            {total}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Ataque (d20 + {modifier})
          </div>
        </div>

        {damageRoll && (
            <div style={{ 
                margin: '1.5rem 0', 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '8px',
                border: '1px dashed var(--accent-color)'
            }}>
                <div style={{ color: 'var(--accent-color)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Daño Causado
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>
                    {damageRoll.total}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    1d{damageRoll.dice} + {damageRoll.modifier}
                </div>
            </div>
        )}

        {!damageRoll && onRollDamage && (
            <button 
                className="btn-primary" 
                onClick={(e) => { e.stopPropagation(); onRollDamage(); }}
                style={{ marginTop: '1.5rem', width: '100%', background: 'var(--success-color)', borderColor: 'var(--success-color)' }}
            >
                💥 Tirar Daño
            </button>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: damageRoll ? '0' : '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{baseRoll}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Base</div>
          </div>
          <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>+</div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{modifier}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Mod.</div>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={onClose}
          style={{ 
              marginTop: '2rem', 
              width: '100%',
              background: (!damageRoll && onRollDamage) ? 'transparent' : 'var(--accent-color)',
              border: (!damageRoll && onRollDamage) ? '1px solid var(--border-color)' : 'none'
          }}
        >
          {(!damageRoll && onRollDamage) ? 'Cancelar' : 'Cerrar'}
        </button>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default DiceRollModal;
