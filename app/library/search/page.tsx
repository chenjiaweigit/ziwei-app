/**
 * 古籍搜索页
 */
'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchClassics, type SearchHit } from '@/lib/classics';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchHit[]>([]);

  useEffect(() => {
    if (!q) { setResults([]); return; }
    setResults(searchClassics(q));
  }, [q]);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 古籍库
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          搜索结果
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '16px', letterSpacing: '0.1em' }}>
          搜索: {q}
        </h1>
        {results.length === 0 ? (
          <p style={{ color: 'var(--tx-3)', fontSize: '13px' }}>没有找到相关结果</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {results.map((r, i) => (
              <Link
                key={i}
                href={`/library/${r.bookSlug}/${r.chapterIdx}`}
                style={{
                  display: 'block',
                  padding: '14px 18px',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(184,146,42,0.15)',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                className="hover:border-amber-400"
              >
                <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.15em', marginBottom: '4px' }}>
                  《{r.bookTitle}》 · 第 {r.chapterIdx + 1} 章 {r.chapterTitle}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--tx-0)', lineHeight: 1.7 }}>
                  {r.snippet}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LibrarySearchPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto px-6 py-12" style={{ color: 'var(--tx-3)', fontSize: '13px' }}>加载中…</div>}>
      <SearchResults />
    </Suspense>
  );
}
