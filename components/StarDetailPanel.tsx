'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}

const STAR_DETAIL: Record<string, {
  niHaixia: string; classical: string; bestPalace: string; worstPalace: string;
  career: string; relationship: string; wealth: string; health: string;
}> = {
  '紫微': { niHaixia: '倪师认为紫微是皇帝星，坐命宫者有孤傲之气，喜独处，不喜被人管辖。紫微需要左辅右弼相夹才能发挥帝王气质，否则只是孤君，富而不贵。紫微在辰戌宫最佳，与天府形成双星格局，财官双美，可出将入相。', classical: '古诀：「紫微帝座临命主尊贵，统领众星，坐命者主权威显达。」', bestPalace: '命宫（辰戌）、官禄宫', worstPalace: '疾厄宫、夫妻宫', career: '政界、管理层、独立创业', relationship: '感情被动，自尊心强，需对方主动，有孤独倾向，晚婚则吉', wealth: '财运稳定，守成强于进取，辰戌位财官双美', health: '土属性，注意脾胃、消化系统' },
  '天机': { niHaixia: '倪师说天机是参谋星，最聪明的星，但聪明外漏则伤身。天机化忌最麻烦，代表聪明反被聪明误。天机属木，善变灵动，在命宫者思维敏捷，但往往多谋少决，需离开故乡远行才能发展。', classical: '古诀：「为人生精滑，自好作经营，天机星属木，商买皆多机见，离宗必远亲。」', bestPalace: '命宫（卯位）、官禄宫', worstPalace: '夫妻宫', career: '技术专家、谋士、研究员、IT、策划', relationship: '感情多变，想法太多，难以专一，宜晚婚', wealth: '靠智慧与技能赚钱，不擅守财', health: '木属性，注意肝胆、神经系统' },
  '太阳': { niHaixia: '倪师认为太阳是大男人主义的星，在卯至午位入庙，光明正大；午后渐落陷。太阳坐命的人慷慨好面子，男命宜，女命太强势。', classical: '古诀：「太阳居午为入庙，光辉大放，主贵显，男命最佳；落陷则孤寡劳碌。」', bestPalace: '命宫（卯至午）、官禄宫', worstPalace: '夫妻宫（女命）、疾厄宫', career: '公职、政界、管理、公关、教育、传媒', relationship: '男命缘佳但花心，女命独立强势，婚姻需磨合', wealth: '财运靠努力，慷慨好施，不擅积累', health: '火属性，注意心脏、眼睛' },
  '武曲': { niHaixia: '倪师视武曲为财帛主星，刚硬不屈，最怕孤克。武曲坐命的人意志坚定，适合金融、理财，但感情上太直，容易伤人。', classical: '古诀：「武曲属金，刚强之性，一生多刑克；守命于旺地，出将入相。」', bestPalace: '命宫（辰戌丑未）、财帛宫', worstPalace: '夫妻宫', career: '金融、军警、会计、工程', relationship: '感情直来直往，缺乏情趣，需要温柔伴侣互补', wealth: '财星本命，财运极强，理财能力超群', health: '金属性，注意肺部、呼吸系统、牙齿' },
  '天同': { niHaixia: '倪师说天同是福星，最懒的星。天同坐命喜享福，不爱竞争，适合稳定工作。天同与天梁同宫最好，可以享福又有保障。', classical: '古诀：「天同为福德之星，坐命者享福有余，主一生逍遥自在。」', bestPalace: '命宫、福德宫', worstPalace: '官禄宫', career: '服务业、娱乐、餐饮、文艺', relationship: '感情温和，不主动，婚姻较稳定', wealth: '财运不突出，靠稳定薪资', health: '水属性，注意肾脏、膀胱' },
  '廉贞': { niHaixia: '倪师认为廉贞是次桃花，才华横溢但感情复杂。廉贞化忌非常凶，代表官司、牢狱、意外。廉贞与天相同宫则化凶为吉，成行政印绶之格。', classical: '古诀：「廉贞为次桃花，才华横溢，感情多波折；廉相同宫，化凶为吉。」', bestPalace: '官禄宫（配天相）', worstPalace: '命宫（化忌时）', career: '艺术、娱乐、法律、公职（配天相）', relationship: '桃花多，感情复杂，宜晚婚', wealth: '财运起伏，靠才艺谋财', health: '火属性，注意心脏、血液' },
  '天府': { niHaixia: '倪师说天府是财库星，守成之星，不主动发财但能守住财富。天府坐命者稳重保守，女命最佳，能旺夫兴家。', classical: '古诀：「天府为财库之星，守命者稳重保守，主积财旺家；女命逢之，能旺夫益子。」', bestPalace: '命宫、财帛宫、田宅宫', worstPalace: '迁移宫', career: '行政管理、财务、保险、房地产', relationship: '感情稳定，顾家，是好的伴侣', wealth: '财运极佳，守财能力强，最适合积累型投资', health: '土属性，注意脾胃、消化' },
  '太阴': { niHaixia: '倪师认为太阴是财星，利女命，也是男命母亲和妻子的代表星。太阴入庙则财运极佳，陷地则财运受阻。', classical: '古诀：「太阴为财星，利女命；亥子入庙，光辉全照，财运极旺。」', bestPalace: '命宫（亥子）、财帛宫', worstPalace: '命宫（午位陷地）', career: '财务、金融、房地产、艺术、教育', relationship: '感情温柔细腻，重视内心感受', wealth: '入庙财运极旺，落陷则需努力', health: '水属性，注意肾脏、子宫（女命）' },
  '贪狼': { niHaixia: '倪师说贪狼是最多才多艺的星，桃花最重。贪狼化禄入命则魅力四射，人见人爱。贪狼属晚发之星，中年后才能真正发达。', classical: '古诀：「贪狼发福亨通，多才多艺，桃花最重；然难过三十岁，晚发者众。」', bestPalace: '命宫（化禄）、福德宫', worstPalace: '疾厄宫', career: '艺术、娱乐、公关、销售', relationship: '桃花极旺，感情多元化，宜晚婚', wealth: '靠人脉和才艺赚钱，中晚年才稳', health: '木属性，注意肝脏、肾脏' },
  '巨门': { niHaixia: '倪师认为巨门是口舌是非星，但化禄化权后转吉，变成靠口才赚钱的格局。巨门坐命多疑，善辩，适合律师、教师、销售。', classical: '古诀：「巨门为暗曜，主口舌是非；化禄权则转为以口才谋生。」', bestPalace: '官禄宫（化禄权）', worstPalace: '夫妻宫、疾厄宫（化忌）', career: '律师、教师、销售、主持人', relationship: '多疑多虑，沟通是婚姻关键', wealth: '靠口才和专业技能赚钱', health: '水属性，注意肾脏、耳朵、口腔' },
  '天相': { niHaixia: '倪师说天相是印绶星，负责行政庶务。天相坐命者中规中矩，适合公职行政。天相最需要有强星相配才能发挥，单独坐命较平淡。', classical: '古诀：「天相为印绶之星，主行政庶务；廉相同宫，化凶为吉。」', bestPalace: '官禄宫、命宫（配廉贞）', worstPalace: '财帛宫', career: '公职、行政管理、秘书、助理', relationship: '感情稳定，忠厚老实，是好的伴侣', wealth: '财运平稳，靠薪资积累', health: '水属性，注意肾脏、淋巴系统' },
  '天梁': { niHaixia: '倪师认为天梁是荫星，能保护别人，也代表医药宗教。天梁坐命者有长辈缘，早年多磨难，晚年享福。', classical: '古诀：「天梁为荫星，主庇荫保护；坐命者有长辈缘，早年受磨练，晚年享清福。」', bestPalace: '命宫、父母宫、福德宫', worstPalace: '命宫（化忌时）', career: '医疗、宗教、法律、社工、慈善', relationship: '感情多与年龄差距较大者', wealth: '财运靠贵人相助，早年财运不佳', health: '土属性，注意脾胃、骨骼' },
  '七杀': { niHaixia: '倪师说七杀是将军星，果决冲劲强，但有孤克之性。七杀坐命必须有辅星化解孤性，否则六亲缘薄。', classical: '古诀：「七杀为将军之星，果决冲劲强；守命者孤克性重，六亲缘薄。」', bestPalace: '命宫（有辅星）、官禄宫', worstPalace: '夫妻宫、父母宫', career: '军警、创业、金融交易', relationship: '感情孤克，需要能包容强势个性的对象', wealth: '财运波动大，有机会大富', health: '金属性，注意肺部、大肠' },
  '破军': { niHaixia: '倪师说破军是最能破旧立新的星，也是最孤克的星之一。破军化禄后才变好，代表能破而后立。破军坐命六亲缘薄，但开创能力极强。', classical: '古诀：「破军为最能破旧立新之星，坐命者孤克，六亲缘薄，然开创能力超强。」', bestPalace: '官禄宫（化禄）、迁移宫', worstPalace: '夫妻宫、父母宫', career: '开创型事业、军警、改革', relationship: '感情多波折，离合不定', wealth: '财运起伏大，化禄后财运转好', health: '水属性，注意肾脏、膀胱' },
};

const siHuaColors: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
};

const levelConfig = {
  major: { label: '主星', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: '吉星', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: '煞星', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: '杂星', color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const desc = star ? STAR_DESCRIPTIONS[star.name] : null;
  const detail = star ? STAR_DETAIL[star.name] : null;
  const typeConfig = star ? levelConfig[star.type] : null;

  return (
    <AnimatePresence>
      {star && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }} className="card-glass rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: 'var(--t-gold)' }}>{star.name}</span>
              {typeConfig && <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>{typeConfig.label}</span>}
              {star.siHua && <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${siHuaColors[star.siHua] || ''}`}>化{star.siHua}</span>}
            </div>
            <button onClick={onClose} className="transition-colors text-lg leading-none" style={{ color: 'var(--t-faint)' }}>×</button>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {desc && (
              <div className="flex flex-wrap gap-1.5">
                {[`五行 · ${desc.element}`, `性质 · ${desc.nature}`, ...(palaceName ? [`位置 · ${palaceName}`] : []),
                  ...(star.brightness ? [star.brightness === 'bright' ? '庙旺' : star.brightness === 'dim' ? '落陷' : '平和'] : [])].map(tag => (
                  <div key={tag} className="text-[10px] px-2 py-1 rounded-full"
                    style={{ border: '1px solid var(--t-border)', color: tag.includes('庙旺') ? '#eab308' : tag.includes('落陷') ? '#ef4444' : 'var(--t-text2)' }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}
            {desc && (
              <div>
                <div className="text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--t-faint)' }}>星曜特质</div>
                <div className="flex flex-wrap gap-1.5">
                  {desc.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(212,168,67,0.06)' }}>{k.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'var(--t-gold)', opacity: 0.7 }}>古书原文</div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--t-gold)', opacity: 0.8 }}>{detail.classical}</p>
              </div>
            )}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                    倪海夏老师解读
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>{detail.niHaixia}</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: '事业方向', value: detail.career, icon: '◈' },
                    { label: '感情特质', value: detail.relationship, icon: '♡' },
                    { label: '财运分析', value: detail.wealth, icon: '◆' },
                    { label: '健康提示', value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.label} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: 'var(--t-faint)' }}><span>{item.icon}</span><span>{item.label}</span></div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-500 mb-0.5 font-medium">最佳宫位</div>
                    <div className="text-emerald-500/70">{detail.bestPalace}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-500 mb-0.5 font-medium">注意宫位</div>
                    <div className="text-red-500/70">{detail.worstPalace}</div>
                  </div>
                </div>
              </>
            )}
            {!detail && star.type !== 'major' && (
              <div className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                {star.name === '文昌' && '文昌入宫，主学业考试顺利，文书印鉴有利，宜从事文字相关工作。'}
                {star.name === '文曲' && '文曲入宫，主才艺出众，口才佳，善于表达，艺术天赋强。'}
                {star.name === '左辅' && '左辅入宫，主贵人相助，有人提携，该宫位事项受到善意支持。'}
                {star.name === '右弼' && '右弼入宫，主贵人相助，多出女性贵人，该宫位事项有人协助。'}
                {star.name === '天魁' && '天魁入宫，主白天出生的贵人，男性贵人多，逢凶化吉之力。'}
                {star.name === '天钺' && '天钺入宫，主夜晚出生的贵人，女性贵人多，增添吉祥之气。'}
                {star.name === '禄存' && '禄存入宫，主财禄守成，该宫位有财气，但属于保守型财运。'}
                {star.name === '天马' && '天马入宫，主奔波动荡，动中求财，宜主动出击，不宜守株待兔。'}
                {star.name === '地空' && '地空入宫，主该宫位事项有落空感，精神耗散，宜注意心理健康。'}
                {star.name === '地劫' && '地劫入宫，主该宫位事项有意外损失，财物需谨慎，防小人。'}
                {star.name === '火星' && '火星入宫，主该宫位事项急躁冲动，情绪波动，但若遇贪狼则反吉。'}
                {star.name === '铃星' && '铃星入宫，主该宫位事项有暗中阻碍，防背后小人，凡事宜低调。'}
                {star.name === '擎羊' && '擎羊入宫，主刑克，该宫位事项多波折，有血光之灾或意外。'}
                {star.name === '陀罗' && '陀罗入宫，主是非缠身，该宫位事项拖延不决，凡事宜早做准备。'}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}