'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Loader2, Zap, Users, BarChart3 } from 'lucide-react';
import { getTrends } from '@/lib/api';

const CARD: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14 };

interface Trend { topic: string; trend_score: number; growth_velocity: string; audience_relevance: number; category: string; }
interface TrendsGrouped { category: string; trends: Trend[]; }

const CAT_ACCENT: Record<string, { color: string; bg: string }> = {
    AI: { color: '#a78bfa', bg: 'rgba(139,92,246,0.12)' },
    Technology: { color: '#22d3ee', bg: 'rgba(6,182,212,0.12)' },
    Business: { color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
    Startups: { color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
    Finance: { color: '#f87171', bg: 'rgba(239,68,68,0.12)' },
};
const DEFAULT_ACCENT = { color: '#a78bfa', bg: 'rgba(139,92,246,0.12)' };

export default function TrendsPage() {
    const [groups, setGroups] = useState<TrendsGrouped[]>([]);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState('All');

    useEffect(() => {
        getTrends().then(d => setGroups(d as unknown as TrendsGrouped[])).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const categories = ['All', ...groups.map(g => g.category)];
    const filtered = active === 'All' ? groups : groups.filter(g => g.category === active);

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }} className="animate-fadeIn">

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                {categories.map(cat => {
                    const on = active === cat;
                    return (
                        <button key={cat} onClick={() => setActive(cat)}
                            style={{
                                padding: '7px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none',
                                background: on ? 'linear-gradient(135deg,#7c3aed,#06b6d4)' : 'var(--card)',
                                color: on ? '#fff' : 'var(--foreground-muted)',
                                outline: on ? 'none' : '1px solid var(--card-border)',
                                transition: 'all 0.15s',
                            }}>
                            {cat}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                    <Loader2 style={{ width: 32, height: 32, color: '#8b5cf6', animation: 'spin 1s linear infinite' }} />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                    {filtered.map((group, gi) => {
                        const acc = CAT_ACCENT[group.category] ?? DEFAULT_ACCENT;
                        return (
                            <motion.div key={group.category} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.08 }}>
                                {/* Group header */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                    <div style={{ width: 30, height: 30, borderRadius: 8, background: acc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <TrendingUp style={{ width: 15, height: 15, color: acc.color }} />
                                    </div>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>{group.category}</span>
                                    <span style={{ fontSize: 11, fontWeight: 600, background: acc.bg, color: acc.color, border: `1px solid ${acc.color}40`, borderRadius: 20, padding: '2px 10px' }}>
                                        {group.trends.length} trends
                                    </span>
                                </div>

                                {/* Trend cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                                    {group.trends.map((t, ti) => (
                                        <motion.div key={ti} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: gi * 0.08 + ti * 0.04 }}
                                            style={{ ...CARD, padding: 16, cursor: 'default', transition: 'border-color 0.15s' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${acc.color}50`}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--card-border)'}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', flex: 1, marginRight: 8, lineHeight: 1.4 }}>{t.topic}</span>
                                                <span style={{ fontSize: 13, fontWeight: 800, color: acc.color, background: acc.bg, padding: '3px 8px', borderRadius: 8, flexShrink: 0 }}>{t.trend_score}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                                <Row icon={<Zap style={{ width: 12, height: 12, color: '#fbbf24' }} />} label="Growth" value={t.growth_velocity} valueColor="#fbbf24" />
                                                <Row icon={<Users style={{ width: 12, height: 12, color: '#22d3ee' }} />} label="Relevance" value={`${t.audience_relevance}%`} valueColor="#22d3ee" />
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <BarChart3 style={{ width: 12, height: 12, color: acc.color, flexShrink: 0 }} />
                                                    <span style={{ fontSize: 11, color: 'var(--foreground-muted)', minWidth: 50 }}>Score</span>
                                                    <div style={{ flex: 1, height: 4, background: 'var(--input-bg)', borderRadius: 99, overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${t.trend_score}%`, background: acc.color, borderRadius: 99 }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function Row({ icon, label, value, valueColor }: { icon: React.ReactNode; label: string; value: string; valueColor: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: 11, color: 'var(--foreground-muted)', flex: 1 }}>{label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: valueColor }}>{value}</span>
        </div>
    );
}
