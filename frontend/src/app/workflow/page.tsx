'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, TrendingUp, Lightbulb, FileText, Camera, Zap, Package, CheckCircle2, ChevronRight } from 'lucide-react';

const CARD: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 14 };

const STEPS = [
    { id: 'trend', label: 'Trend Discovery', desc: 'Identify trending topics in your niche', icon: TrendingUp, color: '#8b5cf6', output: 'Found: "AI Agents in Production" (Score: 97, +34% velocity)' },
    { id: 'ideation', label: 'Content Ideation', desc: 'AI brainstorms angles and formats', icon: Lightbulb, color: '#06b6d4', output: 'Angle: "5 AI agents that replace a whole team" — Educational + FOMO format' },
    { id: 'script', label: 'Script Generation', desc: 'Generate viral hooks and full scripts', icon: FileText, color: '#10b981', output: '🎬 Hook: "I replaced 3 employees with AI agents. Here\'s how…"' },
    { id: 'caption', label: 'Caption Generation', desc: 'Create platform-optimized captions', icon: Camera, color: '#f59e0b', output: '📱 Caption + 15 hashtags generated for Instagram & LinkedIn' },
    { id: 'virality', label: 'Virality Prediction', desc: 'Predict reach and engagement metrics', icon: Zap, color: '#f472b6', output: '⚡ Virality Score: 78/100 — Expected 2.3M reach, 45K likes' },
    { id: 'package', label: 'Final Content Pack', desc: 'Bundle everything for publishing', icon: Package, color: '#a78bfa', output: '📦 Complete pack: Script + Captions + Hashtags + Schedule ready' },
];

export default function WorkflowPage() {
    const [topic, setTopic] = useState('');
    const [running, setRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(-1);
    const [completed, setCompleted] = useState<Set<number>>(new Set());

    const runWorkflow = async () => {
        if (!topic.trim()) return;
        setRunning(true); setCurrentStep(0); setCompleted(new Set());
        for (let i = 0; i < STEPS.length; i++) {
            setCurrentStep(i);
            await new Promise(r => setTimeout(r, 1400));
            setCompleted(prev => new Set([...prev, i]));
        }
        setCurrentStep(-1); setRunning(false);
    };

    const reset = () => { setCurrentStep(-1); setCompleted(new Set()); };

    const isDone = completed.size === STEPS.length;

    return (
        <div style={{ maxWidth: 680, margin: '0 auto' }} className="animate-fadeIn">

            {/* Input */}
            <div style={{ ...CARD, padding: 18, marginBottom: 20, display: 'flex', gap: 10 }}>
                <input className="input-styled" style={{ flex: 1 }}
                    value={topic} onChange={e => setTopic(e.target.value)}
                    placeholder="Enter a topic to run through the full AI pipeline…"
                    disabled={running}
                />
                {isDone ? (
                    <button onClick={reset} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>New Run</button>
                ) : (
                    <button onClick={runWorkflow} disabled={running || !topic.trim()} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                        {running ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Running…</> : '▶ Run Workflow'}
                    </button>
                )}
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STEPS.map((step, i) => {
                    const isActive = currentStep === i;
                    const stepDone = completed.has(i);
                    const isPending = !stepDone && currentStep > -1 && currentStep !== i;
                    const Icon = step.icon;

                    return (
                        <div key={step.id} style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
                            {/* Left: icon + line */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 40, flexShrink: 0 }}>
                                <motion.div
                                    animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                                    transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
                                    style={{
                                        width: 36, height: 36, borderRadius: 10,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        background: stepDone ? '#10b981' : isActive ? step.color : 'var(--input-bg)',
                                        boxShadow: isActive ? `0 0 16px ${step.color}60` : 'none',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {stepDone
                                        ? <CheckCircle2 style={{ width: 18, height: 18, color: '#fff' }} />
                                        : <Icon style={{ width: 16, height: 16, color: isActive ? '#fff' : 'var(--foreground-muted)' }} />
                                    }
                                </motion.div>
                                {i < STEPS.length - 1 && (
                                    <div style={{ width: 2, flex: 1, marginTop: 4, borderRadius: 99, background: stepDone ? '#10b981' : 'rgba(255,255,255,0.06)', transition: 'background 0.5s', minHeight: 12 }} />
                                )}
                            </div>

                            {/* Right: card */}
                            <motion.div
                                style={{
                                    ...CARD, flex: 1, padding: '12px 16px', marginBottom: 6,
                                    borderColor: stepDone ? 'rgba(16,185,129,0.3)' : isActive ? `${step.color}50` : 'var(--card-border)',
                                    opacity: isPending ? 0.45 : 1,
                                    transition: 'all 0.3s',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: stepDone ? '#34d399' : isActive ? step.color : 'var(--foreground)' }}>
                                            {step.label}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--foreground-muted)', marginTop: 1 }}>{step.desc}</div>
                                    </div>
                                    {isActive && <Loader2 style={{ width: 14, height: 14, color: step.color }} className="animate-spin" />}
                                    {stepDone && <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399' }}>Done</span>}
                                    {!stepDone && !isActive && currentStep > -1 && <span style={{ fontSize: 11, color: 'var(--foreground-muted)' }}>{isPending ? 'Pending' : 'Queued'}</span>}
                                </div>

                                <AnimatePresence>
                                    {stepDone && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.25 }}
                                            style={{ overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--card-border)' }}>
                                                <ChevronRight style={{ width: 12, height: 12, color: '#34d399', flexShrink: 0, marginTop: 1 }} />
                                                <span style={{ fontSize: 12, color: '#86efac', lineHeight: 1.4 }}>{step.output}</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* Success banner */}
            <AnimatePresence>
                {isDone && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: 16, borderRadius: 16, padding: '20px 24px', textAlign: 'center', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--foreground)', marginBottom: 4 }}>Content Package Ready!</div>
                        <div style={{ fontSize: 12, color: 'var(--foreground-muted)', marginBottom: 14 }}>
                            Complete AI-generated pack for <strong style={{ color: 'var(--foreground)' }}>"{topic}"</strong>
                        </div>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                            {['Reel Script', 'LinkedIn Post', 'Instagram Caption', 'Virality Score', 'Hashtags'].map(t => (
                                <span key={t} style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 99, background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}>
                                    ✓ {t}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
