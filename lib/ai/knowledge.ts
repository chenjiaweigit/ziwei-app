import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import { getYearStemIndex, getSiHuaByStem } from '@/lib/ziwei/sihua';
import { detectPatterns, type Pattern } from '@/lib/ziwei/patterns';

const PALACE_NAMES_ZH: Record<string, string> = {
  '命宫': '自我、性格、先天格局',
  '兄弟宫': '兄弟姊妹、合伙人、社交关系',
  '夫妻宫': '感情婚姻、配偶特质、感情观',
  '子女宫': '子女运、下属关系、桃花',
  '财帛宫': '财运来源、收入方式、消费习惯',
  '疾厄宫': '身体健康、疾病倾向',
  '迁移宫': '外出机遇、人际网络、社会形象',
  '交友宫': '朋友质量、贵人小人、人际圈',
  '官禄宫': '事业成就、职业方向、社会地位',
  '田宅宫': '不动产、家庭环境、积蓄能力',
  '福德宫': '精神世界、福分、内心状态',
  '父母宫': '父母关系、遗传、文书契约',
};

export function extractChartContext(chart: ZiweiChart): string {
  const lines: string[] = [];
  const { lunarInfo, wuxingJuName, currentAge } = chart;

  lines.push(`命主出生：${chart.birthInfo.year}年${chart.birthInfo.month}月${chart.birthInfo.day}日，${chart.birthInfo.gender === 'male' ? '男' : '女'}命`);
  lines.push(`农历：${lunarInfo.lunarYear}年${lunarInfo.lunarMonth}月${lunarInfo.lunarDay}日，年柱${STEMS[lunarInfo.yearStem]}${BRANCHES[lunarInfo.yearBranch]}`);
  lines.push(`五行局：${wuxingJuName}`);
  lines.push(`当前年龄：${currentAge}岁`);

  const mingPalace = chart.palaces.find(p => p.isMingGong);
  if (mingPalace) {
    lines.push(`命宫位置：${BRANCHES[mingPalace.branch]}宫（${PALACE_NAMES_ZH[mingPalace.name] || ''}）`);
    const majorStars = mingPalace.stars.filter(s => s.type === 'major');
    if (majorStars.length > 0) {
      lines.push(`命宫主星：${majorStars.map(s => formatStar(s)).join('、')}`);
    } else {
      lines.push(`命宫无主星（空宫，借对宫${mingPalace.borrowedFromName || ''}：${(mingPalace.borrowedStars || []).join('、')}）`);
    }
    const sihuaStars = mingPalace.stars.filter(s => s.siHua);
    if (sihuaStars.length > 0) {
      lines.push(`命宫四化：${sihuaStars.map(s => `${s.name}化${s.siHua}`).join('、')}`);
    }
  }

  const shenPalace = chart.palaces.find(p => p.isShenGong);
  if (shenPalace) {
    lines.push(`身宫位置：${BRANCHES[shenPalace.branch]}宫`);
  }

  for (const palace of chart.palaces) {
    const majorStars = palace.stars.filter(s => s.type === 'major');
    if (majorStars.length === 0) continue;

    const starDesc = majorStars.map(s => formatStar(s)).join('、');
    const role = PALACE_NAMES_ZH[palace.name] || '';
    lines.push(`${palace.name}（${role}）：${starDesc}`);
  }

  const sihuaSummary = buildSiHuaSummary(chart);
  if (sihuaSummary) {
    lines.push(`本命四化：${sihuaSummary}`);
  }

  const currentDx = chart.daXians[chart.currentDaXianIndex];
  if (currentDx) {
    lines.push(`当前大限（${currentDx.startAge}-${currentDx.endAge}岁）：${currentDx.palaceName}`);
    const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
    if (dxPalace) {
      const dxStars = dxPalace.stars.filter(s => s.type === 'major').map(s => formatStar(s)).join('、');
      if (dxStars) lines.push(`大限宫主星：${dxStars}`);
    }
  }

  const patterns = detectPatterns(chart);
  if (patterns.length > 0) {
    const levels: Record<string, string> = { excellent: '上格', good: '中上', neutral: '中格', caution: '下格' };
    const patternDesc = patterns.map(p => `${p.name}（${levels[p.level] || p.level}）`).join('、');
    lines.push(`命盘格局：${patternDesc}`);
  }

  return lines.join('\n');
}

function formatStar(star: Star): string {
  let text = star.name;
  if (star.brightness === 'bright') text += '【庙旺】';
  else if (star.brightness === 'dim') text += '【陷】';
  if (star.siHua) text += `化${star.siHua}`;
  return text;
}

function buildSiHuaSummary(chart: ZiweiChart): string {
  const parts: string[] = [];
  const stemIndex = getYearStemIndex(chart.birthInfo.year);
  const sihua = getSiHuaByStem(stemIndex);
  if (!sihua['禄']) return '';
  const labels: Record<string, string> = { '禄': '化禄', '权': '化权', '科': '化科', '忌': '化忌' };
  for (const [type, star] of Object.entries(sihua)) {
    if (star) {
      const palace = chart.palaces.find(p => p.stars.some(s => s.name === star));
      parts.push(`${star}${labels[type]}${palace ? `【${palace.name}】` : ''}`);
    }
  }
  return parts.join('、');
}
