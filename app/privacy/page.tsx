/**
 * 隐私政策
 */
import Link from 'next/link';

export const metadata = {
  title: '隐私政策 · 紫微命盘',
  description: '紫微命盘隐私政策',
};

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>← 首页</Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>隐私政策</div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--tx-0)', marginBottom: '20px' }}>隐私政策</h1>
        <div style={{ fontSize: '14px', color: 'var(--tx-2)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '16px' }}>本平台尊重并保护所有用户的个人隐私权。为了给您提供更准确、更有用的服务，本平台会按照本隐私政策的规定使用和披露您的个人信息。但本平台将以高度的勤勉、审慎义务对待这些信息。</p>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '24px', marginBottom: '12px' }}>1. 信息收集</h2>
          <p style={{ marginBottom: '12px' }}>您在使用本平台服务时，可能需要提供出生年月日时、出生地点等必要信息，用于紫微斗数命盘排算。</p>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '24px', marginBottom: '12px' }}>2. 信息使用</h2>
          <p style={{ marginBottom: '12px' }}>您提供的信息仅用于命盘排算和历史记录保存，不会用于任何其他目的。</p>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '24px', marginBottom: '12px' }}>3. 信息存储</h2>
          <p style={{ marginBottom: '12px' }}>命盘历史记录存储在您的浏览器本地，不会上传至服务器。</p>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '24px', marginBottom: '12px' }}>4. 免责声明</h2>
          <p style={{ marginBottom: '12px' }}>本平台提供的所有命理解读仅作学习参考，不构成任何医疗、投资、法律或重大决策建议。</p>
        </div>
      </div>
    </div>
  );
}
