import React from 'react';

const ac = '#d4a843';

function processInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) parts.push(remaining.slice(0, boldMatch.index));
      parts.push(<strong key={parts.length} style={{ fontWeight: 700, color: 'var(--tx-0)' }}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }
  return parts;
}

export default function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inList: 'ul' | null = null;
  const listItems: React.ReactNode[] = [];

  function flushList() {
    if (inList && listItems.length > 0) {
      elements.push(
        <div key={`list-${elements.length}`} style={{ margin: '6px 0', paddingLeft: '16px' }}>
          {listItems}
        </div>
      );
      listItems.length = 0;
      inList = null;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const listMatch = line.match(/^[-*]\s+(.+)/);
    if (listMatch) {
      inList = 'ul';
      listItems.push(
        <div key={`li-${i}`} style={{ display: 'flex', gap: '6px', marginBottom: '4px', fontSize: '13px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
          <span style={{ color: ac }}>·</span>
          <span>{processInline(listMatch[1])}</span>
        </div>
      );
      continue;
    }

    flushList();

    if (line.startsWith('---')) {
      elements.push(
        <div key={`hr-${i}`} style={{ height: '1px', background: 'var(--bdr)', margin: '12px 0' }} />
      );
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <div key={`h3-${i}`} style={{ fontSize: '15px', fontWeight: 700, color: 'var(--tx-0)', marginTop: '14px', marginBottom: '6px' }}>
          {processInline(line.slice(4))}
        </div>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <div key={`h2-${i}`} style={{ fontSize: '17px', fontWeight: 700, color: 'var(--tx-0)', marginTop: '16px', marginBottom: '8px', letterSpacing: '0.02em' }}>
          {processInline(line.slice(3))}
        </div>
      );
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(
        <div key={`h1-${i}`} style={{
          fontSize: '19px', fontWeight: 700, color: 'var(--tx-0)',
          marginTop: '18px', marginBottom: '10px',
          paddingBottom: '6px', borderBottom: '1px solid var(--bdr)',
          letterSpacing: '0.03em',
        }}>
          {processInline(line.slice(2))}
        </div>
      );
      continue;
    }

    if (line.trim() === '') {
      elements.push(<div key={`br-${i}`} style={{ height: '8px' }} />);
      continue;
    }

    elements.push(
      <div key={`p-${i}`} style={{ fontSize: '13px', color: 'var(--tx-1)', lineHeight: 1.8, marginBottom: '4px' }}>
        {processInline(line)}
      </div>
    );
  }

  flushList();

  return <>{elements}</>;
}
