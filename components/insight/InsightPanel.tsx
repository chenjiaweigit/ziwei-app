'use client';
import InsightPanelOriginal from '@/components/InsightPanel';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';

export interface FocusState {
  type: 'star' | 'palace' | 'sihua';
  label: string;
  star?: Star;
  palace?: Palace;
  siHua?: string;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  view?: string;
  liunianYear?: number;
  liuyueMonth?: number;
  focus?: FocusState | null;
  onClearFocus?: () => void;
}

export default function InsightPanel({ chart, focus, onClearFocus }: InsightPanelProps) {
  return <InsightPanelOriginal chart={chart} selectedPalace={focus?.palace ?? null} selectedSiHua={null} />;
}