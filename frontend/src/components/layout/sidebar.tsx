'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, ShieldAlert, Building2,
  TrendingUp, Video, Link2, Camera, Zap,
  Workflow, Settings, ChevronLeft, ChevronRight, Sparkles,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    label: 'Analytics',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/influencer', label: 'Influencer Engine', icon: Users },
      { href: '/fake-detection', label: 'Fake Detection', icon: ShieldAlert },
      { href: '/brand-match', label: 'Brand Match', icon: Building2 },
      { href: '/trends', label: 'Trend Discovery', icon: TrendingUp },
    ],
  },
  {
    label: 'Content AI',
    items: [
      { href: '/reel-creator', label: 'Reel Creator', icon: Video },
      { href: '/linkedin', label: 'LinkedIn AI', icon: Link2 },
      { href: '/instagram', label: 'Instagram AI', icon: Camera },
      { href: '/virality', label: 'Virality Engine', icon: Zap },
      { href: '/workflow', label: 'AI Workflow', icon: Workflow },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin', label: 'Admin Panel', icon: Settings },
    ],
  },
];

const W_OPEN = 240;
const W_CLOSED = 64;

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const w = collapsed ? W_CLOSED : W_OPEN;

  return (
    <>
      {/* Fixed sidebar */}
      <div
        className="fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300"
        style={{
          width: w,
          background: '#0d0d14',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 flex-shrink-0"
          style={{ height: 60, borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              boxShadow: '0 0 16px rgba(124,58,237,0.4)',
            }}
          >
            <Sparkles className="text-white" style={{ width: 16, height: 16 }} />
          </div>
          {!collapsed && (
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 14, fontWeight: 700, background: 'linear-gradient(135deg,#a78bfa,#22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
                Ratefluencer
              </div>
              <div style={{ fontSize: 10, color: '#8888aa', marginTop: -1 }}>AI Copilot</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: '12px 8px' }}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label} style={{ marginBottom: 16 }}>
              {!collapsed && (
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#55556a', padding: '0 8px 6px' }}>
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href} style={{ display: 'block', marginBottom: 2 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: collapsed ? '10px 0' : '9px 10px',
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        borderRadius: 10,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: 'all 0.15s',
                        background: isActive ? 'rgba(124,58,237,0.2)' : 'transparent',
                        border: isActive ? '1px solid rgba(139,92,246,0.35)' : '1px solid transparent',
                        color: isActive ? '#c4b5fd' : '#8888aa',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                          (e.currentTarget as HTMLElement).style.color = '#f0f0ff';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          (e.currentTarget as HTMLElement).style.background = 'transparent';
                          (e.currentTarget as HTMLElement).style.color = '#8888aa';
                        }
                      }}
                    >
                      {isActive && (
                        <div style={{
                          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                          width: 3, height: 18, borderRadius: '0 4px 4px 0',
                          background: 'linear-gradient(to bottom, #8b5cf6, #06b6d4)',
                        }} />
                      )}
                      <Icon style={{ width: 16, height: 16, flexShrink: 0, color: isActive ? '#a78bfa' : 'inherit' }} />
                      {!collapsed && (
                        <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden' }}>
                          {item.label}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse button */}
        <div style={{ padding: 8, borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: collapsed ? 'center' : 'flex-start',
              gap: 6, padding: '8px 10px', borderRadius: 10,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: '#8888aa', fontSize: 12, transition: 'all 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            {collapsed
              ? <ChevronRight style={{ width: 16, height: 16 }} />
              : <><ChevronLeft style={{ width: 16, height: 16 }} /><span>Collapse</span></>
            }
          </button>
        </div>
      </div>

      {/* Inline spacer — pushes content right */}
      <div style={{ width: w, flexShrink: 0, transition: 'width 0.3s' }} />
    </>
  );
}
