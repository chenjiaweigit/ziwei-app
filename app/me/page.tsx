'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-client';
import { useHistory } from '@/lib/ziwei/history';
import { useDivinationHistory } from '@/lib/nihai/divination-history';
import { useHemmingHistory } from '@/lib/ziwei/heming-history';
import Link from 'next/link';

export default function MePage() {
  const { user, isLoggedIn, login, logout } = useAuth();
  const { history: chartHistory, remove: removeChart } = useHistory();
  const { history: divHistory, remove: removeDiv } = useDivinationHistory();
  const { history: hemingHistory, remove: removeHemming } = useHemmingHistory();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [logging, setLogging] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone) return;
    setLogging(true);
    setError('');
    try {
      await login(phone, name || undefined);
    } catch (e: any) {
      setError(e.message || '登录失败');
    }
    setLogging(false);
  };

  const ac = '#d4a843';

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
        <div className="max-w-sm mx-auto px-6 pt-24">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '28px', color: ac, opacity: 0.15, marginBottom: '12px' }}>☯</div>
            <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--tx-0)', marginBottom: '8px' }}>个人中心</h1>
            <p style={{ fontSize: '13px', color: 'var(--tx-3)' }}>登录后可同步历史记录到云端</p>
          </div>

          <div style={{
            background: 'var(--bg-card)', borderRadius: '16px',
            border: '1px solid var(--bdr)', padding: '24px',
          }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', marginBottom: '6px' }}>手机号</div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="请输入手机号"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: '14px',
                  background: 'var(--bg-page)', border: '1px solid var(--bdr)',
                  borderRadius: '10px', color: 'var(--tx-0)', outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', color: 'var(--tx-3)', marginBottom: '6px' }}>昵称（可选）</div>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="输入昵称"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{
                  width: '100%', padding: '10px 12px', fontSize: '14px',
                  background: 'var(--bg-page)', border: '1px solid var(--bdr)',
                  borderRadius: '10px', color: 'var(--tx-0)', outline: 'none',
                }}
              />
            </div>

            {error && (
              <div style={{ fontSize: '12px', color: '#dc2626', marginBottom: '12px' }}>{error}</div>
            )}

            <button
              onClick={handleLogin}
              disabled={logging || !phone}
              style={{
                width: '100%', padding: '12px', cursor: logging || !phone ? 'not-allowed' : 'pointer',
                background: logging || !phone ? 'var(--tx-2)' : ac, color: '#fff',
                border: 'none', borderRadius: '999px', fontSize: '14px', fontWeight: 600,
                opacity: logging || !phone ? 0.5 : 1,
              }}
            >
              {logging ? '登录中…' : '登录 / 注册'}
            </button>

            <p style={{ fontSize: '11px', color: 'var(--tx-3)', marginTop: '12px', textAlign: 'center' }}>
              任意手机号即可登录，新号自动注册
            </p>
          </div>
        </div>
      </div>
    );
  }

  const Section = ({ title, list, onRemove, empty }: {
    title: string;
    list: { id: string; label: string; savedAt: number }[];
    onRemove: (id: string) => void;
    empty: string;
  }) => (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <span style={{ fontSize: '10px', letterSpacing: '0.4em', color: 'var(--tx-3)' }}>{title}</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--bdr)' }} />
      </div>
      {list.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--tx-3)', padding: '12px 0' }}>{empty}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {list.map(entry => (
            <div key={entry.id} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '8px 12px', background: 'var(--bg-card)',
              border: '1px solid var(--bdr)', borderRadius: '12px',
            }}>
              <span style={{
                fontSize: '11px', color: 'var(--tx-2)', flex: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {entry.label}
              </span>
              <span style={{ fontSize: '10px', color: 'var(--tx-3)', flexShrink: 0 }}>
                {new Date(entry.savedAt).toLocaleDateString('zh-CN')}
              </span>
              <button
                onClick={() => onRemove(entry.id)}
                style={{
                  fontSize: '14px', color: 'var(--tx-3)', background: 'none',
                  border: 'none', cursor: 'pointer', lineHeight: 1, opacity: 0.5,
                  flexShrink: 0,
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0.5'}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <div className="max-w-lg mx-auto px-6 pt-12 pb-24">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${ac}12`, border: `1px solid ${ac}20`,
          }}>
            <span style={{ fontSize: '20px', color: ac }}>☯</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--tx-0)' }}>
              {user?.name || user?.phone}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--tx-3)', marginTop: '2px' }}>
              {user?.phone} · {user?.membershipTier === 'free' ? '免费用户' : '会员'}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              padding: '6px 16px', fontSize: '12px', cursor: 'pointer',
              background: 'none', border: '1px solid var(--bdr)',
              borderRadius: '999px', color: 'var(--tx-3)',
            }}
          >退出</button>
        </div>

        <Section title="排盘历史" list={chartHistory} onRemove={removeChart} empty="暂无排盘记录" />
        <Section title="卦象历史" list={divHistory} onRemove={removeDiv} empty="暂无卦象记录" />
        <Section title="合盘历史" list={hemingHistory} onRemove={removeHemming} empty="暂无合盘记录" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
          <Link href="/chart" style={{
            display: 'block', textAlign: 'center', padding: '12px',
            borderRadius: '999px', background: ac, color: '#fff',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
          }}>去排盘</Link>
          <Link href="/tianji/yijing/divine" style={{
            display: 'block', textAlign: 'center', padding: '12px',
            borderRadius: '999px', background: `${ac}10`, color: ac,
            border: `1px solid ${ac}30`, fontSize: '13px', fontWeight: 600, textDecoration: 'none',
          }}>去占卜</Link>
          <Link href="/heming" style={{
            display: 'block', textAlign: 'center', padding: '12px',
            borderRadius: '999px', background: `${ac}08`, color: 'var(--tx-2)',
            border: '1px solid var(--bdr)', fontSize: '13px', fontWeight: 500, textDecoration: 'none',
          }}>去合盘</Link>
        </div>
      </div>
    </div>
  );
}
