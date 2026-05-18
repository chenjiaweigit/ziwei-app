'use client';
import TimeNav, { type TimeView } from '@/components/TimeNav';

export type { TimeView };

interface TopBarProps {
  chart: Parameters<typeof TimeNav>[0]['chart'];
  view: TimeView;
  liunianYear: number;
  liuyueMonth?: number;
  onViewChange: (view: TimeView) => void;
  onYearChange: (year: number) => void;
  onMonthChange?: (month: number) => void;
  onShare?: () => void;
  onExport?: () => void;
  copied?: boolean;
}

export default function TopBar(props: TopBarProps) {
  return (
    <div>
      <TimeNav
        chart={props.chart}
        view={props.view}
        liunianYear={props.liunianYear}
        onViewChange={props.onViewChange}
        onYearChange={props.onYearChange}
      />
      <div className="flex justify-end gap-2 px-1">
        {props.onShare && (
          <button
            onClick={props.onShare}
            className="text-[10px] px-2.5 py-1 rounded-lg transition-colors"
            style={{ border: '1px solid var(--bdr)', color: 'var(--tx-3)' }}
          >
            分享
          </button>
        )}
      </div>
    </div>
  );
}
