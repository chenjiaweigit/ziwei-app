/**
 * 古籍详情页
 * 展示某部古籍的所有章节列表及内容
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_BOOKS, findBook } from '@/lib/classics';

export async function generateStaticParams() {
  return ALL_BOOKS.map(book => ({ book: book.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = findBook(slug);
  if (!book) return {};
  return {
    title: `《${book.title}》· 全文阅读 · 紫微斗数古籍`,
    description: book.intro,
  };
}

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = findBook(slug);
  if (!book) notFound();

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* header */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 古籍库
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          经典原典 · CLASSICS
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.2em', marginBottom: '8px' }}>
          {book.dynasty} · {book.author}
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: '12px' }}>
          《{book.title}》
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '28px' }}>
          {book.intro}
        </p>

        {/* 章节列表 */}
        {book.chapters.map((chapter, i) => (
          <Link
            key={i}
            href={`/library/${book.slug}/${i}`}
            style={{
              display: 'block',
              padding: '14px 18px',
              background: 'var(--bg-card)',
              border: '1px solid rgba(184,146,42,0.15)',
              borderRadius: '10px',
              textDecoration: 'none',
              marginBottom: '10px',
              transition: 'all 0.2s',
            }}
            className="hover:border-amber-400"
          >
            <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.15em', marginBottom: '4px' }}>
              第 {i + 1} 章
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--tx-0)', letterSpacing: '0.1em' }}>
              {chapter.title}
            </div>
            {chapter.intro && (
              <div style={{ fontSize: '12px', color: 'var(--tx-2)', marginTop: '4px', lineHeight: 1.6 }}>
                {chapter.intro}
              </div>
            )}
            <div style={{ fontSize: '11px', color: 'var(--tx-3)', marginTop: '6px' }}>
              {chapter.paragraphs.length} 段
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
