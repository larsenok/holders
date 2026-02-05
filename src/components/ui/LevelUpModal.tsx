type Props = {
  rank: number
  onClose: () => void
}

export default function LevelUpModal({ rank, onClose }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        background: 'linear-gradient(135deg, #facc15, #eab308)',
        border: '4px solid #92400e',
        padding: '2rem 3rem',
        borderRadius: '0.75rem',
        boxShadow: '0 0 12px rgba(0,0,0,0.5)',
        textAlign: 'center',
        fontFamily: 'monospace',
        color: '#78350f',
        fontWeight: 700,
        fontSize: '22px',
        maxWidth: '90vw',
        width: '420px',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        You Leveled Up!
        <br />
        Guild Rank: {rank}
      </div>

      <button
        onClick={onClose}
        style={{
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #92400e, #78350f)',
          border: '2px solid #451a03',
          borderRadius: '6px',
          color: '#fef3c7',
          cursor: 'pointer',
          boxShadow: '0 3px 0 rgba(0,0,0,0.4)',
        }}
      >
        Close
      </button>
    </div>
  )
}
