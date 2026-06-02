'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Loader2 } from 'lucide-react';
import { matchBrands, type BrandMatch } from '@/lib/api';

const CARD: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 16 };

const CATEGORIES = ['AI', 'Technology', 'Business', 'Startups', 'Finance', 'Marketing', 'Fitness', 'Fashion', 'Food', 'Travel', 'Lifestyle', 'Gaming', 'Education', 'Health', 'Sports'];
const BRAND_LOGOS: Record<string, string> = { Nike: '🎽', Adidas: '👟', Samsung: '📱', Notion: '📝', OpenAI: '🤖', Adobe: '🎨', HubSpot: '🎯', Shopify: '🛍️' };

export default function BrandMatchPage() {
    const [form, setForm] = useState({ category: 'Technology', engagement_rate: 3.5, authenticity_score: 75 });
    const [results, setResults] = useState<BrandMatch[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setLoading(true); setError('');
        try { setResults(await matchBrands(form)); }
        catch { setError('Backend offline — run uvicorn on port 8001.'); }
        finally { setLoading(false); }
    };

    return (
        <div style={{ maxWidth: 900, margin: '0 auto' }} className="animate-fadeIn">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>

                {/* Form */}
                <div style={{ ...CARD, padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 14, marginBottom: 16, borderBottom: '1px solid var(--card-border)' }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Building2 style={{ width: 15, height: 15, color: '#22d3ee' }} />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)' }}>Influencer Profile</span>
                    </div>

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Category</label>
                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-styled">
                                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                                Engagement Rate <span style={{ color: '#a78bfa', fontWeight: 700 }}>{form.engagement_rate}%</span>
                            </label>
                            <input type="range" min={0.1} max={20} step={0.1} value={form.engagement_rate}
                                onChange={e => setForm(f => ({ ...f, engagement_rate: parseFloat(e.target.value) }))}
                                style={{ width: '100%', accentColor: '#8b5cf6' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--foreground-muted)', marginTop: 2 }}>
                                <span>0.1%</span><span>20%</span>
                            </div>
                        </div>

                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>
                                Authenticity Score <span style={{ color: '#22d3ee', fontWeight: 700 }}>{form.authenticity_score}</span>
                            </label>
                            <input type="range" min={0} max={100} value={form.authenticity_score}
                                onChange={e => setForm(f => ({ ...f, authenticity_score: parseInt(e.target.value) }))}
                                style={{ width: '100%', accentColor: '#06b6d4' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--foreground-muted)', marginTop: 2 }}>
                                <span>0</span><span>100</span>
                            </div>
                        </div>

                        {error && <div style={{ fontSize: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: '#f87171' }}>{error}</div>}
                        <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center' }}>
                            {loading ? <><Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} /> Matching…</> : '🎯 Find Brand Matches'}
                        </button>

                        <div style={{ fontSize: 11, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, padding: '10px 12px', color: '#c4b5fd', lineHeight: 1.5 }}>
                            Cosine similarity on category embeddings + engagement/authenticity signals
                        </div>
                    </form>
                </div>

                {/* Results */}
                <div>
                    <AnimatePresence>
                        {results.length > 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>Top Brand Matches</div>
                                {results.map((b, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                                        style={{ ...CARD, padding: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                            <div style={{ fontSize: 28, flexShrink: 0 }}>{BRAND_LOGOS[b.brand_name] || '🏢'}</div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>{b.brand_name}</span>
                                                    <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 20, padding: '2px 8px' }}>#{i + 1}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                                    <div style={{ flex: 1, height: 6, background: 'var(--input-bg)', borderRadius: 99, overflow: 'hidden' }}>
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${b.match_percentage}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                                                            style={{ height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)', borderRadius: 99 }} />
                                                    </div>
                                                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)', minWidth: 40, textAlign: 'right' }}>{b.match_percentage}%</span>
                                                </div>
                                                <p style={{ fontSize: 12, color: 'var(--foreground-muted)', lineHeight: 1.5 }}>{b.reasoning}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div style={{ ...CARD, padding: 60, textAlign: 'center' }}>
                                <Building2 style={{ width: 40, height: 40, color: 'var(--foreground-muted)', opacity: 0.3, margin: '0 auto 12px' }} />
                                <div style={{ fontSize: 14, color: 'var(--foreground-muted)' }}>Set your profile and find matching brands</div>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
                                    {['Nike', 'OpenAI', 'Notion', 'Adobe', 'HubSpot'].map(b => (
                                        <span key={b} style={{ fontSize: 12, padding: '4px 12px', borderRadius: 20, border: '1px solid var(--card-border)', color: 'var(--foreground-muted)' }}>
                                            {BRAND_LOGOS[b]} {b}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
