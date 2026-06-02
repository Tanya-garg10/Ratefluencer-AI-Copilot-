'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Loader2, Eye, Heart, Share2, Bookmark } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { predictVirality, type ViralityPrediction } from '@/lib/api';

const CARD: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14 };

function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
}

export default function ViralityPage() {
    const [form, setForm] = useState({ topic: '', followers: 50000, engagement_rate: 3.5, content_type: 'reel' as const });
    const [result, setResult] = useState<ViralityPrediction | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true); setError('');
        try { setResult(await predictVirality(form)); }
        catch { setError('Backend offline — run uvicorn on port 8001.'); }
        finally { setLoading(false); }
    };

    const scoreColor = result ? (result.virality_score >= 70 ? '#34d399' : result.virality_score >= 40 ? '#fbbf24' : '#f87171') : '#8b5cf6';

    const metricCards = result ? [
        { label: 'Expected Reach', value: result.expected_reach, icon: Eye, color: '#a78bfa' },
        { label: 'Expected Likes', value: result.expected_likes, icon: Heart, color: '#f87171' },
        { label: 'Expected Shares', value: result.expected_shares, icon: Share2, color: '#22d3ee' },
        { label: 'Expected Saves', value: result.expected_saves, icon: Bookmark, color: '#fbbf24' },
    ] : [];

    const barData = result ? [
        { name: 'Reach', value: result.expected_reach },
        { name: 'Likes', value: result.expected_likes },
        { name: 'Shares', value: result.expected_shares },
        { name: 'Saves', value: result.expected_saves },
    ] : [];

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="animate-fadeIn">
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20 }}>

                {/* Form */}
                <div style={{ ...CARD, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 14, borderBottom: '1px solid var(--card-border)' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap style={{ width: 15, height: 15, color: '#fbbf24' }} />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>Prediction Inputs</span>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Content Topic</label>
                            <input className="input-styled" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. AI tools for creators" />
                        </div>

                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                                Followers <span style={{ color: '#a78bfa', fontWeight: 700 }}>{fmt(form.followers)}</span>
                            </label>
                            <input type="range" min={1000} max={10000000} step={1000} value={form.followers}
                                onChange={e => setForm(f => ({ ...f, followers: parseInt(e.target.value) }))}
                                style={{ width: '100%', accentColor: '#8b5cf6' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--foreground-muted)', marginTop: 2 }}>
                                <span>1K</span><span>10M</span>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                                Engagement Rate <span style={{ color: '#22d3ee', fontWeight: 700 }}>{form.engagement_rate}%</span>
                            </label>
                            <input type="range" min={0.1} max={20} step={0.1} value={form.engagement_rate}
                                onChange={e => setForm(f => ({ ...f, engagement_rate: parseFloat(e.target.value) }))}
                                style={{ width: '100%', accentColor: '#06b6d4' }} />
                        </div>

                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Content Type</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                                {(['reel', 'instagram', 'linkedin'] as const).map(t => (
                                    <button key={t} type="button" onClick={() => setForm(f => ({ ...f, content_type: t }))}
                                        style={{
                                            padding: '8px 0', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none', textTransform: 'capitalize', transition: 'all 0.15s',
                                            background: form.content_type === t ? 'linear-gradient(135deg,#7c3aed,#06b6d4)' : 'var(--input-bg)',
                                            color: form.content_type === t ? '#fff' : 'var(--foreground-muted)',
                                        }}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && <div style={{ fontSize: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: '#f87171' }}>{error}</div>}
                        <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center' }}>
                            {loading ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Predicting…</> : '⚡ Predict Virality'}
                        </button>
                    </form>
                </div>

                {/* Results */}
                <div>
                    <AnimatePresence>
                        {result ? (
                            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                                {/* Score */}
                                <div style={{ ...CARD, padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
                                    {/* Circle */}
                                    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                                        <svg width="80" height="80" viewBox="0 0 80 80">
                                            <circle cx="40" cy="40" r="32" fill="none" stroke="var(--input-bg)" strokeWidth="6" />
                                            <circle cx="40" cy="40" r="32" fill="none" stroke={scoreColor} strokeWidth="6"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 32}`}
                                                strokeDashoffset={`${2 * Math.PI * 32 * (1 - result.virality_score / 100)}`}
                                                transform="rotate(-90 40 40)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: scoreColor }}>
                                            {result.virality_score.toFixed(0)}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--foreground)' }}>{result.virality_score.toFixed(1)} / 100</div>
                                        <div style={{ fontSize: 12, color: 'var(--foreground-muted)' }}>Virality Score</div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: scoreColor, marginTop: 4 }}>
                                            {result.virality_score >= 70 ? '🔥 High Viral Potential' : result.virality_score >= 40 ? '📈 Moderate Potential' : '📉 Low Potential'}
                                        </div>
                                    </div>
                                </div>

                                {/* Metric cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                                    {metricCards.map((m, i) => (
                                        <motion.div key={m.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                                            style={{ ...CARD, padding: 14, textAlign: 'center' }}>
                                            <m.icon style={{ width: 18, height: 18, color: m.color, margin: '0 auto 6px' }} />
                                            <div style={{ fontSize: 20, fontWeight: 800, color: m.color }}>{fmt(m.value)}</div>
                                            <div style={{ fontSize: 11, color: 'var(--foreground-muted)', marginTop: 2 }}>{m.label}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Bar chart */}
                                <div style={{ ...CARD, padding: 16 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 12 }}>Engagement Distribution</div>
                                    <ResponsiveContainer width="100%" height={160}>
                                        <BarChart data={barData} barSize={36}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                            <XAxis dataKey="name" tick={{ fill: '#8888aa', fontSize: 11 }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fill: '#8888aa', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => fmt(v)} />
                                            <Tooltip contentStyle={{ background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                                                formatter={(v) => [fmt(Number(v ?? 0)), '']} />
                                            <Bar dataKey="value" fill="url(#vg)" radius={[5, 5, 0, 0]} />
                                            <defs>
                                                <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#ef4444" />
                                                </linearGradient>
                                            </defs>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        ) : (
                            <div style={{ ...CARD, padding: 60, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <Zap style={{ width: 40, height: 40, color: 'var(--foreground-muted)', opacity: 0.3, marginBottom: 12 }} />
                                <div style={{ fontSize: 14, color: 'var(--foreground-muted)' }}>Configure inputs to predict virality</div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
