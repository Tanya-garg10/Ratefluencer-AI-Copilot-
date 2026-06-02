'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Loader2, Copy, CheckCheck, Sparkles } from 'lucide-react';
import { generateLinkedin } from '@/lib/api';

const CARD: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14 };
interface LIContent { hook: string; body: string; cta: string; hashtags: string[]; }
const SUGGESTIONS = ['AI replacing jobs', 'How I grew my startup to $1M ARR', 'Future of remote work', 'Lessons from 10 years in tech', 'Why most LinkedIn posts fail'];

export default function LinkedInPage() {
    const [topic, setTopic] = useState('');
    const [result, setResult] = useState<LIContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); if (!topic.trim()) return;
        setLoading(true); setError('');
        try {
            const resp = await generateLinkedin({ topic });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const raw = resp as any;
            const content = raw?.content ?? raw;
            setResult({
                hook: content.hook ?? '',
                body: content.body ?? '',
                cta: content.cta ?? '',
                hashtags: Array.isArray(content.hashtags) ? content.hashtags : [],
            });
        }
        catch { setError('Backend offline — run: uvicorn main:app --reload --port 8001'); }
        finally { setLoading(false); }
    };

    const copy = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000);
    };

    const fullPost = result ? `${result.hook}\n\n${result.body}\n\n${result.cta}\n\n${result.hashtags.join(' ')}` : '';

    return (
        <div style={{ maxWidth: 820, margin: '0 auto' }} className="animate-fadeIn">

            <div style={{ ...CARD, padding: 20, marginBottom: 16 }}>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Post Topic</label>
                        <input className="input-styled" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Why AI will transform every industry" />
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {SUGGESTIONS.map(s => (
                            <button key={s} type="button" onClick={() => setTopic(s)}
                                style={{ fontSize: 11, padding: '5px 12px', borderRadius: 99, cursor: 'pointer', background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--foreground-muted)' }}>
                                {s}
                            </button>
                        ))}
                    </div>
                    {error && <div style={{ fontSize: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: '#f87171' }}>{error}</div>}
                    <button type="submit" disabled={loading || !topic.trim()} className="btn-primary" style={{ justifyContent: 'center' }}>
                        {loading ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Generating…</> : <><Sparkles style={{ width: 14, height: 14 }} /> Generate LinkedIn Post</>}
                    </button>
                </form>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => copy(fullPost, 'all')}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa' }}>
                                {copied === 'all' ? <CheckCheck style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                                Copy Full Post
                            </button>
                        </div>

                        {/* Post preview */}
                        <div style={{ ...CARD, padding: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' }}>
                                    <Link2 style={{ width: 16, height: 16 }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--foreground)' }}>Your Name · 1st</div>
                                    <div style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>Just now</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{result.hook}</p>
                                <p style={{ fontSize: 13, color: 'var(--foreground-muted)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{result.body}</p>
                                <p style={{ fontSize: 13, color: 'var(--foreground)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{result.cta}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                                    {result.hashtags.map((h, i) => <span key={i} style={{ fontSize: 12, color: '#60a5fa' }}>{h}</span>)}
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                            {[{ label: '🎯 Hook', text: result.hook, key: 'hook' }, { label: '📣 CTA', text: result.cta, key: 'cta' }, { label: '#️⃣ Hashtags', text: result.hashtags.join(' '), key: 'tags' }].map(s => (
                                <div key={s.key} style={{ ...CARD, padding: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)' }}>{s.label}</span>
                                        <button onClick={() => copy(s.text, s.key)} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: copied === s.key ? '#34d399' : 'var(--foreground-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            {copied === s.key ? <CheckCheck style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
                                        </button>
                                    </div>
                                    <p style={{ fontSize: 11, color: 'var(--foreground-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{s.text}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
