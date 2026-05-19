'use client';
import { useRouter } from 'next/navigation';

interface TopBarProps {
  onShare?: () => void;
}

export default function TopBar(props: TopBarProps) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <button onClick={() => router.push('/')}
        className="text-[11px] px-2 py-0.5 rounded-lg transition-colors"
        style={{ border: '1px solid var(--bdr)', color: 'var(--tx-3)' }}>
        ‹ 返回
      </button>
      <div className="flex-1" />
      {props.onShare && (
        <button onClick={props.onShare} className="text-[10px] px-2.5 py-0.5 rounded-lg transition-colors"
          style={{ border: '1px solid var(--bdr)', color: 'var(--tx-3)' }}>分享</button>
      )}
    </div>
  );
}