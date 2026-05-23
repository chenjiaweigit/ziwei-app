export const metadata = { title: '服务条款 · 紫微命盘', description: '紫微命盘服务条款与用户协议' };

export default function TermsPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>返回首页</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em' }}>紫微命盘</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>服务条款</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>最后更新：2026年5月</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. 服务概述</h2>
      <p>紫微命盘（以下简称"本平台"）基于倪海厦《天纪》紫微斗数体系提供命盘排盘与解读服务。本平台所有命理内容<strong>仅供娱乐参考</strong>，<strong>不构成任何医疗、投资、法律、心理咨询或人生重大决策建议</strong>。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. 会员服务与付费</h2>
      <p>本平台提供免费和付费两种服务模式：</p>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>免费服务</strong>：每日可免费使用 AI 解盘 3 次，超出次数可通过观看广告解锁</li>
        <li><strong>单次付费</strong>：可选单宫位解读（¥9.9）、完整命盘详批（¥19.9）、合盘分析（¥29.9）、流年推演（¥39.9）等单次服务，付费后即时解锁对应报告</li>
        <li><strong>月度会员</strong>（¥19.9/月）：有效期内无限次使用全部 AI 解读功能，去广告</li>
        <li><strong>年度会员</strong>（¥98/年）：同月度会员权益，折合 ¥8.2/月</li>
        <li><strong>终身会员</strong>（¥99）：永久享有全部权益</li>
      </ul>
      <p><strong>支付与退款</strong>：</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>小程序内单次付费通过微信虚拟支付完成</li>
        <li>年度/终身会员通过 LemonSqueezy 平台收款，支持信用卡、Apple Pay、PayPal</li>
        <li>单次付费服务一经交付（报告生成完毕）不予退款</li>
        <li>月度/年度订阅会员可在购买后 14 天内申请全额退款（联系客服处理），超过 14 天或已使用服务的不予退款</li>
        <li>终身会员购买后 14 天内可申请全额退款，超过 14 天不予退款</li>
        <li>退款申请请发送邮件或通过平台公布的客服微信联系</li>
      </ul>
      <p><strong>服务中断处理</strong>：因平台系统维护、AI 服务不可抗力等原因导致付费用户无法正常使用时，我们会按中断时长顺延会员有效期，但不承担其他赔偿责任。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. 用户行为规范</h2>
      <p>使用本平台即表示您同意：</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>仅出于合法、个人参考目的使用本平台</li>
        <li>不传播本平台内容用于商业销售、转载或公开发布</li>
        <li>不进行扰乱平台正常运行的行为</li>
        <li>提交的出生信息真实有效；本平台对错误信息导致的解读偏差不承担责任</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. 知识产权与禁止条款 · 反爬反训练</h2>
      <p style={{ background: 'rgba(168,50,40,0.06)', border: '1px solid rgba(168,50,40,0.2)', padding: 16, borderRadius: 8 }}>
        <strong>本平台所有命理内容、知识库（含 14 主星 × 12 宫 × 男女 × 四化 × 大限流年的全部解读文本）、UI 设计、算法整合方案、案例库均为本平台原创或经合法整理。</strong><br/><br/>
        严格禁止以下行为，违者保留追究民事赔偿与刑事责任的权利：<br/>
        ① 通过爬虫、自动化脚本、批量调用 API 等任何技术手段抓取本平台内容；<br/>
        ② 将本平台生成的命盘解读、文本、API 响应数据**用于训练任何机器学习模型**（含但不限于大语言模型、命理生成模型、文本生成模型等）；<br/>
        ③ 将本平台生成的内容转售、发布到其他网站、APP、自媒体账号；<br/>
         ④ 反编译、复制、修改本平台前端或后端代码并以"自营"方式提供同类服务。<br/><br/>
         一经发现违规，本平台有权要求 <strong>每例违约赔偿 100 万元人民币</strong>，并保留向法院提起诉讼及配合公安机关调查的权利。
      </p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. 免责声明</h2>
      <p>本平台命理内容基于传统紫微斗数与倪海厦体系的知识整理，<strong>不保证 100% 准确</strong>。命运受天、地、人三才共同影响，本平台输出仅作为认识自我的参考，使用者应理性看待，不应过度依赖任何单一命理判断。</p>
      <p>AI 解读由大语言模型自动生成，可能包含不准确或不完整的内容，平台不对其准确性、完整性做任何保证。AI 输出的内容仅作为传统命理文化的一种趣味解读，不构成任何形式的专业建议。</p>
      <p>因使用本平台内容产生的任何后果（包括但不限于决策失误、心理影响、关系变化等），本平台不承担法律责任。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. 服务变更与终止</h2>
      <p>本平台保留随时调整、暂停或终止部分或全部服务的权利。重大变更将以站内公告或邮件方式通知用户。</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. 法律适用与争议解决</h2>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>8. 联系方式</h2>
      <p>如有疑问，请通过本平台公布的客服微信 / 邮箱联系。</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}>隐私政策</a> · <a href="/" style={{ color: 'var(--ac)' }}>返回首页</a>
        </p>
      </main>
    </>
  );
}
