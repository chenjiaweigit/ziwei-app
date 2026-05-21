import { RENJI_MODULES, RENJI_STATS } from '@/lib/nihai';

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

export default function RenjiPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="text-center px-6 pt-12 pb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(139,107,158,0.4))' }} />
          <span style={{ fontSize: '11px', color: '#8b6b9e', letterSpacing: '0.4em' }}>REN JI · 人纪</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(139,107,158,0.4))' }} />
        </div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.15em', marginBottom: '12px' }}>
          人纪
        </h1>
        <p style={{ fontSize: '13px', color: '#8b6b9e', letterSpacing: '0.2em', marginBottom: '8px' }}>
          中知人事 · 倪海厦中医经典教学体系
        </p>
        <p style={{ fontSize: '13px', color: 'var(--tx-2)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
          针灸大成 · 黄帝内经 · 神农本草经 · 伤寒论 · 金匮要略
        </p>
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="text-center">
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#8b6b9e' }}>{RENJI_STATS.totalModules}</div>
            <div style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>子模块</div>
          </div>
          <div style={{ width: '1px', height: '32px', background: 'var(--bdr)' }} />
          <div className="text-center">
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#8b6b9e' }}>{RENJI_STATS.totalChapters}</div>
            <div style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>章节</div>
          </div>
          <div style={{ width: '1px', height: '32px', background: 'var(--bdr)' }} />
          <div className="text-center">
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#8b6b9e' }}>{RENJI_STATS.totalLessons}</div>
            <div style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>集数</div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
          <span style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>学习顺序：</span>
          {RENJI_STATS.learningOrder.map((name, i) => (
            <span key={name} style={{
              fontSize: '10px', padding: '2px 10px',
              background: 'rgba(139,107,158,0.08)',
              border: '1px solid rgba(139,107,158,0.15)',
              borderRadius: '999px', color: '#8b6b9e',
            }}>
              {i + 1}. {name}
            </span>
          ))}
        </div>
      </div>

      {/* 子模块列表 */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-3">
        {RENJI_MODULES.map(mod => (
          <div key={mod.id} style={{
            background: 'var(--bg-card)',
            border: `1px solid ${mod.status === 'active' ? 'rgba(139,107,158,0.25)' : 'rgba(139,107,158,0.1)'}`,
            borderRadius: '12px',
            padding: '18px 22px',
            opacity: mod.status === 'coming' ? 0.6 : 1,
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
                <div style={{ fontSize: '11px', color: '#8b6b9e', letterSpacing: '0.1em', marginBottom: '6px' }}>
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
                        background: 'rgba(139,107,158,0.06)',
                        border: '1px solid rgba(139,107,158,0.12)',
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
        ))}
      </div>

      {/* 底部数据 */}
      <div className="text-center pb-20 px-6">
        <p style={{ fontSize: '11px', color: 'var(--tx-3)', lineHeight: 1.7 }}>
          人纪课程于 {RENJI_STATS.completionYear} 年完成录制，共 {RENJI_STATS.totalLessons}
        </p>
      </div>
    </div>
  );
}
