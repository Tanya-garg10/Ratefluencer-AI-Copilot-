'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, FileText, BarChart3, RefreshCw, Loader2 } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import { getAdminDashboard, getInfluencers, type AdminDashboard, type InfluencerAnalysis } from '@/lib/api';

const CARD: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16 };
const PIE_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

const MOCK_DIST = [
    { range: '90-100', count: 12 }, { range: '80-89', count: 34 },
    { range: '70-79', count: 48 }, { range: '60-69', count: 29 }, { range: '<60', count: 19 },
];
const MOCK_CAT = [
    { category: 'AI', count: 28 }, { category: 'Tech', count: 35 },
    { category: 'Business', count: 22 }, { category: 'Fitness', count: 19 },
    { category: 'Fashion', count: 16 }, { category: 'Finance', count: 22 },
];

export default function AdminPage() {
    const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
    const [influencers, setInfluencers] = useState<InfluencerAnalysis[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        try {
            const [dash, infs] = await Promise.all([getAdminDashboard(), getInfluencers()]);
            setDashboard(dash);
            setInfluencers(infs);
        } catch { /* use mock */ }
        finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { load(); }, []);

    const refresh = () => { setRefreshing(true); load(); };

    const total = dashboard?.total_influencers ?? 142;
    const avgScore = dashboard?.average_score ?? 73.4;
    const content = dashboard?.content_generated ?? 389;
    const trends = dashboard?.active_trends ?? 25;

    const STATS = [
        { label: 'Total Influencers', value: String(total), icon: Users, color: '#8b5cf6' },
        { label: 'Average Score', value: Number(avgScore).toFixed(1), icon: BarChart3, color: '#06b6d4' },
        { label: 'Content Generated', value: String(content), icon: FileText, color: '#10b981' },
        { label: 'Active Trends', value: String(trends), icon: TrendingUp, color: '#f59e0b' },
    ];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }} className="animate-fadeIn">

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20 }}>
                <button onClick={refresh} disabled={refreshing}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid var(--card-border)', background: 'var(--card)', color: 'var(--foreground-muted)', fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--foreground)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--foreground-muted)'}
                >
                    <RefreshCw style={{ width: 14, height: 14, ...(refreshing ? { animation: 'spin 1s linear infinite' } : {}) }} />
                    Refresh
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
                {STATS.map((s, i) => (
                    <motion.div key={s.label}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ ...CARD, padding: '18px 20px' }}
                    >
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                            <s.icon style={{ width: 16, height: 16, color: s.color }} />
                        </div>
                        {loading ? <Loader2 style={{ width: 18, height: 18, color: 'var(--foreground-muted)', animation: 'spin 1s linear infinite' }} />
                            : <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--foreground)', lineHeight: 1 }}>{s.value}</div>
                        }
                        <div style={{ fontSize: 12, color: 'var(--foreground-muted)', marginTop: 4 }}>{s.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div style={{ ...CARD, padding: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>Score Distribution</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={MOCK_DIST} barSize={32} margin={{ left: -16 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="range" tick={{ fill: '#8888aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#8888aa', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} labelStyle={{ color: '#f0f0ff', fontWeight: 600 }} />
                            <Bar dataKey="count" fill="url(#adg)" radius={[5, 5, 0, 0]} name="Influencers" />
                            <defs>
                                <linearGradient id="adg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" /><stop offset="100%" stopColor="#4c1d95" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div style={{ ...CARD, padding: 20 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 16 }}>Category Breakdown</div>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie data={MOCK_CAT} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80}
                                label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                labelLine={{ stroke: '#8888aa' }}>
                                {MOCK_CAT.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Influencer table */}
            <div style={{ ...CARD, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>
                        Analyzed Influencers ({influencers.length})
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>Sorted by recent</span>
                </div>

                {influencers.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                                    {['Name', 'Category', 'Followers', 'Engagement', 'Authenticity', 'Score'].map(h => (
                                        <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--foreground-muted)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {influencers.map((inf, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{inf.name}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>{inf.category}</span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--foreground-muted)' }}>{(inf.followers ?? 0).toLocaleString()}</td>
                                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--foreground-muted)' }}>{(inf.engagement_rate ?? 0).toFixed(2)}%</td>
                                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--foreground-muted)' }}>{(inf.authenticity_score ?? 0).toFixed(1)}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                fontSize: 13, fontWeight: 800,
                                                color: (inf.ratefluencer_score ?? 0) >= 80 ? '#34d399' : (inf.ratefluencer_score ?? 0) >= 60 ? '#fbbf24' : '#f87171'
                                            }}>
                                                {(inf.ratefluencer_score ?? 0).toFixed(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: 48, textAlign: 'center', color: 'var(--foreground-muted)', fontSize: 13 }}>
                        No influencers analyzed yet — use the Influencer Engine to add data.
                    </div>
                )}
            </div>
        </div>
    );
}
