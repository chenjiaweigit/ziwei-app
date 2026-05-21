import { TRIGRAMS } from '@/lib/nihai';
import type { Hexagram } from '@/lib/nihai';

const ac = '#d4a843';

function YaoBar({ yin, changing, width }: { yin: boolean; changing: boolean; width?: string }) {
  const w = width || '64px';
  const color = changing ? '#ff6b6b' : 'var(--tx-0)';

  if (yin) {
    return (
      <div style={{ width: w, height: '18px', display: 'flex', alignItems: 'center', position: 'relative' }}>
        <div style={{
          flex: 1, height: '3px', borderRadius: '1px', background: color,
        }} />
        <div style={{ width: '10px', flexShrink: 0 }} />
        <div style={{
          flex: 1, height: '3px', borderRadius: '1px', background: color,
        }} />
        {changing && <span style={{ position: 'absolute', right: '-18px', fontSize: '11px', color: '#ff6b6b' }}>✦</span>}
      </div>
    );
  }

  return (
    <div style={{ width: w, height: '18px', display: 'flex', alignItems: 'center', position: 'relative' }}>
      <div style={{
        width: '100%', height: '3px', borderRadius: '1px', background: color,
      }} />
      {changing && <span style={{ position: 'absolute', right: '-18px', fontSize: '11px', color: '#ff6b6b' }}>✦</span>}
    </div>
  );
}

export default function HexagramDisplay({
  hexagram, label, compact,
}: {
  hexagram: Hexagram;
  label?: string;
  compact?: boolean;
}) {
  const upper = TRIGRAMS.find(t => t.name === hexagram.upper);
  const lower = TRIGRAMS.find(t => t.name === hexagram.lower);

  const yaoData = getYaoForTrigram(hexagram.upper, hexagram.lower);

  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: '12px',
      border: `1px solid var(--bdr)`,
      overflow: 'hidden',
    }}>
      {label && (
        <div style={{
          fontSize: '11px', color: ac, padding: '8px 14px',
          borderBottom: '1px solid var(--bdr)',
          background: `${ac}06`, letterSpacing: '0.1em',
        }}>
          {label}
        </div>
      )}
      <div className="flex items-stretch gap-0" style={{ minHeight: compact ? '120px' : '160px' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: compact ? '10px 12px' : '14px 16px',
          gap: '2px',
          borderRight: '1px solid var(--bdr)',
        }}>
          {yaoData.map((line, i) => (
            <div key={i} className="flex items-center" style={{ gap: '8px' }}>
              <span style={{
                fontSize: compact ? '10px' : '11px',
                color: 'var(--tx-3)', width: '22px', textAlign: 'right',
                fontFamily: 'serif',
              }}>
                {line.label}
              </span>
              <YaoBar yin={line.yin} changing={line.changing} width={compact ? '48px' : '64px'} />
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col justify-center px-3 py-3 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span style={{ fontSize: compact ? '16px' : '20px' }}>{upper?.symbol}</span>
            <span style={{ fontSize: compact ? '16px' : '20px' }}>{lower?.symbol}</span>
            <span style={{
              fontSize: compact ? '14px' : '18px', fontWeight: 700,
              color: 'var(--tx-0)', letterSpacing: '0.05em',
            }}>
              {hexagram.name}
            </span>
          </div>
          <div style={{
            fontSize: compact ? '10px' : '11px',
            color: 'var(--tx-3)', marginBottom: '4px',
          }}>
            {hexagram.composition} · 第{hexagram.number}卦
          </div>
          {!compact && (
            <>
              <div style={{
                fontSize: '12px', color: 'var(--tx-2)',
                lineHeight: 1.6, marginBottom: '4px',
              }}>
                {hexagram.meaning}
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
                <span style={{ color: ac }}>倪师解：</span>
                <span style={{ color: 'var(--tx-2)' }}>{hexagram.niInterpretation}</span>
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.6 }}>
                <span style={{ color: ac }}>断辞：</span>
                <span style={{ color: 'var(--tx-2)' }}>{hexagram.divination}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function getYaoForTrigram(upperName: string, lowerName: string) {
  const TRIGRAM_NAMES = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤'];
  const uIdx = TRIGRAM_NAMES.indexOf(upperName);
  const lIdx = TRIGRAM_NAMES.indexOf(lowerName);

  const uBin = 7 - uIdx;
  const lBin = 7 - lIdx;

  const raw: number[] = [];
  for (let i = 0; i < 3; i++) raw.push((lBin >> i) & 1);
  for (let i = 0; i < 3; i++) raw.push((uBin >> i) & 1);

  const POSITION_LABELS = ['初', '二', '三', '四', '五', '上'];
  return raw.map((bit, i) => ({
    label: `${POSITION_LABELS[i]}${bit ? '九' : '六'}`,
    yin: bit === 0,
    changing: false,
  }));
}
