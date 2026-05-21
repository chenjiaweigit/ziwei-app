'use client';
import { usePathname, useRouter } from 'next/navigation';

const TABS = [
  {
    key: 'home',
    label: '首页',
    path: '/',
    icon: (a: boolean) => a
      ? 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      : 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    key: 'tianji',
    label: '天纪',
    path: '/tianji',
    icon: (a: boolean) => a
      ? 'M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2zm0 2.25L5.25 8.25 12 12.75l6.75-4.5L12 4.25zM12 12.75v6'
      : 'M12 2l9 4.5v9L12 20l-9-4.5v-9L12 2zm0 2.25L5.25 8.25 12 12.75l6.75-4.5L12 4.25z',
  },
  {
    key: 'diji',
    label: '地纪',
    path: '/diji',
    icon: (a: boolean) => a
      ? 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
      : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12',
  },
  {
    key: 'renji',
    label: '人纪',
    path: '/renji',
    icon: (a: boolean) => a
      ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
      : 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    key: 'profile',
    label: '我的',
    path: '/me',
    icon: (a: boolean) => a
      ? 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
      : 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
];

export default function TabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        height: '52px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'var(--bg-page)',
        borderTop: '1px solid rgba(184,146,42,0.12)',
      }}>
      {TABS.map(tab => {
        const active = isActive(tab.path);
        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.path)}
            className="flex flex-col items-center justify-center gap-0.5 transition-all duration-200"
            style={{ width: '20%', height: '100%' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke={active ? 'var(--ac)' : 'var(--tx-3)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d={tab.icon(active)} />
            </svg>
            <span style={{
              fontSize: '9px',
              fontWeight: active ? 500 : 400,
              color: active ? 'var(--ac)' : 'var(--tx-3)',
              letterSpacing: '0.05em',
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
