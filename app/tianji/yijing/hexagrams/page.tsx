'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { HEXAGRAMS, TRIGRAMS } from '@/lib/nihai';
import type { Trigram } from '@/lib/nihai';

const ac = '#d4a843';

const ELEMENTS = ['金', '木', '水', '火', '土'];
const ELEM_COLORS: Record<string, string> = { '金': '#f0d68a', '木': '#7bc96f', '水': '#5ba3d9', '火': '#e8726a', '土': '#c9a96e' };

function trigramSymbol(name: string): string {
  return TRIGRAMS.find(t => t.name === name)?.symbol || '';
}

export default function HexagramsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filterUpper, setFilterUpper] = useState('');
  const [filterLower, setFilterLower] = useState('');
  const [filterElem, setFilterElem] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return HEXAGRAMS.filter(h => {
      if (filterUpper && h.upper !== filterUpper) return false;
      if (filterLower && h.lower !== filterLower) return false;
      if (filterElem) {
        const uElem = TRIGRAMS.find(t => t.name === h.upper)?.element;
        const lElem = TRIGRAMS.find(t => t.name === h.lower)?.element;
        if (uElem !== filterElem && lElem !== filterElem) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!h.name.includes(q) && !h.composition.includes(q) && !h.meaning.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [filterUpper, filterLower, filterElem, search]);

  const cardBg = isDark ? 'rgba(255,255,255,0.04)' : 'white';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <div className="max-w-5xl mx-auto px-6 pt-4 pb-24">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Link href="/tianji/yijing" style={{ fontSize: '12px', color: 'var(--tx-3)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>‹</span> 返回易经
          </Link>
          <div style={{ width: '1px', height: '16px', background: 'var(--bdr)' }} />
          <span style={{ fontSize: '12px', color: ac, letterSpacing: '0.1em' }}>六十四卦</span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索卦名、卦象、卦辞…"
            style={{
              width: '100%', padding: '12px 16px', fontSize: '14px',
              background: cardBg, border: `1px solid var(--bdr)`,
              borderRadius: '12px', color: 'var(--tx-0)', outline: 'none',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
          <FilterChip label="上卦" current={filterUpper} onChange={setFilterUpper} options={TRIGRAMS.map(t => ({ value: t.name, label: `${t.symbol} ${t.name}` }))} />
          <FilterChip label="下卦" current={filterLower} onChange={setFilterLower} options={TRIGRAMS.map(t => ({ value: t.name, label: `${t.symbol} ${t.name}` }))} />
          <FilterChip label="五行" current={filterElem} onChange={setFilterElem} options={ELEMENTS.map(e => ({ value: e, label: e }))} />
          {(filterUpper || filterLower || filterElem || search) && (
            <button
              onClick={() => { setFilterUpper(''); setFilterLower(''); setFilterElem(''); setSearch(''); }}
              style={{ fontSize: '11px', color: 'var(--tx-3)', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px' }}
            >清除筛选</button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
          {filtered.map(h => {
            const uSym = trigramSymbol(h.upper);
            const lSym = trigramSymbol(h.lower);
            const uElem = TRIGRAMS.find(t => t.name === h.upper)?.element || '';
            const lElem = TRIGRAMS.find(t => t.name === h.lower)?.element || '';
            return (
              <Link
                key={h.number}
                href={`/tianji/yijing/hexagrams/${h.number}`}
                style={{
                  display: 'block', textDecoration: 'none', padding: '12px',
                  background: cardBg, border: '1px solid var(--bdr)',
                  borderRadius: '10px', transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ac; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bdr)'; }}
              >
                <div style={{ fontSize: '11px', color: 'var(--tx-3)', marginBottom: '4px' }}>
                  #{h.number}
                </div>
                <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                  {uSym}{lSym}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '2px' }}>
                  {h.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--tx-3)', marginBottom: '4px' }}>
                  {h.composition}
                </div>
                <div style={{ display: 'flex', gap: '3px' }}>
                  <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: `${ELEM_COLORS[uElem]}20`, color: uElem }}>{uElem}</span>
                  <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', background: `${ELEM_COLORS[lElem]}20`, color: lElem }}>{lElem}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--tx-3)', fontSize: '13px' }}>
            无匹配卦象
          </div>
        )}

        <div style={{ fontSize: '11px', color: 'var(--tx-3)', textAlign: 'center', marginTop: '16px' }}>
          {filtered.length} / {HEXAGRAMS.length} 卦
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, current, onChange, options }: {
  label: string;
  current: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '6px 14px', fontSize: '12px', cursor: 'pointer',
          background: current ? `${ac}15` : 'var(--bg-card)',
          border: `1px solid ${current ? ac : 'var(--bdr)'}`,
          borderRadius: '999px', color: current ? ac : 'var(--tx-2)',
          fontWeight: current ? 600 : 400,
        }}
      >
        {current ? `${label}: ${current}` : label}
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: '100%', left: 0, marginTop: '4px', zIndex: 100,
            background: 'var(--bg-card)', border: '1px solid var(--bdr)',
            borderRadius: '10px', padding: '6px', minWidth: '120px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          }}>
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value === current ? '' : opt.value); setOpen(false); }}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '6px 10px',
                  fontSize: '12px', cursor: 'pointer', border: 'none', borderRadius: '6px',
                  background: opt.value === current ? `${ac}15` : 'transparent',
                  color: opt.value === current ? ac : 'var(--tx-2)',
                  fontWeight: opt.value === current ? 600 : 400,
                }}
              >{opt.label}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
