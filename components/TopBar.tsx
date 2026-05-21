'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export default function TopBar() {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: '40px',
        background: 'var(--bg-page)',
        borderBottom: '1px solid rgba(184,146,42,0.12)',
      }}>
      <button onClick={() => router.push('/')}
        className="text-[11px] tracking-[0.3em] font-medium"
        style={{ color: 'var(--ac)', letterSpacing: '0.3em' }}>
        紫微命盘
      </button>

      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.93 }}
        aria-label={isDark ? '切换亮色主题' : '切换暗色主题'}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
        style={{
          borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
        }}>
        <div className="relative w-8 h-4 rounded-full flex-shrink-0"
          style={{
            background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
          }}>
          <motion.div
            animate={{ x: isDark ? 1 : 17 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="absolute top-0.5 w-3 h-3 rounded-full"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #b8a050, #e8d090)'
                : 'linear-gradient(135deg, #e89010, #f8d050)',
            }}
          />
        </div>
      </motion.button>
    </div>
  );
}
