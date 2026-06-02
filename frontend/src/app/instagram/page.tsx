'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2, Copy, CheckCheck, Sparkles, Hash } from 'lucide-react';
import { generateInstagram } from '@/lib/api';

const CARD: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14 };
interface IGContent { caption: string; hashtags: string[]; cta: string; }
const SUGGESTIONS = ['Morning routine', 'Fitness journey', 'Travel in Bali', 'Tech setup tour', 'Day in my life as a founder'];

export default function InstagramPage() {
    const [topic, setTopic] = useState('');
    const [result, setResult] = useState<IGContent | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); if (!topic.trim()) return;
        setLoading(true); setError('');
        try {
            const resp = await generateInstagram({ topic });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const raw = resp as any;
            const content = raw?.content ?? raw;
            setResult({
                caption: content.caption ?? '',
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

    const fullCaption = result ? `${result.caption}\n\n${result.cta}\n\n${result.hashtags.join(' ')}` : '';

    return (
        <div style={{ maxWidth: 820, margin: '0 auto' }} className="animate-fadeIn">

            <div style={{ ...CARD, padding: 20, marginBottom: 16 }}>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>Post Topic</label>
                        <input className="input-styled" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Morning routine for entrepreneurs" />
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
                        {loading ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Generating…</> : <><Sparkles style={{ width: 14, height: 14 }} /> Generate Instagram Content</>}
                    </button>
                </form>
            </div>

            <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={() => copy(fullCaption, 'all')}
                                style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', color: '#f472b6' }}>
                                {copied === 'all' ? <CheckCheck style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
                                Copy All
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 14 }}>
                            {/* Phone mockup */}
                            <div style={{ background: '#111', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ height: 3, background: 'linear-gradient(90deg,#ec4899,#8b5cf6,#f97316)' }} />
                                <div style={{ padding: 12 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#ec4899,#f97316)' }} />
                                        <div>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>yourhandle</div>
                                            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Original Audio</div>
                                        </div>
                                    </div>
                                    <div style={{ height: 130, borderRadius: 10, background: 'linear-gradient(135deg,rgba(236,72,153,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                                        <Camera style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.3)' }} />
                                    </div>
                                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{result.caption}</p>
                                    <p style={{ fontSize: 10, color: '#f472b6', marginTop: 4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{result.hashtags.slice(0, 3).join(' ')}</p>
                                </div>
                            </div>

                            {/* Content cards */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <div style={{ ...CARD, padding: 14, flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)' }}>📸 Caption</span>
                                        <CopyBtn onCopy={() => copy(result.caption, 'cap')} copied={copied === 'cap'} />
                                    </div>
                                    <p style={{ fontSize: 12, color: 'var(--foreground-muted)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{result.caption}</p>
                                </div>
                                <div style={{ ...CARD, padding: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)' }}>📣 CTA</span>
                                        <CopyBtn onCopy={() => copy(result.cta, 'cta')} copied={copied === 'cta'} />
                                    </div>
                                    <p style={{ fontSize: 12, color: 'var(--foreground-muted)' }}>{result.cta}</p>
                                </div>
                                <div style={{ ...CARD, padding: 14 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Hash style={{ width: 12, height: 12 }} /> Hashtags ({result.hashtags.length})
                                        </span>
                                        <CopyBtn onCopy={() => copy(result.hashtags.join(' '), 'hash')} copied={copied === 'hash'} />
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                        {result.hashtags.map((h, i) => <span key={i} style={{ fontSize: 11, padding: '2px 8px', borderRadius: 99, background: 'rgba(236,72,153,0.12)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.2)' }}>{h}</span>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CopyBtn({ onCopy, copied }: { onCopy: () => void; copied: boolean }) {
    return (
        <button onClick={onCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: copied ? '#34d399' : 'var(--foreground-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            {copied ? <CheckCheck style={{ width: 11, height: 11 }} /> : <Copy style={{ width: 11, height: 11 }} />}
        </button>
    );
}
