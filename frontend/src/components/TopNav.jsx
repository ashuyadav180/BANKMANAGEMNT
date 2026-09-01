import React, { useState } from 'react';
import { Search, Radio, Cpu, BarChart2, Settings } from 'lucide-react';

export function TopNav({ analystUser, onOpenSettings, onToast }) {
    const userInitials = analystUser?.initials || 'AY';
    const [searchVal, setSearchVal] = useState('');

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchVal.trim()) {
            if (onToast) onToast(`Searching database for: "${searchVal}"`);
        }
    };

    return (
        <div style={{
            height: 52, background: '#F1F5F8', borderBottom: '1px solid #CBD5E1',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', flexShrink: 0, userSelect: 'none', fontFamily: 'Inter, -apple-system, sans-serif'
        }}>
            {/* Search Bar Input */}
            <div style={{ position: 'relative', width: 440 }}>
                <Search size={15} color="#64748B" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                    value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    placeholder="Search entity, IP, or case... (Press Enter)"
                    style={{
                        width: '100%', height: 34, background: '#E2E8F0', border: '1px solid #CBD5E1',
                        borderRadius: 4, padding: '0 12px 0 36px', fontSize: 12, color: '#0F172A',
                        outline: 'none', fontFamily: 'monospace', fontWeight: 500
                    }}
                />
            </div>

            {/* Right Status Controls & Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderRight: '1px solid #CBD5E1', paddingRight: 20 }}>
                    <button
                        onClick={() => onToast && onToast('Live Feed Stream: 25 Bank Feeds Connected (0 Errors)')}
                        title="System Feed" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0F172A', display: 'flex', alignItems: 'center', padding: 2 }}
                    >
                        <Radio size={18} color="#0F172A" />
                    </button>
                    <button
                        onClick={() => onToast && onToast('Compute Status: 6-Agent Cluster at 98.4% Efficiency')}
                        title="Compute Status" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0F172A', display: 'flex', alignItems: 'center', padding: 2 }}
                    >
                        <Cpu size={18} color="#0F172A" />
                    </button>
                    <button
                        onClick={() => onToast && onToast('Analytics Engine: 1,420 msg/s processed')}
                        title="Analytics" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0F172A', display: 'flex', alignItems: 'center', padding: 2 }}
                    >
                        <BarChart2 size={18} color="#0F172A" />
                    </button>
                    <button
                        onClick={onOpenSettings}
                        title="Settings" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#0F172A', display: 'flex', alignItems: 'center', padding: 2 }}
                    >
                        <Settings size={18} color="#0F172A" />
                    </button>
                </div>

                {/* Analyst Profile Box */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: '#0F172A', letterSpacing: '0.6px', fontFamily: 'monospace' }}>
                            ANALYST: {userInitials}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#475569', fontFamily: 'monospace' }}>
                            Lvl 4 Access
                        </span>
                    </div>
                    <div style={{
                        width: 32, height: 32, borderRadius: 4, background: '#00C2A8', color: '#0F172A',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 900, fontFamily: 'monospace'
                    }}>
                        {userInitials}
                    </div>
                </div>
            </div>
        </div>
    );
}


