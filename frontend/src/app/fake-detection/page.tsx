'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldCheck, ShieldX, AlertTriangle, Loader2 } from 'lucide-react';

const CARD: React.CSSProperties = {
    background: 'var(--card)',
    border: '1px solid var(--card-border)',
    borderRadius: 16,
};

interface FakeResult {
    authenticity_score: number;
    risk_level: 'Low' | 'Medium' | 'High';
    risk_indicators: { indicator: string; severity: string; details: string }[];
    suspicious_patterns: string[];
}

async function detectFake(d: { followers: number; following: number; avg_likes: number; avg_comments: number; avg_shares: number }): Promise<FakeResult> {
    const res = await fetch('http://localhost:8001/api/influencer/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'FakeCheck', followers: d.followers, following: d.following, avg_likes: d.avg_likes, avg_comments: d.avg_comments, avg_shares: d.avg_shares, avg_saves: 0, posting_frequency: 1, category: 'Technology' }),
    });
    if (!res.ok) throw new Error('API error');
    return (await res.json()).fake_detection;
}

const SEV: Record<string, { color: string; bg: string; border: string; Icon: React.ElementType }> = {
    High: { color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)', Icon: ShieldX },
    Medium: { color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', Icon: AlertTriangle },
    Low: { color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', Icon: ShieldCheck },
    None: { color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', Icon: ShieldCheck },
};

const RISK_CONFIG: Record<string, { color: string; bg: string; border: string; title: string; Icon: React.ElementType }> = {
    Low: { color: '#34d399', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', title: 'Authentic Profile', Icon: ShieldCheck },
    Medium: { color: '#fbbf24', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', title: 'Review Recommended', Icon: AlertTriangle },
    High: { color: '#f87171', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', title: 'Likely Fake Activity', Icon: ShieldX },
};

const SAMPLES = [
    { label: 'Authentic', color: '#34d399', data: { followers: 100000, following: 500, avg_likes: 3500, avg_comments: 180, avg_shares: 120 } },
    { label: 'Suspicious', color: '#fbbf24', data: { followers: 500000, following: 490000, avg_likes: 200, avg_comments: 5, avg_shares: 8 } },
    { label: 'Bot-like', color: '#f87171', data: { followers: 1000000, following: 1200, avg_likes: 180, avg_comments: 3, avg_shares: 2 } },
];

const FIELDS: [keyof typeof SAMPLES[0]['data'], string][] = [
    ['followers', 'Total Followers'],
    ['following', 'Total Following'],
    ['avg_likes', 'Average Likes per Post'],
    ['avg_comments', 'Average Comments per Post'],
    ['avg_shares', 'Average Shares per Post'],
];

export default function FakeDetectionPage() {
    const [form, setForm] = useState({ followers: 0, following: 0, avg_likes: 0, avg_comments: 0, avg_shares: 0 });
    const [result, setResult] = useState<FakeResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true); setError('');
        try { setResult(await detectFake(form)); }
        catch { setError('Backend offline — run: uvicorn main:app --reload --port 8001'); }
        finally { setLoading(false); }
    };

    const rc = result ? RISK_CONFIG[result.risk_level] : null;

    return (
        <div style={{ maxWidth: 1100, margin: '0 auto' }} className="animate-fadeIn">
            <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, alignItems: 'start' }}>

                {/* ── LEFT: Form ──────────────────────────────── */}
                <div style={{ ...CARD, padding: 22 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, marginBottom: 18, borderBottom: '1px solid var(--card-border)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldAlert style={{ width: 16, height: 16, color: '#f87171' }} />
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)' }}>Enter Metrics</span>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {FIELDS.map(([key, label]) => (
                            <div key={key}>
                                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                                    {label}
                                </label>
                                <input type="number" min={0} className="input-styled"
                                    value={form[key] || ''}
                                    onChange={e => setForm(f => ({ ...f, [key]: +e.target.value || 0 }))} />
                            </div>
                        ))}

                        {/* Quick samples */}
                        <div style={{ paddingTop: 4 }}>
                            <div style={{ fontSize: 11, color: 'var(--foreground-muted)', marginBottom: 8 }}>Quick samples:</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {SAMPLES.map(s => (
                                    <button key={s.label} type="button" onClick={() => setForm(s.data)}
                                        style={{ fontSize: 11, fontWeight: 600, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', background: `${s.color}15`, border: `1px solid ${s.color}30`, color: s.color, transition: 'all 0.15s', flex: 1 }}>
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

                        <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', marginTop: 4 }}>
                            {loading
                                ? <><Loader2 style={{ width: 15, height: 15 }} className="animate-spin" /> Analyzing…</>
                                : '🔍 Detect Fake Followers'
                            }
                        </button>
                    </form>

                    {/* Info box */}
                    <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)', fontSize: 11, color: '#c4b5fd', lineHeight: 1.6 }}>
                        Checks follower/following ratio, engagement rate anomalies, like/comment ratios, and bot-like patterns to compute an authenticity score.
                    </div>
                </div>

                {/* ── RIGHT: Results ───────────────────────────── */}
                <div>
                    <AnimatePresence>
                        {result && rc ? (
                            <motion.div key="result" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                                {/* Risk banner */}
                                <div style={{ borderRadius: 16, padding: '28px 24px', textAlign: 'center', background: rc.bg, border: `1px solid ${rc.border}` }}>
                                    <rc.Icon style={{ width: 48, height: 48, color: rc.color, margin: '0 auto 12px' }} />
                                    <div style={{ fontSize: 22, fontWeight: 800, color: rc.color, marginBottom: 4 }}>
                                        {result.risk_level} Risk
                                    </div>
                                    <div style={{ fontSize: 13, color: 'var(--foreground-muted)', marginBottom: 20 }}>{rc.title}</div>

                                    {/* Score circle */}
                                    <div style={{ display: 'inline-block', position: 'relative', width: 100, height: 100, margin: '0 auto' }}>
                                        <svg width="100" height="100" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                                            <circle cx="50" cy="50" r="40" fill="none" stroke={rc.color} strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray={`${2 * Math.PI * 40}`}
                                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.authenticity_score / 100)}`}
                                                transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: 22, fontWeight: 800, color: rc.color, lineHeight: 1 }}>{result.authenticity_score.toFixed(0)}</span>
                                            <span style={{ fontSize: 9, color: 'var(--foreground-muted)', marginTop: 2 }}>/ 100</span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--foreground-muted)', marginTop: 8 }}>Authenticity Score</div>
                                </div>

                                {/* Risk indicators */}
                                <div style={{ ...CARD, padding: 18 }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 12 }}>Risk Indicators</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {result.risk_indicators.map((ind, i) => {
                                            const s = SEV[ind.severity] ?? SEV.Low;
                                            return (
                                                <div key={i} style={{ padding: '10px 14px', borderRadius: 10, background: s.bg, border: `1px solid ${s.border}` }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                        <s.Icon style={{ width: 14, height: 14, color: s.color, flexShrink: 0 }} />
                                                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--foreground)', flex: 1 }}>{ind.indicator}</span>
                                                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                                                            {ind.severity}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: 11, color: 'var(--foreground-muted)', lineHeight: 1.5 }}>{ind.details}</div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Suspicious patterns */}
                                {result.suspicious_patterns.length > 0 && (
                                    <div style={{ ...CARD, padding: 18 }}>
                                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', marginBottom: 12 }}>⚠ Suspicious Patterns</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {result.suspicious_patterns.map((p, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 12px', borderRadius: 9, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                                    <span style={{ color: '#fbbf24', flexShrink: 0, marginTop: 1 }}>⚠</span>
                                                    <span style={{ fontSize: 12, color: 'var(--foreground-muted)', lineHeight: 1.5 }}>{p}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ ...CARD, padding: 60, textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    <ShieldAlert style={{ width: 24, height: 24, color: '#f87171', opacity: 0.5 }} />
                                </div>
                                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--foreground)', marginBottom: 6 }}>No Analysis Yet</div>
                                <div style={{ fontSize: 13, color: 'var(--foreground-muted)' }}>Enter metrics or pick a sample profile</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
