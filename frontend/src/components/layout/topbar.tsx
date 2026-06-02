'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from './theme-toggle';

const PAGE_META: Record<string, { title: string; sub: string }> = {
    '/': { title: 'Dashboard', sub: 'Platform overview & analytics' },
    '/influencer': { title: 'Influencer Engine', sub: 'ML-powered scoring & analysis' },
    '/fake-detection': { title: 'Fake Detection', sub: 'Bot & authenticity analysis' },
    '/brand-match': { title: 'Brand Matching', sub: 'Semantic similarity engine' },
    '/trends': { title: 'Trend Discovery', sub: 'Real-time trending topics' },
    '/reel-creator': { title: 'Reel Creator', sub: 'AI-generated scripts & hooks' },
    '/linkedin': { title: 'LinkedIn AI', sub: 'Professional content generator' },
    '/instagram': { title: 'Instagram AI', sub: 'Caption & hashtag generator' },
    '/virality': { title: 'Virality Engine', sub: 'Predict reach & engagement' },
    '/workflow': { title: 'AI Workflow', sub: 'End-to-end content pipeline' },
    '/admin': { title: 'Admin Panel', sub: 'Platform management' },
};

export function TopBar() {
    const pathname = usePathname();
    const page = PAGE_META[pathname] ?? { title: 'Ratefluencer', sub: 'AI Copilot' };

    return (
        <header
            style={{
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                zIndex: 20,
                background: 'rgba(13,13,20,0.9)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
        >
            {/* Page title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--foreground)', lineHeight: 1.2 }}>
                        {page.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--foreground-muted)', lineHeight: 1.2, marginTop: 1 }}>
                        {page.sub}
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* AI pill */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '5px 12px', borderRadius: 99,
                    background: 'rgba(16,185,129,0.1)',
                    border: '1px solid rgba(16,185,129,0.25)',
                    fontSize: 11, fontWeight: 600, color: '#34d399',
                }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', animation: 'pulse 2s infinite' }} />
                    Cerebras Active
                </div>
                <ThemeToggle />
            </div>
        </header>
    );
}
