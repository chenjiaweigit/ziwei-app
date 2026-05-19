'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function LibrarySearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = useCallback((q: string) => {
    if (!q.trim()) return;
    router.push(`/library/search?q=${encodeURIComponent(q.trim())}`);
  }, [router]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) handleSearch(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query, handleSearch]);

  return (
    <div style={{ position: 'relative' }}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSearch(query); }}
        placeholder="搜索古籍内容…"
        className="input-base"
        style={{
          width: '100%',
          padding: '14px 18px 14px 44px',
          fontSize: '14px',
          borderRadius: '12px',
          border: '1px solid var(--bdr)',
          background: 'var(--bg-card)',
          color: 'var(--tx-0)',
          outline: 'none',
        }}
      />
      <span style={{
        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
        fontSize: '16px', color: 'var(--tx-3)', pointerEvents: 'none',
      }}>
        🔍
      </span>
    </div>
  );
}
