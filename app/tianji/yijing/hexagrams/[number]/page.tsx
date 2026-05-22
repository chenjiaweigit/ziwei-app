import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HEXAGRAMS, TRIGRAMS } from '@/lib/nihai';
import LiuqinPanel from '@/components/tianji/LiuqinPanel';

export function generateStaticParams() {
  return HEXAGRAMS.map(h => ({ number: String(h.number) }));
}

const ELEM_COLORS: Record<string, string> = { '金': '#f0d68a', '木': '#7bc96f', '水': '#5ba3d9', '火': '#e8726a', '土': '#c9a76e' };
const ac = '#d4a843';

export default async function HexagramDetailPage(props: { params: Promise<{ number: string }> }) {
  const params = await props.params;
  const num = parseInt(params.number);
  const h = HEXAGRAMS.find(h => h.number === num);
  if (!h) notFound();

  const upper = TRIGRAMS.find(t => t.name === h.upper);
  const lower = TRIGRAMS.find(t => t.name === h.lower);
  const uElem = upper?.element || '';
  const lElem = lower?.element || '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <div className="max-w-2xl mx-auto px-6 pt-4 pb-24">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Link href="/tianji/yijing/hexagrams" style={{ fontSize: '12px', color: 'var(--tx-3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>‹</span> 六十四卦
          </Link>
          <div style={{ width: '1px', height: '16px', background: 'var(--bdr)' }} />
          <span style={{ fontSize: '12px', color: ac, letterSpacing: '0.1em' }}>#{h.number} {h.name}</span>
        </div>

        <div style={{
          background: 'var(--bg-card)', borderRadius: '16px',
          border: '1px solid var(--bdr)', overflow: 'hidden', marginBottom: '20px',
        }}>
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>
              {upper?.symbol}{lower?.symbol}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--tx-0)', marginBottom: '4px' }}>
              {h.name}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--tx-3)', marginBottom: '12px' }}>
              {h.composition} · 第{h.number}卦
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
              {upper && (
                <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '999px', background: `${ELEM_COLORS[uElem]}15`, color: uElem }}>
                  {upper.symbol} {upper.name} · {upper.attribute} · {upper.element}
                </span>
              )}
              {lower && (
                <span style={{ fontSize: '11px', padding: '2px 10px', borderRadius: '999px', background: `${ELEM_COLORS[lElem]}15`, color: lElem }}>
                  {lower.symbol} {lower.name} · {lower.attribute} · {lower.element}
                </span>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--bdr)', padding: '20px 24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--tx-3)', marginBottom: '6px' }}>卦辞</div>
              <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--tx-0)' }}>{h.meaning}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--tx-3)', marginBottom: '6px' }}>倪师解</div>
              <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--tx-2)' }}>{h.niInterpretation}</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', letterSpacing: '0.3em', color: 'var(--tx-3)', marginBottom: '6px' }}>断辞</div>
              <div style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--tx-2)' }}>{h.divination}</div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <LiuqinPanel hexagram={h} label="六神·六亲·纳甲" />
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/tianji/yijing/divine" style={{
            display: 'inline-block', padding: '10px 24px', textDecoration: 'none',
            background: ac, color: '#fff', borderRadius: '999px', fontSize: '13px', fontWeight: 600,
          }}>
            去占卜
          </Link>
        </div>
      </div>
    </div>
  );
}
