'use client';

import { useState, useCallback } from 'react';

interface CoinTossProps {
  onToss: (results: boolean[]) => void;
  disabled?: boolean;
}

export default function CoinToss({ onToss, disabled }: CoinTossProps) {
  const [coins, setCoins] = useState<boolean[] | null>(null);
  const [flipping, setFlipping] = useState(false);

  const toss = useCallback(() => {
    if (flipping || disabled) return;
    setFlipping(true);
    setCoins(null);

    const results = [Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5];
    const heads = results.filter(Boolean).length;
    const values = ['⚋ ⚋ ⚋', '⚊ ⚋ ⚋', '⚊ ⚊ ⚋', '⚊ ⚊ ⚊'];
    const labels = ['老阴 (6)', '少阳 (7)', '少阴 (8)', '老阳 (9)'];

    setTimeout(() => {
      setCoins(results);
      setFlipping(false);
      onToss(results);
    }, 800);
  }, [flipping, disabled, onToss]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-4" style={{ perspective: '800px' }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: '56px', height: '56px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: 700,
              background: flipping
                ? 'linear-gradient(135deg, #d4a843, #b8922a)'
                : (coins ? (coins[i] ? '#d4a843' : '#8a9bb5') : 'linear-gradient(135deg, #d4a843, #b8922a)'),
              color: '#fff',
              boxShadow: flipping
                ? '0 4px 20px rgba(212,168,67,0.4)'
                : (coins ? '0 2px 8px rgba(0,0,0,0.15)' : '0 4px 20px rgba(212,168,67,0.4)'),
              animation: flipping ? 'coinFlip 0.4s ease-in-out 3' : 'none',
              transition: 'all 0.3s',
            }}
          >
            {flipping ? '?' : (coins ? (coins[i] ? '正' : '反') : '正')}
          </div>
        ))}
        <style>{`
          @keyframes coinFlip {
            0% { transform: rotateY(0deg) scale(1); }
            50% { transform: rotateY(180deg) scale(0.9); }
            100% { transform: rotateY(360deg) scale(1); }
          }
        `}</style>
      </div>

      {!flipping && coins && (
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '12px', color: coins.filter(Boolean).length === 0 ? '#ff6b6b' : 'var(--tx-2)' }}>
            {coins.filter(Boolean).length} 正 {coins.filter(c => !c).length} 反
          </span>
          <span style={{
            fontSize: '12px', fontWeight: 600,
            color: (coins.filter(Boolean).length === 0 || coins.filter(Boolean).length === 3) ? '#ff6b6b' : 'var(--tx-0)',
            padding: '2px 10px', borderRadius: '999px',
            background: (coins.filter(Boolean).length === 0 || coins.filter(Boolean).length === 3) ? '#ff6b6b15' : 'transparent',
          }}>
            {['⚋⚋⚋ 老阴', '⚊⚋⚋ 少阳', '⚊⚊⚋ 少阴', '⚊⚊⚊ 老阳'][coins.filter(Boolean).length]}
          </span>
        </div>
      )}

      <button
        onClick={toss}
        disabled={flipping || disabled}
        style={{
          padding: '10px 28px', cursor: flipping ? 'not-allowed' : 'pointer',
          background: flipping ? 'var(--bdr)' : ac,
          color: '#fff', border: 'none',
          borderRadius: '999px', fontSize: '14px', fontWeight: 600,
          opacity: disabled && !flipping ? 0.5 : 1,
        }}
      >
        {flipping ? '掷筊中...' : '🎲 掷钱'}
      </button>
    </div>
  );
}

const ac = '#d4a843';
