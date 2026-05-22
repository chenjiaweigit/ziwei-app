import { computeLiuqin, getTodayBranch } from '@/lib/nihai/liuqin';
import type { Hexagram } from '@/lib/nihai';
import type { LineLiuQin } from '@/lib/nihai/liuqin';

const ac = '#d4a843';

const LIUSHEN_COLORS: Record<string, string> = {
  青龙: '#3b82f6',
  朱雀: '#ef4444',
  勾陈: '#8b5cf6',
  腾蛇: '#22c55e',
  白虎: '#f97316',
  玄武: '#6366f1',
};

const LIUQIN_COLORS: Record<string, string> = {
  父母: '#3b82f6',
  兄弟: '#8b5cf6',
  妻财: '#22c55e',
  官鬼: '#ef4444',
  子孙: '#f59e0b',
};

function LiuqinLine({ line }: { line: LineLiuQin }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '2px 0', flexWrap: 'wrap',
    }}>
      {/* 六神 */}
      <span style={{
        fontSize: '10px', color: LIUSHEN_COLORS[line.liuShen] || 'var(--tx-3)',
        fontWeight: 600, width: '24px', textAlign: 'right', flexShrink: 0,
        fontFamily: 'serif',
      }}>
        {line.liuShen}
      </span>

      {/* 爻线示意 */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '0',
        opacity: 0.4, flexShrink: 0,
      }}>
        {line.element === '金' ? <span style={{ color: '#f0d68a' }}>≡</span> :
         line.element === '木' ? <span style={{ color: '#7bc96f' }}>≡</span> :
         line.element === '水' ? <span style={{ color: '#5ba3d9' }}>≡</span> :
         line.element === '火' ? <span style={{ color: '#e8726a' }}>≡</span> :
         <span style={{ color: '#c9a96e' }}>≡</span>}
      </span>

      {/* 六亲 */}
      <span style={{
        fontSize: '11px', color: LIUQIN_COLORS[line.liuqin] || 'var(--tx-2)',
        fontWeight: 600, fontFamily: 'serif', flexShrink: 0,
      }}>
        {line.liuqin}
      </span>

      {/* 地支 */}
      <span style={{
        fontSize: '10px', color: 'var(--tx-3)', fontFamily: 'serif', flexShrink: 0,
      }}>
        {line.gan}{line.branch}
      </span>

      {/* 世应 */}
      {line.isShi && (
        <span style={{
          fontSize: '9px', color: ac, fontWeight: 700, flexShrink: 0,
          background: `${ac}15`, padding: '0 6px', borderRadius: '4px',
        }}>
          世
        </span>
      )}
      {line.isYing && (
        <span style={{
          fontSize: '9px', color: '#8b5cf6', fontWeight: 700, flexShrink: 0,
          background: '#8b5cf615', padding: '0 6px', borderRadius: '4px',
        }}>
          应
        </span>
      )}

      {/* 五行 */}
      <span style={{
        fontSize: '9px', color: 'var(--tx-3)', flexShrink: 0,
      }}>
        ({line.element})
      </span>
    </div>
  );
}

export default function LiuqinPanel({
  hexagram, label, dayBranch,
}: {
  hexagram: Hexagram;
  label?: string;
  dayBranch?: string;
}) {
  const db = dayBranch || getTodayBranch();
  const lines = computeLiuqin(hexagram, db);
  if (!lines.length) return null;

  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: '12px',
      border: `1px solid var(--bdr)`, overflow: 'hidden',
    }}>
      {label && (
        <div style={{
          fontSize: '11px', color: ac, padding: '8px 14px',
          borderBottom: '1px solid var(--bdr)', background: `${ac}06`,
          letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <span>{label}</span>
          <span style={{ fontSize: '9px', color: 'var(--tx-3)', fontWeight: 400 }}>
            日支：{db}
          </span>
        </div>
      )}
      <div style={{
        padding: '10px 14px', display: 'flex', flexDirection: 'column',
        gap: '1px',
      }}>
        {lines.map((line, i) => (
          <LiuqinLine key={i} line={line} />
        ))}
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '4px 12px',
        padding: '8px 14px', borderTop: '1px solid var(--bdr)',
        fontSize: '10px', color: 'var(--tx-3)', fontFamily: 'serif',
      }}>
        {[
          { name: '父母', color: LIUQIN_COLORS['父母'], def: '生我者' },
          { name: '兄弟', color: LIUQIN_COLORS['兄弟'], def: '同我者' },
          { name: '妻财', color: LIUQIN_COLORS['妻财'], def: '我克者' },
          { name: '官鬼', color: LIUQIN_COLORS['官鬼'], def: '克我者' },
          { name: '子孙', color: LIUQIN_COLORS['子孙'], def: '我生者' },
        ].map(r => (
          <span key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ color: r.color, fontWeight: 600 }}>{r.name}</span>
            <span style={{ color: 'var(--tx-3)', fontSize: '9px' }}>{r.def}</span>
          </span>
        ))}
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px' }}>
          世<span style={{ color: ac, fontWeight: 700 }}>·</span>应
        </span>
      </div>
    </div>
  );
}
