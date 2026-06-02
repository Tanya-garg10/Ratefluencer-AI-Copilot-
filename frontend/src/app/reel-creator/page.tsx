'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Loader2, Copy, CheckCheck, Sparkles } from 'lucide-react';
import { generateReel } from '@/lib/api';

const CARD: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14 };

interface ReelContent { hook: string; script: string; cta: string; talking_points: string[]; }

const SUGGESTIONS = ['AI Agents 2026', 'Building SaaS in 30 days', 'Passive income secrets', 'Future of remote work', 'ChatGPT productivity hacks'];

export default function ReelCreatorPage() {
    const [topic, setTopic] = useState('');
    const [result, setResult] = useState<ReelContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); if (!topic.trim()) return;
        setLoading(true); setError('');
        try {
            const content = await generateReel({ topic });
            setResult({
                hook: content?.hook ?? '',
                script: content?.script ?? '',
                cta: content?.cta ?? '',
                talking_points: Array.isArray(content?.talking_points) ? content.talking_points : [],
            });
        }
        catch { setError('Backend offline — run: uvicorn main:app --reload --port 8001'); }
        finally { setLoading(false); }
    };

    const copy = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key); setTimeout(() => setCopied(null), 2000);
    };

    const fullScript = result ? `HOOK:\n${result.hook}\n\nSCRIPT:\n${result.script}\n\nCTA:\n${result.cta}` : '';

    return (
        <div style={{ maxWidth: 820, margin: '0 auto' }} className="animate-fadeIn">

            {/* Input card */}
            <div style={{ ...CARD, padding: 20, marginBottom: 16 }}>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Reel Topic</label>
                        <input className="input-styled" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. How AI is changing content creation" />
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {SUGGESTIONS.map(s => (
                            <button key={s} type="button" onClick={() => setTopic(s)}
                                style={{ fontSize: 11, padding: '5px 12px', borderRadius: 99, cursor: 'pointer', background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--foreground-muted)', transition: 'all 0.15s' }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--foreground)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--foreground-muted)'; }}>
                                {s}
                            </button>
                        ))}
                    </div>
                    {error && <div style={{ fontSize: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px', color: '#f87171' }}>{error}</div>}
                    <button type="submit" disabled={loading || !topic.trim()} className="btn-primary" style={{ justifyContent: 'center' }}>
                        {loading ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Generating…</> : <><Sparkles style={{ width: 14, height: 14 }} /> Generate Viral Reel Script</>}
                    </button>
                </form>
            </div>

            {/* Results */}
            <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        {/* Copy all */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => copy(fullScript, 'all')}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#a78bfa' }}>
                                {copied === 'all' ? <CheckCheck style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                                Copy All
                            </button>
                        </div>

                        {/* Hook */}
                        <div style={{ ...CARD, padding: 18, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(139,92,246,0.3)' }}>
                            <CopyHeader title="🎬 Viral Hook" onCopy={() => copy(result.hook, 'hook')} copied={copied === 'hook'} />
                            <p style={{ fontSize: 14, color: 'var(--foreground)', lineHeight: 1.6, marginTop: 8 }}>{result.hook}</p>
                        </div>

                        {/* Script */}
                        <div style={{ ...CARD, padding: 18 }}>
                            <CopyHeader title="📝 30–60s Script" onCopy={() => copy(result.script, 'script')} copied={copied === 'script'} />
                            <p style={{ fontSize: 13, color: 'var(--foreground-muted)', lineHeight: 1.7, marginTop: 8, whiteSpace: 'pre-line' }}>{result.script}</p>
                        </div>

                        {/* Talking points */}
                        <div style={{ ...CARD, padding: 18 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)', marginBottom: 12 }}>💡 Talking Points</div>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {result.talking_points.map((pt, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                                        <span style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(139,92,246,0.2)', color: '#a78bfa', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                                        <span style={{ fontSize: 13, color: 'var(--foreground-muted)', lineHeight: 1.5 }}>{pt}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA */}
                        <div style={{ ...CARD, padding: 18 }}>
                            <CopyHeader title="📣 Call to Action" onCopy={() => copy(result.cta, 'cta')} copied={copied === 'cta'} />
                            <p style={{ fontSize: 13, color: 'var(--foreground-muted)', lineHeight: 1.6, marginTop: 8 }}>{result.cta}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CopyHeader({ title, onCopy, copied }: { title: string; onCopy: () => void; copied: boolean }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--foreground)' }}>{title}</span>
            <button onClick={onCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: copied ? '#34d399' : 'var(--foreground-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {copied ? <CheckCheck style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
}
