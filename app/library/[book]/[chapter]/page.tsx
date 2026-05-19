/**
 * 古籍章节页
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_BOOKS, findBook, type Book } from '@/lib/classics';

type PageParams = { book: string; chapter: string };

export async function generateStaticParams() {
  const params: PageParams[] = [];
  for (const book of ALL_BOOKS) {
    for (let i = 0; i < book.chapters.length; i++) {
      params.push({ book: book.slug, chapter: String(i) });
    }
  }
  return params;
}

export default async function ChapterPage({ params }: { params: Promise<PageParams> }) {
  const { book: slug, chapter: chapterIdx } = await params;
  const book = findBook(slug);
  if (!book) notFound();
  const idx = parseInt(chapterIdx, 10);
  if (isNaN(idx) || idx < 0 || idx >= book.chapters.length) notFound();
  const chapter = book.chapters[idx];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* header */}
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href={`/library/${book.slug}`} style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← {book.title}
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          {book.title} · 第 {idx + 1} 章
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.2em', marginBottom: '6px' }}>
          {book.dynasty} · {book.author}
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.12em', marginBottom: '8px' }}>
          {chapter.title}
        </h1>
        {chapter.intro && (
          <p style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '24px' }}>
            {chapter.intro}
          </p>
        )}

        {/* 段落 */}
        <div style={{ borderTop: '1px solid rgba(184,146,42,0.15)', paddingTop: '20px' }}>
          {chapter.paragraphs.map((p, i) => (
            <div key={i} style={{
              marginBottom: '16px',
              padding: '14px 18px',
              background: 'var(--bg-card)',
              border: '1px solid rgba(184,146,42,0.10)',
              borderRadius: '8px',
            }}>
              <div style={{ fontSize: '15px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.03em', whiteSpace: 'pre-wrap' }}>
                {p.text}
              </div>
            </div>
          ))}
        </div>

        {/* 章节导航 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          {idx > 0 ? (
            <Link href={`/library/${book.slug}/${idx - 1}`} style={{ fontSize: '13px', color: 'var(--ac)', textDecoration: 'none' }}>
              ← 上一章
            </Link>
          ) : <div />}
          {idx < book.chapters.length - 1 ? (
            <Link href={`/library/${book.slug}/${idx + 1}`} style={{ fontSize: '13px', color: 'var(--ac)', textDecoration: 'none' }}>
              下一章 →
            </Link>
          ) : <div />}
        </div>
      </article>
    </div>
  );
}
