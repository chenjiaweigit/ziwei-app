import { HEXAGRAMS, TRIGRAMS } from './tianji';
import type { Hexagram } from './types';

/**
 * 纳甲系统 - 八纯卦的干支分配
 * 每卦分内外（下/上），各3爻，每爻配一个天干地支
 */
const NAJIA: Record<string, { inner: string[]; innerGan: string[]; outer: string[]; outerGan: string[] }> = {
  乾: {
    inner: ['子', '寅', '辰'],
    innerGan: ['甲', '甲', '甲'],
    outer: ['午', '申', '戌'],
    outerGan: ['壬', '壬', '壬'],
  },
  坎: {
    inner: ['寅', '辰', '午'],
    innerGan: ['戊', '戊', '戊'],
    outer: ['申', '戌', '子'],
    outerGan: ['戊', '戊', '戊'],
  },
  艮: {
    inner: ['辰', '午', '申'],
    innerGan: ['丙', '丙', '丙'],
    outer: ['戌', '子', '寅'],
    outerGan: ['丙', '丙', '丙'],
  },
  震: {
    inner: ['子', '寅', '辰'],
    innerGan: ['庚', '庚', '庚'],
    outer: ['午', '申', '戌'],
    outerGan: ['庚', '庚', '庚'],
  },
  巽: {
    inner: ['丑', '亥', '酉'],
    innerGan: ['辛', '辛', '辛'],
    outer: ['未', '巳', '卯'],
    outerGan: ['辛', '辛', '辛'],
  },
  离: {
    inner: ['卯', '丑', '亥'],
    innerGan: ['己', '己', '己'],
    outer: ['酉', '未', '巳'],
    outerGan: ['己', '己', '己'],
  },
  坤: {
    inner: ['未', '巳', '卯'],
    innerGan: ['乙', '乙', '乙'],
    outer: ['丑', '亥', '酉'],
    outerGan: ['癸', '癸', '癸'],
  },
  兑: {
    inner: ['巳', '卯', '丑'],
    innerGan: ['丁', '丁', '丁'],
    outer: ['亥', '酉', '未'],
    outerGan: ['丁', '丁', '丁'],
  },
};

/** 地支→五行 */
const BRANCH_ELEMENT: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

/** 八卦→五行 */
const TRIGRAM_ELEMENT: Record<string, string> = {
  '乾': '金', '兑': '金', '离': '火', '震': '木',
  '巽': '木', '坎': '水', '艮': '土', '坤': '土',
};

/** 八宫卦序（64卦分八宫，每宫8卦） */
const PALACE_HEXAGRAMS: string[][] = [
  ['乾为天', '天风姤', '天山遁', '天地否', '风地观', '山地剥', '火地晋', '火天大有'],
  ['坎为水', '水泽节', '水雷屯', '水火既济', '泽火革', '雷火丰', '地火明夷', '地水师'],
  ['艮为山', '山火贲', '山天大畜', '山泽损', '火泽睽', '天泽履', '风泽中孚', '风山渐'],
  ['震为雷', '雷地豫', '雷水解', '雷风恒', '地风升', '水风井', '泽风大过', '泽雷随'],
  ['巽为风', '风天小畜', '风火家人', '风雷益', '天雷无妄', '火雷噬嗑', '山雷颐', '山风蛊'],
  ['离为火', '火山旅', '火风鼎', '火水未济', '山水蒙', '风水涣', '天水讼', '天火同人'],
  ['坤为地', '地雷复', '地泽临', '地天泰', '雷天大壮', '泽天夬', '水天需', '水地比'],
  ['兑为泽', '泽水困', '泽地萃', '泽山咸', '水山蹇', '地山谦', '雷山小过', '雷泽归妹'],
];

/** 世应位置（对应八宫每卦的位置，从初爻开始1-6） */
const SHI_YING_POSITIONS: { shi: number; ying: number }[] = [
  { shi: 6, ying: 3 }, // 1-本宫卦 (上爻)
  { shi: 1, ying: 4 }, // 2-初爻变
  { shi: 2, ying: 5 }, // 3-二爻变
  { shi: 3, ying: 6 }, // 4-三爻变
  { shi: 4, ying: 1 }, // 5-四爻变
  { shi: 5, ying: 2 }, // 6-五爻变
  { shi: 4, ying: 1 }, // 7-游魂 (四爻变)
  { shi: 3, ying: 6 }, // 8-归魂 (三爻变)
];

/** 六亲名称 */
const LIUQIN_NAMES = ['父母', '兄弟', '妻财', '官鬼', '子孙'] as const;
export type LiuQin = (typeof LIUQIN_NAMES)[number];

/** 六神顺序 */
const LIUSHEN_CYCLE = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'] as const;
export type LiuShen = (typeof LIUSHEN_CYCLE)[number];

/** 日地支→六神起始 */
const DAY_BRANCH_LIUSHEN: Record<string, LiuShen> = {
  '子': '青龙', '丑': '青龙',
  '寅': '朱雀', '卯': '朱雀',
  '辰': '勾陈', '巳': '勾陈',
  '午': '腾蛇', '未': '腾蛇',
  '申': '白虎', '酉': '白虎',
  '戌': '玄武', '亥': '玄武',
};

export interface LineLiuQin {
  branch: string;
  gan: string;
  element: string;
  liuqin: LiuQin;
  liuShen: LiuShen;
  isShi: boolean;
  isYing: boolean;
}

function findPalace(composition: string): { palaceName: string; palaceElement: string; index: number } | null {
  for (let p = 0; p < PALACE_HEXAGRAMS.length; p++) {
    const idx = PALACE_HEXAGRAMS[p].indexOf(composition);
    if (idx >= 0) {
      const upper = TRIGRAMS[p];
      return { palaceName: ['乾', '坎', '艮', '震', '巽', '离', '坤', '兑'][p], palaceElement: TRIGRAM_ELEMENT[['乾', '坎', '艮', '震', '巽', '离', '坤', '兑'][p]], index: idx };
    }
  }
  return null;
}

function getElementRelation(myElem: string, lineElem: string): LiuQin {
  const shengKe: Record<string, Record<string, string>> = {
    '金': { '金': '兄弟', '水': '子孙', '木': '妻财', '火': '官鬼', '土': '父母' },
    '木': { '木': '兄弟', '火': '子孙', '土': '妻财', '金': '官鬼', '水': '父母' },
    '水': { '水': '兄弟', '木': '子孙', '火': '妻财', '土': '官鬼', '金': '父母' },
    '火': { '火': '兄弟', '土': '子孙', '金': '妻财', '水': '官鬼', '木': '父母' },
    '土': { '土': '兄弟', '金': '子孙', '水': '妻财', '木': '官鬼', '火': '父母' },
  };
  return (shengKe[myElem]?.[lineElem] as LiuQin) || '兄弟';
}

/** 计算一卦的六亲六神 */
export function computeLiuqin(hexagram: Hexagram, dayBranch?: string): LineLiuQin[] {
  const palace = findPalace(hexagram.composition);
  if (!palace) return [];

  const upperTri = hexagram.upper;
  const lowerTri = hexagram.lower;
  const palaceElem = palace.palaceElement;
  const pos = SHI_YING_POSITIONS[palace.index];
  const db = dayBranch || '子';

  const najiaUpper = NAJIA[upperTri];
  const najiaLower = NAJIA[lowerTri];

  // 六爻从下到上：下卦3爻 + 上卦3爻
  const branches = [
    ...najiaLower.inner.map((b, i) => ({ branch: b, gan: najiaLower.innerGan[i] })),
    ...najiaUpper.outer.map((b, i) => ({ branch: b, gan: najiaUpper.outerGan[i] })),
  ];

  // 六神起始
  const startIdx = LIUSHEN_CYCLE.indexOf(DAY_BRANCH_LIUSHEN[db] || '青龙');

  return branches.map((b, i) => {
    const elem = BRANCH_ELEMENT[b.branch] || '土';
    return {
      branch: b.branch,
      gan: b.gan,
      element: elem,
      liuqin: getElementRelation(palaceElem, elem),
      liuShen: LIUSHEN_CYCLE[(startIdx + i) % 6],
      isShi: pos.shi === (6 - i),
      isYing: pos.ying === (6 - i),
    };
  });
}

/** 获取今日地支 */
export function getTodayBranch(): string {
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const day = new Date().getDate();
  return branches[day % 12];
}
