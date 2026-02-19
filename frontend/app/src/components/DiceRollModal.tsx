import React from 'react';

interface DiceRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  rollName: string;
  baseRoll: number;
  modifier: number;
  total: number;
}

const DiceRollModal: React.FC<DiceRollModalProps> = ({ isOpen, onClose, rollName, baseRoll, modifier, total }) => {
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
          width: '300px',
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
            Total Result
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{baseRoll}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>d20</div>
          </div>
          <div style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>+</div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{modifier}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Modifier</div>
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={onClose}
          style={{ marginTop: '2rem', width: '100%' }}
        >
          Close
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
