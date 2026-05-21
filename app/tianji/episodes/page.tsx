'use client';

import Link from 'next/link';
import { useState } from 'react';
import { TIANJI_EPISODES } from '@/lib/nihai';

const ac = '#d4a843';

const BVID = 'BV1XrsHzcEPG';
const YOUTUBE_PLAYLIST_ID = 'PLLUE1tBkV8HZ3FxUNpbLX2FedJn7IkZ78';

type Platform = 'bilibili' | 'youtube';

const START_INDEX = [
  1, 4, 7, 10, 13, 17, 21, 25, 29, 32, 36, 39,
  43, 46, 49, 52, 56, 59, 63, 66, 70, 73, 77, 81,
];

const VIDEO_RANGES = [
  '01-03', '04-06', '07-09', '10-12', '13-16', '17-20',
  '21-24', '25-28', '29-31', '32-35', '36-38', '39-42',
  '43-45', '46-48', '49-51', '52-55', '56-58', '59-62',
  '63-65', '66-69', '70-72', '73-76', '77-80', '81-83',
];

export default function TianjiEpisodesPage() {
  const [activeDvd, setActiveDvd] = useState<number | null>(null);
  const [platform, setPlatform] = useState<Platform>('bilibili');

  const totalHours = TIANJI_EPISODES.length * 2;

  function handleCardClick(dvd: number) {
    setActiveDvd(activeDvd === dvd ? null : dvd);
  }

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="max-w-3xl mx-auto px-6 pt-4">
        <Link href="/tianji" style={{
          fontSize: '12px', color: 'var(--tx-3)',
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          textDecoration: 'none',
        }}>
          ← 返回天纪
        </Link>
      </div>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-6 pb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.4))' }} />
          <span style={{ fontSize: '11px', color: ac, letterSpacing: '0.4em' }}>天纪 · 课程目录</span>
          <div style={{ height: '1px', width: '48px', background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.4))' }} />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--tx-0)', textAlign: 'center', letterSpacing: '0.1em', marginBottom: '8px' }}>
          24 集完整课程
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--tx-2)', textAlign: 'center', lineHeight: 1.7, marginBottom: '12px' }}>
          每集 2 小时 · 前半段命学 · 后半段易经 · 共 {totalHours} 小时
        </p>
        <div className="flex items-center justify-center gap-4 text-xs">
          <span style={{ color: 'var(--tx-3)' }}>
            总集数 <strong style={{ color: ac }}>{TIANJI_EPISODES.length}</strong>
          </span>
          <span style={{ color: 'var(--bdr)' }}>|</span>
          <span style={{ color: 'var(--tx-3)' }}>
            总时长 <strong style={{ color: ac }}>{totalHours}h</strong>
          </span>
          <span style={{ color: 'var(--bdr)' }}>|</span>
          <span style={{ color: 'var(--tx-3)' }}>
            录制年份 <strong style={{ color: ac }}>1994</strong>
          </span>
        </div>

        {/* Platform toggle */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {[
            { id: 'bilibili' as Platform, label: '🅱 B站' },
            { id: 'youtube' as Platform, label: '▶ YouTube' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              style={{
                padding: '6px 14px', cursor: 'pointer',
                background: platform === p.id ? ac : 'transparent',
                border: `1px solid ${platform === p.id ? ac : 'var(--bdr)'}`,
                borderRadius: '999px',
                fontSize: '12px', fontWeight: platform === p.id ? 600 : 400,
                color: platform === p.id ? '#fff' : 'var(--tx-3)',
                transition: 'all 0.2s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Episode grid */}
      <div className="max-w-3xl mx-auto px-6 pb-20 space-y-3">
        {TIANJI_EPISODES.map((ep, idx) => {
          const isActive = activeDvd === ep.dvd;
          return (
            <div key={ep.dvd} style={{
              background: 'var(--bg-card)',
              border: `1px solid ${isActive ? `${ac}50` : 'var(--bdr)'}`,
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: isActive ? `0 0 0 1px ${ac}30` : 'none',
            }}>
              <button
                onClick={() => handleCardClick(ep.dvd)}
                style={{
                  width: '100%', textAlign: 'left', background: 'none',
                  border: 'none', cursor: 'pointer', padding: '16px 20px',
                  display: 'flex', gap: '14px',
                }}
              >
                <span style={{
                  fontSize: '12px', fontWeight: 700, color: isActive ? '#fff' : 'var(--tx-2)',
                  background: isActive ? ac : `${ac}15`,
                  borderRadius: '8px', width: '32px',
                  height: '32px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  {ep.dvd}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: '13px', fontWeight: 600, color: isActive ? ac : 'var(--tx-0)' }}>
                      {ep.firstHalf}
                    </span>
                    <span style={{
                      fontSize: '10px', padding: '1px 8px', borderRadius: '999px',
                      background: `${ac}10`, color: ac, flexShrink: 0,
                    }}>
                      第 {VIDEO_RANGES[idx]} 集
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--tx-2)' }}>
                    {ep.secondHalf}
                  </div>
                </div>
                <span style={{
                  fontSize: '11px', color: 'var(--tx-3)',
                  transition: 'transform 0.25s', transform: isActive ? 'rotate(180deg)' : 'none',
                  flexShrink: 0, marginTop: '6px',
                }}>
                  ▼
                </span>
              </button>

              {/* Inline player + content */}
              {isActive && (
                <div style={{ borderTop: '1px solid var(--bdr)' }}>
                  {/* Player */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                    <iframe
                      key={`${platform}-${ep.dvd}`}
                      src={platform === 'bilibili'
                        ? `https://player.bilibili.com/player.html?bvid=${BVID}&p=${START_INDEX[idx]}&autoplay=0`
                        : `https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}&index=${START_INDEX[idx]}&rel=0`
                      }
                      style={{ width: '100%', height: '100%', border: 'none' }}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                  {/* Highlights */}
                  <div style={{ padding: '14px 20px' }}>
                    <div style={{ fontSize: '10px', color: ac, letterSpacing: '0.1em', marginBottom: '8px' }}>
                      DVD {ep.dvd} 内容要点
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ep.highlights.map((h, i) => (
                        <span key={i} style={{
                          fontSize: '11px', padding: '4px 12px',
                          background: `${ac}08`, border: `1px solid ${ac}15`,
                          borderRadius: '999px', color: 'var(--tx-2)',
                        }}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
