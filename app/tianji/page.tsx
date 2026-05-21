import Link from 'next/link';
import { TIANJI_MODULES, TIANJI_STATS, TIANJI_QUOTES, TIANJI_EPISODES } from '@/lib/nihai';

const STATUS_LABEL: Record<string, string> = {
  active: '已上线',
  preview: '预览中',
  coming: '即将开放',
};

const STATUS_COLOR: Record<string, string> = {
  active: '#10b981',
  preview: '#d4a843',
  coming: '#9db0d0',
};

const ac = '#d4a843';

export default function TianjiPage() {
  const displayedQuotes = TIANJI_QUOTES.slice(0, 4);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="text-center px-6 pt-12 pb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.4))' }} />
          <span style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.4em' }}>TIAN JI · 天纪</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: '12px' }}>
          天纪
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--ac)', letterSpacing: '0.2em', marginBottom: '8px' }}>
          上知天文 · 倪海厦天文术数体系
        </p>
        <p style={{ fontSize: '13px', color: 'var(--tx-2)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
          紫微斗数、易经六十四卦、堪舆学、推命学、面相学、测字术
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ac)' }}>{TIANJI_STATS.totalModules}</div>
            <div style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>子模块</div>
          </div>
          <div style={{ width: '1px', height: '32px', background: 'var(--bdr)' }} />
          <div className="text-center">
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ac)' }}>{TIANJI_STATS.totalChapters}</div>
            <div style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>章节</div>
          </div>
          <div style={{ width: '1px', height: '32px', background: 'var(--bdr)' }} />
          <div className="text-center">
            <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--ac)' }}>{TIANJI_STATS.videoHours}h</div>
            <div style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>视频</div>
          </div>
        </div>
      </div>

      {/* 子模块列表 */}
      <div className="max-w-3xl mx-auto px-6 pb-6 space-y-3">
        {TIANJI_MODULES.map(mod => {
          const href = mod.slug === 'ziwei' ? '/chart' : `/tianji/${mod.slug}`;
          return (
            <Link key={mod.id} href={href} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                background: 'var(--bg-card)',
                border: `1px solid ${mod.status === 'active' ? `${ac}30` : `${ac}15`}`,
                borderRadius: '12px',
                padding: '18px 22px',
                opacity: mod.status === 'coming' ? 0.6 : 1,
                transition: 'border-color 0.2s',
              }}>
                <div className="flex items-start gap-3">
                  <span style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{mod.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--tx-0)' }}>{mod.name}</span>
                      <span style={{
                        fontSize: '10px',
                        padding: '1px 8px',
                        borderRadius: '999px',
                        color: STATUS_COLOR[mod.status],
                        background: `${STATUS_COLOR[mod.status]}15`,
                        border: `1px solid ${STATUS_COLOR[mod.status]}30`,
                      }}>
                        {STATUS_LABEL[mod.status]}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ac)', letterSpacing: '0.1em', marginBottom: '6px' }}>
                      {mod.nameEn} · {mod.subtitle}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--tx-2)', lineHeight: 1.7, marginBottom: '10px' }}>
                      {mod.description}
                    </p>
                    {mod.chapters.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {mod.chapters.map(ch => (
                          <span key={ch.id} style={{
                            fontSize: '11px',
                            padding: '3px 10px',
                            background: `${ac}08`,
                            border: `1px solid ${ac}15`,
                            borderRadius: '999px',
                            color: 'var(--tx-2)',
                          }}>
                            {ch.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Episodes entry */}
      <div className="max-w-3xl mx-auto px-6 pb-6">
        <Link href="/tianji/episodes" style={{ textDecoration: 'none', display: 'block' }}>
          <div style={{
            background: 'var(--bg-card)',
            border: `1px solid ${ac}25`,
            borderRadius: '12px',
            padding: '18px 22px',
          }}>
            <div className="flex items-center gap-3">
              <span style={{
                fontSize: '22px', width: '44px', height: '44px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `${ac}12`, borderRadius: '10px', flexShrink: 0,
              }}>
                ◇
              </span>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '2px' }}>
                  24 集 DVD 课程目录
                </div>
                <div style={{ fontSize: '11px', color: 'var(--tx-3)' }}>
                  每集 2 小时 · 共 {TIANJI_EPISODES.length * 2} 小时 · 前半段命学 / 后半段易经
                </div>
              </div>
              <span style={{ fontSize: '12px', color: ac }}>查看 →</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quotes */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div style={{
          background: 'var(--bg-card)', borderRadius: '12px',
          border: '1px solid var(--bdr)', padding: '20px 24px',
        }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: '14px' }}>「</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--tx-0)' }}>倪师经典语录</span>
            <span style={{ fontSize: '14px' }}>」</span>
          </div>
          <div className="space-y-4">
            {displayedQuotes.map((q, i) => (
              <div key={i}>
                <p style={{ fontSize: '13px', color: 'var(--tx-1)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  {q.text}
                </p>
                <div style={{ fontSize: '10px', color: ac, marginTop: '4px', letterSpacing: '0.1em' }}>
                  —— {q.topic}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-20 px-6">
        <p style={{ fontSize: '11px', color: 'var(--tx-3)', lineHeight: 1.7 }}>
          天纪课程于 1994 年录制，共 {TIANJI_STATS.videoEpisodes} 集（每集 2 小时）<br />
          更多内容持续更新中
        </p>
      </div>
    </div>
  );
}
