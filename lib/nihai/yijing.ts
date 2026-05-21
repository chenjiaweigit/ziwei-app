import type { YaoLine, DivinationResult, DivinationMethod } from './types';
import {
  getHexagramByLines, getChangedHexagram, getInnerHexagram,
} from './tianji';

const POSITION_LABELS = ['初', '二', '三', '四', '五', '上'];

function makeYaoLine(value: number, position: number): YaoLine {
  const yin = value % 2 === 0;
  const changing = value === 6 || value === 9;
  const yi = yin ? '六' : '九';
  const label = `${POSITION_LABELS[position]}${yi}`;
  return { position: position + 1, value, yin, changing, label };
}

/** 三枚硬币掷一次 */
export function tossOnce(): number {
  const coins = [Math.random() < 0.5, Math.random() < 0.5, Math.random() < 0.5];
  const heads = coins.filter(Boolean).length;
  return heads === 0 ? 6 : heads === 1 ? 7 : heads === 2 ? 8 : 9;
}

/** 金钱卦：掷6次获得完整卦象 */
export function coinDivination(): YaoLine[] {
  const lines: YaoLine[] = [];
  for (let i = 0; i < 6; i++) {
    const value = tossOnce();
    lines.push(makeYaoLine(value, i));
  }
  return lines;
}

/** 数字卦：三个数字起卦 */
export function numberDivination(n1: number, n2: number, n3: number): YaoLine[] {
  const upper = ((n1 - 1) % 8 + 8) % 8;
  const lower = ((n2 - 1) % 8 + 8) % 8;
  const moving = ((n3 - 1) % 6 + 6) % 6;

  const upperBits = [upper & 1, (upper >> 1) & 1, (upper >> 2) & 1];
  const lowerBits = [lower & 1, (lower >> 1) & 1, (lower >> 2) & 1];

  const raw: number[] = [];
  for (let i = 0; i < 3; i++) raw.push(lowerBits[i] ? 7 : 8);
  for (let i = 0; i < 3; i++) raw.push(upperBits[i] ? 7 : 8);

  if (moving >= 0 && moving < 6) {
    raw[moving] = raw[moving] === 7 ? 9 : 6;
  }

  return raw.map((v, i) => makeYaoLine(v, i));
}

/** 时间卦：当前时间起卦 */
export function timeDivination(): YaoLine[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const h = now.getHours();
  const min = now.getMinutes();

  const n1 = (y + m + d) % 8 || 8;
  const n2 = (h + min + d) % 8 || 8;
  const n3 = (y + m + d + h + min) % 6 || 6;

  return numberDivination(n1, n2, n3);
}

/** 从六爻构建完整结果 */
export function buildResult(lines: YaoLine[], method: DivinationMethod): DivinationResult {
  const rawValues = lines.map(l => l.value);
  const hexagram = getHexagramByLines(rawValues)!;

  const changingLine = lines.find(l => l.changing);
  const hasChanging = !!changingLine;
  const changingPosition = changingLine ? changingLine.position : 0;

  let changedLines = rawValues;
  if (hasChanging && changingPosition > 0) {
    changedLines = [...rawValues];
    const idx = changingPosition - 1;
    changedLines[idx] = changedLines[idx] % 2 === 1 ? changedLines[idx] - 1 : changedLines[idx] + 1;
  }
  const changed = getHexagramByLines(changedLines)!;

  const inner = getInnerHexagram(rawValues)!;

  return {
    method,
    lines,
    hexagramNumber: hexagram.number,
    hexagram,
    hasChanging,
    changingPosition,
    changedNumber: changed.number,
    changed,
    innerNumber: inner.number,
    inner,
  };
}
