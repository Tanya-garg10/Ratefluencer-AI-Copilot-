'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Loader2, ChevronDown, ChevronUp,
    TrendingUp, ShieldCheck, Zap, Building2,
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, RadarChart,
    PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { analyzeInfluencer, type InfluencerAnalysis, type InfluencerInput } from '@/lib/api';

const CARD: React.CSSProperties = {
    background: 'var(--card)',
    border: '1px solid var(--card-border)',
    borderRadius: 16,
};

const CATEGORIES = [
    'AI', 'Technology', 'Business', 'Startups', 'Finance', 'Marketing',
    'Fitness', 'Fashion', 'Food', 'Travel', 'Lifestyle', 'Gaming',
    'Education', 'Health', 'Sports', 'Entertainment',
];

const MOCK_GROWTH = [
    { month: 'Jan', followers: 45000 },
    { month: 'Feb', followers: 48500 },
    { month: 'Mar', followers: 52000 },
    { month: 'Apr', followers: 57000 },
    { month: 'May', followers: 63000 },
    { month: 'Jun', followers: 70000 },
    { month: 'Jul', followers: 78000 },
];

const SAMPLES = [
    {
        label: 'Tech Creator', color: '#a78bfa',
        data: { name: 'Tech Creator', followers: 250000, following: 800, avg_likes: 8500, avg_comments: 420, avg_shares: 280, avg_saves: 190, posting_frequency: 1.5, category: 'Technology' },
    },
    {
        label: 'Fitness Pro', color: '#34d399',
        data: { name: 'Fitness Pro', followers: 80000, following: 600, avg_likes: 3200, avg_comments: 180, avg_shares: 95, avg_saves: 340, posting_frequency: 2, category: 'Fitness' },
    },
    {
        label: 'AI Creator', color: '#22d3ee',
        data: { name: 'AI Creator', followers: 500000, following: 1200, avg_likes: 18000, avg_comments: 890, avg_shares: 540, avg_saves: 720, posting_frequency: 1, category: 'AI' },
    },
];

export default function InfluencerPage() {
    const [form, setForm] = useState<InfluencerInput>({
        name: '', followers: 0, following: 0, avg_likes: 0, avg_comments: 0,
        avg_shares: 0, avg_saves: 0, posting_frequency: 1, category: 'Technology',
    });
    const [result, setResult] = useState<InfluencerAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showBrands, setShowBrands] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try { setResult(await analyzeInfluencer(form)); }
        catch { setError('Backend offline — run: uvicorn main:app --reload --port 8001'); }
        finally { setLoading(false); }
    };

    const radarData = result ? [
        { subject: 'Engagement', val: Math.min(result.engagement_rate * 10, 100) },
        { subject: 'Authenticity', val: result.authenticity_score },
        { subject: 'Growth', val: result.growth_potential },
        { subject: 'Brand Match', val: result.brand_match_score },
        { subject: 'Overall', val: result.ratefluencer_score },
    ] : [];

    const SCORES = result ? [
        { label: 'Ratefluencer Score', value: result.ratefluencer_score, icon: Zap, color: '#8b5cf6' },
        { label: 'Authenticity', value: result.authenticity_score, icon: ShieldCheck, color: '#06b6d4' },
        { label: 'Growth Potential', value: result.growth_potential, icon: TrendingUp, color: '#10b981' },
        { label: 'Brand Match', value: result.brand_match_score, icon: Building2, color: '#f59e0b' },
    ] : [];

    return (
        <div style={{ maxWidth: 1200, margin: '0 auto' }} className="animate-fadeIn">
            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20, alignItems: 'start' }}>

                {/* ── LEFT: Form ─────────────────────────────────────── */}
                <div style={{ ...CARD, padding: 22 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, marginBottom: 18, borderBottom: '1px solid var(--card-border)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users style={{ width: 16, height: 16, color: '#a78bfa' }} />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>Influencer Details</span>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {/* Name */}
                        <FormField label="Full Name">
                            <input className="input-styled" value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder="e.g. Alex Johnson" />
                        </FormField>

                        {/* Followers / Following */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <FormField label="Followers">
                                <input type="number" min={0} className="input-styled" value={form.followers || ''}
                                    onChange={e => setForm(f => ({ ...f, followers: +e.target.value || 0 }))} />
                            </FormField>
                            <FormField label="Following">
                                <input type="number" min={0} className="input-styled" value={form.following || ''}
                                    onChange={e => setForm(f => ({ ...f, following: +e.target.value || 0 }))} />
                            </FormField>
                        </div>

                        {/* Likes / Comments */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <FormField label="Avg Likes">
                                <input type="number" min={0} className="input-styled" value={form.avg_likes || ''}
                                    onChange={e => setForm(f => ({ ...f, avg_likes: +e.target.value || 0 }))} />
                            </FormField>
                            <FormField label="Avg Comments">
                                <input type="number" min={0} className="input-styled" value={form.avg_comments || ''}
                                    onChange={e => setForm(f => ({ ...f, avg_comments: +e.target.value || 0 }))} />
                            </FormField>
                        </div>

                        {/* Shares / Saves */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <FormField label="Avg Shares">
                                <input type="number" min={0} className="input-styled" value={form.avg_shares || ''}
                                    onChange={e => setForm(f => ({ ...f, avg_shares: +e.target.value || 0 }))} />
                            </FormField>
                            <FormField label="Avg Saves">
                                <input type="number" min={0} className="input-styled" value={form.avg_saves || ''}
                                    onChange={e => setForm(f => ({ ...f, avg_saves: +e.target.value || 0 }))} />
                            </FormField>
                        </div>

                        {/* Posts/day + Category */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <FormField label="Posts / Day">
                                <input type="number" min={0} step={0.1} className="input-styled" value={form.posting_frequency || ''}
                                    onChange={e => setForm(f => ({ ...f, posting_frequency: +e.target.value || 0 }))} />
                            </FormField>
                            <FormField label="Category">
                                <select className="input-styled" value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </FormField>
                        </div>

                        {/* Quick fills */}
                        <div style={{ paddingTop: 4 }}>
                            <div style={{ fontSize: 11, color: 'var(--foreground-muted)', marginBottom: 8 }}>Quick fill:</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {SAMPLES.map(s => (
                                    <button key={s.label} type="button"
                                        onClick={() => setForm(s.data)}
                                        style={{ fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 8, cursor: 'pointer', background: `${s.color}15`, border: `1px solid ${s.color}30`, color: s.color, transition: 'all 0.15s' }}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div style={{ fontSize: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', color: '#f87171' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading || !form.name} className="btn-primary" style={{ justifyContent: 'center', marginTop: 4 }}>
                            {loading
                                ? <><Loader2 style={{ width: 15, height: 15 }} className="animate-spin" /> Analyzing…</>
                                : '🔍 Analyze Influencer'
                            }
                        </button>
                    </form>
                </div>

                {/* ── RIGHT: Results ─────────────────────────────────── */}
                <div>
                    <AnimatePresence>
                        {result ? (
                            <motion.div key="results" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                                {/* 4 Score cards */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
                                    {SCORES.map(s => (
                                        <div key={s.label} style={{ ...CARD, padding: '16px 14px', textAlign: 'center' }}>
                                            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                                                <s.icon style={{ width: 16, height: 16, color: s.color }} />
                                            </div>
                                            <div style={{ fontSize: 24, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value.toFixed(1)}</div>
                                            <div style={{ fontSize: 11, color: 'var(--foreground-muted)', marginTop: 4, lineHeight: 1.3 }}>{s.label}</div>
                                            <div style={{ height: 4, background: 'var(--input-bg)', borderRadius: 99, overflow: 'hidden', marginTop: 8 }}>
                                                <div style={{ height: '100%', width: `${s.value}%`, background: s.color, borderRadius: 99, transition: 'width 0.8s ease' }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Engagement rate bar */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderRadius: 12, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                                    <span style={{ fontSize: 13, color: 'var(--foreground-muted)', flexShrink: 0 }}>Engagement Rate</span>
                                    <div style={{ flex: 1, height: 8, background: 'var(--input-bg)', borderRadius: 99, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(result.engagement_rate * 10, 100)}%`, background: 'linear-gradient(90deg,#8b5cf6,#06b6d4)', borderRadius: 99 }} />
                                    </div>
                                    <span style={{ fontSize: 18, fontWeight: 800, color: '#a78bfa', flexShrink: 0 }}>{result.engagement_rate.toFixed(2)}%</span>
                                </div>

                                {/* Charts row */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                    <div style={{ ...CARD, padding: 16 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginBottom: 12 }}>Score Radar</div>
                                        <ResponsiveContainer width="100%" height={180}>
                                            <RadarChart data={radarData}>
                                                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#8888aa', fontSize: 10 }} />
                                                <Radar dataKey="val" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} strokeWidth={2} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div style={{ ...CARD, padding: 16 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)', marginBottom: 12 }}>Growth Forecast</div>
                                        <ResponsiveContainer width="100%" height={180}>
                                            <LineChart data={MOCK_GROWTH} margin={{ left: -16 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                                <XAxis dataKey="month" tick={{ fill: '#8888aa', fontSize: 10 }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fill: '#8888aa', fontSize: 9 }} axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{ background: '#1c1c2a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
                                                <Line type="monotone" dataKey="followers" stroke="#8b5cf6" strokeWidth={2.5} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Brand matches */}
                                <div style={{ ...CARD, overflow: 'hidden' }}>
                                    <button onClick={() => setShowBrands(!showBrands)}
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)', fontSize: 14, fontWeight: 700 }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'none'}
                                    >
                                        <span>Top Brand Matches ({result.brand_matches.length})</span>
                                        {showBrands
                                            ? <ChevronUp style={{ width: 16, height: 16, color: 'var(--foreground-muted)' }} />
                                            : <ChevronDown style={{ width: 16, height: 16, color: 'var(--foreground-muted)' }} />
                                        }
                                    </button>
                                    <AnimatePresence>
                                        {showBrands && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden', borderTop: '1px solid var(--card-border)' }}>
                                                <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                    {result.brand_matches.map((b, i) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, background: 'var(--input-bg)' }}>
                                                            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#a78bfa', flexShrink: 0 }}>
                                                                {b.brand_name.charAt(0)}
                                                            </div>
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)' }}>{b.brand_name}</div>
                                                                <div style={{ fontSize: 11, color: 'var(--foreground-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {b.reasoning.slice(0, 75)}…
                                                                </div>
                                                            </div>
                                                            <span style={{ fontSize: 14, fontWeight: 800, color: '#34d399', flexShrink: 0 }}>{b.match_percentage}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ ...CARD, padding: 60, textAlign: 'center', minHeight: 320, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    <Users style={{ width: 24, height: 24, color: '#a78bfa', opacity: 0.5 }} />
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>No Analysis Yet</div>
                                <div style={{ fontSize: 13, color: 'var(--foreground-muted)' }}>Fill in the form and click Analyze</div>
                                <div style={{ fontSize: 12, color: 'var(--foreground-muted)', marginTop: 4, opacity: 0.6 }}>ML scoring across 5 dimensions</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                {label}
            </label>
            {children}
        </div>
    );
}
