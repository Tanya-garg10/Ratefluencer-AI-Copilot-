'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, FileText, BarChart3,
  ArrowUpRight, Zap, Video, ShieldAlert,
  Building2, Star,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, Bar, CartesianGrid,
} from 'recharts';
import { getAdminDashboard, type AdminDashboard } from '@/lib/api';
import Link from 'next/link';

/* ── Mock data ─────────────────────────────────────────── */
const MOCK: AdminDashboard = {
  total_influencers: 142,
  average_score: 73.4,
  content_generated: 389,
  active_trends: 25,
  recent_analyses: [
    { name: 'Alex Tech', category: 'Technology', ratefluencer_score: 87.2, date: '2026-06-01' },
    { name: 'Priya Fitness', category: 'Fitness', ratefluencer_score: 79.5, date: '2026-06-01' },
    { name: 'Marcus AI', category: 'AI', ratefluencer_score: 92.1, date: '2026-05-31' },
    { name: 'Sarah Style', category: 'Fashion', ratefluencer_score: 68.3, date: '2026-05-31' },
    { name: 'Dev Startups', category: 'Startups', ratefluencer_score: 84.7, date: '2026-05-30' },
  ],
  score_distribution: [
    { range: '90-100', count: 12 },
    { range: '80-89', count: 34 },
    { range: '70-79', count: 48 },
    { range: '60-69', count: 29 },
    { range: '<60', count: 19 },
  ],
  category_breakdown: [],
  top_trends: [
    { topic: 'AI Agents in Production', score: 97 },
    { topic: 'Creator Economy 3.0', score: 94 },
    { topic: 'AI-First Startups', score: 96 },
    { topic: 'AI Code Generation', score: 93 },
    { topic: 'Solo Founders', score: 90 },
  ],
};

const ACTIVITY = [
  { day: 'Mon', analyses: 18, content: 32 },
  { day: 'Tue', analyses: 24, content: 41 },
  { day: 'Wed', analyses: 31, content: 55 },
  { day: 'Thu', analyses: 22, content: 38 },
  { day: 'Fri', analyses: 44, content: 72 },
  { day: 'Sat', analyses: 28, content: 49 },
  { day: 'Sun', analyses: 35, content: 62 },
];

const QUICK_LINKS = [
  { href: '/influencer', label: 'Influencer Engine', desc: 'Score any creator', icon: Users, color: '#8b5cf6' },
  { href: '/fake-detection', label: 'Fake Detection', desc: 'Bot & fraud check', icon: ShieldAlert, color: '#ef4444' },
  { href: '/reel-creator', label: 'Reel Creator', desc: 'Viral AI scripts', icon: Video, color: '#f59e0b' },
  { href: '/brand-match', label: 'Brand Match', desc: 'Find brand partners', icon: Building2, color: '#06b6d4' },
  { href: '/trends', label: 'Trend Discovery', desc: 'Trending topics', icon: TrendingUp, color: '#10b981' },
  { href: '/virality', label: 'Virality Engine', desc: 'Predict reach', icon: Zap, color: '#f472b6' },
];

/* ── Component ─────────────────────────────────────────── */
export default function DashboardPage() {
  const [data, setData] = useState<AdminDashboard>(MOCK);

  useEffect(() => {
    getAdminDashboard()
      .then(d => setData(prev => ({
        ...prev,
        total_influencers: d.total_influencers || prev.total_influencers,
        average_score: d.average_score || prev.average_score,
        content_generated: d.content_generated || prev.content_generated,
        active_trends: d.active_trends || prev.active_trends,
      })))
      .catch(() => { });
  }, []);

  const STATS = [
    { label: 'Total Influencers', value: data.total_influencers.toLocaleString(), icon: Users, change: '+12%', color: '#8b5cf6' },
    { label: 'Avg Score', value: data.average_score.toFixed(1), icon: Star, change: '+3.2', color: '#06b6d4' },
    { label: 'Content Generated', value: data.content_generated.toLocaleString(), icon: FileText, change: '+28%', color: '#10b981' },
    { label: 'Active Trends', value: String(data.active_trends), icon: TrendingUp, change: '+5', color: '#f59e0b' },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Stat cards ─────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        {STATS.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: '18px 20px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon style={{ width: 16, height: 16, color: s.color }} />
              </div>
              <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 11, fontWeight: 700, color: '#34d399' }}>
                <ArrowUpRight style={{ width: 12, height: 12 }} />{s.change}
              </span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--foreground)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--foreground-muted)', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Quick links ─────────────────────────────────── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--foreground-muted)', marginBottom: 10 }}>
          Quick Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
          {QUICK_LINKS.map((q, i) => (
            <Link key={q.href} href={q.href} style={{ textDecoration: 'none' }}>
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14, padding: '14px 14px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${q.color}50`;
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = `0 8px 24px ${q.color}18`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--card-border)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 9, background: `${q.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <q.icon style={{ width: 15, height: 15, color: q.color }} />
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.3 }}>{q.label}</div>
                <div style={{ fontSize: 11, color: 'var(--foreground-muted)', marginTop: 2 }}>{q.desc}</div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Charts row ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 14 }}>

        {/* Activity area chart */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 2 }}>Weekly Activity</div>
          <div style={{ fontSize: 11, color: 'var(--foreground-muted)', marginBottom: 16 }}>Analyses & content generated</div>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={ACTIVITY} margin={{ left: -10 }}>
              <defs>
                <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#8888aa', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8888aa', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} labelStyle={{ color: '#f0f0ff', fontWeight: 600 }} />
              <Area type="monotone" dataKey="analyses" stroke="#8b5cf6" strokeWidth={2} fill="url(#ga)" name="Analyses" />
              <Area type="monotone" dataKey="content" stroke="#06b6d4" strokeWidth={2} fill="url(#gc)" name="Content" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Score distribution bar chart */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 2 }}>Score Distribution</div>
          <div style={{ fontSize: 11, color: 'var(--foreground-muted)', marginBottom: 16 }}>Influencer score ranges</div>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={data.score_distribution} barSize={30} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" tick={{ fill: '#8888aa', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8888aa', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} labelStyle={{ color: '#f0f0ff', fontWeight: 600 }} />
              <Bar dataKey="count" fill="url(#bg)" radius={[5, 5, 0, 0]} name="Count" />
              <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#4c1d95" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom row ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Recent analyses */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--card-border)', fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>
            Recent Analyses
          </div>
          <div style={{ padding: '8px 12px' }}>
            {data.recent_analyses.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 10px', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,rgba(139,92,246,0.3),rgba(6,182,212,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#a78bfa', flexShrink: 0 }}>
                  {a.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{a.category}</div>
                </div>
                <ScoreBadge score={a.ratefluencer_score} />
              </div>
            ))}
          </div>
        </div>

        {/* Top trends */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap style={{ width: 15, height: 15, color: '#fbbf24' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>Top Trends Right Now</span>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {data.top_trends.map((t, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#8888aa', minWidth: 20, flexShrink: 0 }}>#{i + 1}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.topic}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#a78bfa', marginLeft: 8, flexShrink: 0 }}>{t.score}</span>
                </div>
                <div style={{ height: 5, background: 'var(--input-bg)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${t.score}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg,#8b5cf6,#06b6d4)', borderRadius: 99 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const bg = score >= 85 ? 'rgba(16,185,129,0.15)' : score >= 70 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)';
  const color = score >= 85 ? '#34d399' : score >= 70 ? '#fbbf24' : '#f87171';
  return (
    <span style={{ fontSize: 12, fontWeight: 800, padding: '3px 9px', borderRadius: 8, background: bg, color, flexShrink: 0 }}>
      {score.toFixed(1)}
    </span>
  );
}
