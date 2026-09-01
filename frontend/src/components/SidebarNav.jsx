import React from 'react';
import {
    LayoutDashboard, AlertTriangle, Search, ShieldCheck, Zap, Brain,
    Settings, HelpCircle, Plus, Shield
} from 'lucide-react';

export function SidebarNav({ mainNavView, setMainNavView, alertCount = 14, analystUser, onOpenSettings, onOpenSupport, onOpenNewCase }) {
    const navItems = [
        { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'ALERT_FEED', label: 'Alert Feed', icon: AlertTriangle, badge: alertCount },
        { id: 'INVESTIGATION', label: 'Investigation', icon: Search },
        { id: 'CASE_MGMT', label: 'Case Mgmt', icon: ShieldCheck },
        { id: 'AI_OPS', label: 'AI Ops', icon: Zap },
        { id: 'MODEL_INTEL', label: 'Intelligence', icon: Brain }
    ];

    return (
        <div style={{
            width: 220, background: '#E9EEF3', borderRight: '1px solid #CBD5E1',
            display: 'flex', flexDirection: 'column', height: '100%', flexShrink: 0,
            userSelect: 'none', fontFamily: 'Inter, -apple-system, sans-serif'
        }}>
            {/* Top Brand Logo */}
            <div style={{ padding: '16px 20px 12px 20px', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#005D68', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: 6 }}>
                    MuleWatch AI
                </div>
            </div>

            {/* SOC Command Badge Box */}
            <div style={{ padding: '14px 16px 10px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 6, background: '#00A896',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF'
                    }}>
                        <Shield size={18} fill="#00A896" color="#FFF" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: '#0F172A', letterSpacing: '0.8px', fontFamily: 'monospace' }}>
                            SOC COMMAND
                        </span>
                        <span style={{ fontSize: 9, fontWeight: 600, color: '#64748B', fontFamily: 'monospace' }}>
                            V2.4.0-STABLE
                        </span>
                    </div>
                </div>
            </div>

            {/* + NEW CASE Action Button */}
            <div style={{ padding: '6px 16px 14px 16px' }}>
                <button
                    onClick={onOpenNewCase}
                    style={{
                        width: '100%', height: 36, background: '#0B6E6A', color: '#FFFFFF',
                        border: 'none', borderRadius: 4, fontSize: 11, fontWeight: 800,
                        letterSpacing: '0.8px', textTransform: 'uppercase', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.08)', transition: 'all 150ms ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#085451'}
                    onMouseLeave={e => e.currentTarget.style.background = '#0B6E6A'}
                >
                    <Plus size={14} strokeWidth={2.5} /> NEW CASE
                </button>
            </div>

            {/* Nav Menu Items */}
            <div style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
                {navItems.map(item => {
                    const isActive = mainNavView === item.id;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setMainNavView(item.id)}
                            style={{
                                height: 36, padding: '0 12px', borderRadius: 4,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: isActive ? '#00C2A8' : 'transparent',
                                border: 'none', color: isActive ? '#0F172A' : '#475569',
                                fontSize: 12, fontWeight: isActive ? 800 : 600,
                                cursor: 'pointer', transition: 'all 120ms ease'
                            }}
                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = '#DFE6EC'; e.currentTarget.style.color = '#0F172A'; } }}
                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; } }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Icon size={16} color={isActive ? '#0F172A' : '#64748B'} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{item.label}</span>
                            </div>
                            {item.badge !== undefined && (
                                <span style={{
                                    fontSize: 10, fontWeight: 800, padding: '1px 6px', borderRadius: 3,
                                    background: '#D92638', color: '#FFFFFF', fontFamily: 'monospace'
                                }}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Bottom Footer Section */}
            <div style={{ padding: '12px 12px 16px 12px', borderTop: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button
                    onClick={onOpenSettings}
                    style={{ height: 30, padding: '0 12px', borderRadius: 4, background: 'transparent', border: 'none', color: '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                    <Settings size={15} color="#64748B" />
                    <span>Settings</span>
                </button>
                <button
                    onClick={onOpenSupport}
                    style={{ height: 30, padding: '0 12px', borderRadius: 4, background: 'transparent', border: 'none', color: '#64748B', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                    <HelpCircle size={15} color="#64748B" />
                    <span>Support</span>
                </button>
            </div>
        </div>
    );
}

