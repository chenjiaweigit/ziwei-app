/**
 * 服务条款
 */
import Link from 'next/link';

export const metadata = {
  title: '服务条款 · 紫微命盘',
  description: '紫微命盘服务条款',
};

export default function TermsPage() {
  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>← 首页</Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>服务条款</div>
      </div>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--tx-0)', marginBottom: '20px' }}>服务条款</h1>
        <div style={{ fontSize: '14px', color: 'var(--tx-2)', lineHeight: 1.8 }}>
          <p style={{ marginBottom: '16px' }}>欢迎使用紫微命盘平台。请您仔细阅读以下条款。</p>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '24px', marginBottom: '12px' }}>1. 服务说明</h2>
          <p style={{ marginBottom: '12px' }}>本平台提供紫微斗数命盘排算及相关知识内容，所有内容仅供学习参考。</p>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '24px', marginBottom: '12px' }}>2. 免责声明</h2>
          <p style={{ marginBottom: '12px' }}>本平台提供的所有命理解读均基于传统文化研究，不构成任何医疗、投资、法律或重大决策建议。用户应根据自身情况做出判断。</p>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--tx-0)', marginTop: '24px', marginBottom: '12px' }}>3. 知识产权</h2>
          <p style={{ marginBottom: '12px' }}>本平台所收录的公版古籍内容属于公共领域。平台原创内容受著作权法保护。</p>
        </div>
      </div>
    </div>
  );
}
