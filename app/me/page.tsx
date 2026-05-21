export default function MePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
        style={{ background: 'rgba(184,146,42,0.1)', border: '1px solid rgba(184,146,42,0.2)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '8px' }}>
        个人中心
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--tx-3)', lineHeight: 1.6 }}>
        功能开发中，敬请期待
      </p>
    </div>
  );
}
