import React, { useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

export function AlertFeed({ onSelectAccount, onToast }) {
    const [filter, setFilter] = useState('ALL');
    const [lockedAccounts, setLockedAccounts] = useState({ 'ACC-3314-KL': true });

    const alerts = [
        { severity: 'HIGH', accountId: 'ACC-9921-XF', velocity: '₹452,000.00', spike: '↑300%', bank: 'HDFC', node: 'Node-Mumbai-01', timestamp: '14:02:11 IST' },
        { severity: 'MED', accountId: 'ACC-3314-KL', velocity: '₹85,500.00', spike: '↑80%', bank: 'SBI', node: 'Node-Delhi-04', timestamp: '14:01:45 IST' },
        { severity: 'LOW', accountId: 'ACC-1102-WQ', velocity: '₹12,000.00', spike: '↑15%', bank: 'ICICI', node: 'Node-Pune-02', timestamp: '13:58:20 IST' },
        { severity: 'HIGH', accountId: 'ACC-8392', velocity: '₹1,42,000.00', spike: '↑420%', bank: 'ICICI', node: 'Node-Bangalore-03', timestamp: '13:52:10 IST' },
        { severity: 'MED', accountId: 'ACC-7741-99', velocity: '₹64,200.00', spike: '↑65%', bank: 'AXIS', node: 'Node-Hyderabad-01', timestamp: '13:45:00 IST' },
    ];

    const filtered = filter === 'ALL' ? alerts : alerts.filter(a => a.severity === filter || (filter === 'MEDIUM' && a.severity === 'MED'));

    const toggleLock = (accId) => {
        const nextState = !lockedAccounts[accId];
        setLockedAccounts(prev => ({ ...prev, [accId]: nextState }));
        if (onToast) {
            onToast(nextState ? `Account ${accId} LOCKED by SOC command.` : `Account ${accId} UNLOCKED.`);
        }
    };

    return (
        <div style={{
            flex: 1, padding: '24px 32px', background: '#EDF1F5', overflowY: 'auto',
            fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', gap: 20
        }}>
            {/* Header & Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Triage Queue</h1>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626' }} />
                    </div>
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 4, fontWeight: 500 }}>
                        Live streaming anomalous velocity vectors.
                    </div>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        onClick={() => setFilter('ALL')}
                        style={{
                            height: 32, padding: '0 20px', borderRadius: 16, border: 'none',
                            background: filter === 'ALL' ? '#005D68' : '#FFFFFF',
                            color: filter === 'ALL' ? '#FFFFFF' : '#475569',
                            fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace'
                        }}
                    >
                        ALL
                    </button>
                    <button
                        onClick={() => setFilter('HIGH')}
                        style={{
                            height: 32, padding: '0 20px', borderRadius: 16,
                            border: filter === 'HIGH' ? '1px solid #DC2626' : '1px solid #FCA5A5',
                            background: filter === 'HIGH' ? '#FEF2F2' : '#FFFFFF',
                            color: '#DC2626', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace'
                        }}
                    >
                        HIGH
                    </button>
                    <button
                        onClick={() => setFilter('MEDIUM')}
                        style={{
                            height: 32, padding: '0 20px', borderRadius: 16,
                            border: filter === 'MEDIUM' ? '1px solid #D97706' : '1px solid #FDE68A',
                            background: filter === 'MEDIUM' ? '#FFFBEB' : '#FFFFFF',
                            color: '#D97706', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace'
                        }}
                    >
                        MEDIUM
                    </button>
                    <button
                        onClick={() => setFilter('LOW')}
                        style={{
                            height: 32, padding: '0 20px', borderRadius: 16,
                            border: '1px solid #CBD5E1', background: filter === 'LOW' ? '#F1F5F9' : '#FFFFFF',
                            color: '#475569', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace'
                        }}
                    >
                        LOW
                    </button>
                </div>
            </div>

            {/* Triage Data Table */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', color: '#0F172A', fontSize: 10, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            <th style={{ padding: '14px 20px', width: 110 }}>SEVERITY</th>
                            <th style={{ padding: '14px 20px', width: 140 }}>ACCOUNT ID</th>
                            <th style={{ padding: '14px 20px', width: 180 }}>VELOCITY (₹/HR)</th>
                            <th style={{ padding: '14px 20px' }}>NODE</th>
                            <th style={{ padding: '14px 20px', width: 140 }}>TIMESTAMP</th>
                            <th style={{ padding: '14px 20px', width: 140 }}>STATUS</th>
                            <th style={{ padding: '14px 20px', width: 100 }}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((row, idx) => {
                            const isLocked = !!lockedAccounts[row.accountId];
                            const isHigh = row.severity === 'HIGH';
                            const isMed = row.severity === 'MED';

                            return (
                                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 100ms ease' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                                >
                                    {/* Severity Tag */}
                                    <td style={{ padding: '14px 20px' }}>
                                        <span style={{
                                            padding: '3px 8px', borderRadius: 3, fontSize: 10, fontWeight: 800, fontFamily: 'monospace',
                                            background: isHigh ? '#FEF2F2' : isMed ? '#FEF3C7' : '#F1F5F9',
                                            color: isHigh ? '#DC2626' : isMed ? '#D97706' : '#475569',
                                            border: `1px solid ${isHigh ? '#FCA5A5' : isMed ? '#FCD34D' : '#CBD5E1'}`
                                        }}>
                                            {row.severity}
                                        </span>
                                    </td>

                                    {/* Account ID */}
                                    <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 800, color: '#0284C7', cursor: 'pointer' }}
                                        onClick={() => onSelectAccount && onSelectAccount(row.accountId)}
                                    >
                                        {row.accountId}
                                    </td>

                                    {/* Velocity ₹/HR & Spike % */}
                                    <td style={{ padding: '14px 20px', fontFamily: 'monospace' }}>
                                        <span style={{ fontWeight: 800, color: '#0F172A' }}>{row.velocity}</span>
                                        <span style={{ marginLeft: 8, fontSize: 11, fontWeight: 800, color: isHigh ? '#DC2626' : '#D97706' }}>{row.spike}</span>
                                    </td>

                                    {/* Node with bank tag */}
                                    <td style={{ padding: '14px 20px', color: '#0F172A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ padding: '2px 5px', background: '#E2E8F0', borderRadius: 3, fontSize: 9, fontWeight: 800, color: '#475569', fontFamily: 'monospace' }}>
                                            {row.bank}
                                        </span>
                                        <span style={{ fontFamily: 'monospace' }}>{row.node}</span>
                                    </td>

                                    {/* Timestamp */}
                                    <td style={{ padding: '14px 20px', color: '#475569', fontFamily: 'monospace', fontSize: 11 }}>
                                        {row.timestamp}
                                    </td>

                                    {/* Status Lock Toggle */}
                                    <td style={{ padding: '14px 20px' }}>
                                        <button
                                            onClick={() => toggleLock(row.accountId)}
                                            style={{
                                                background: 'transparent', border: 'none', cursor: 'pointer',
                                                display: 'flex', alignItems: 'center', gap: 6,
                                                color: isLocked ? '#DC2626' : '#0F172A', fontSize: 12, fontWeight: 700
                                            }}
                                        >
                                            {isLocked ? <Lock size={14} color="#DC2626" /> : <Unlock size={14} color="#0F172A" />}
                                            <span style={{ color: isLocked ? '#DC2626' : '#0F172A', fontFamily: 'monospace' }}>
                                                {isLocked ? 'Locked' : 'Unlocked'}
                                            </span>
                                        </button>
                                    </td>

                                    {/* Action button */}
                                    <td style={{ padding: '14px 20px' }}>
                                        <button
                                            onClick={() => onSelectAccount && onSelectAccount(row.accountId)}
                                            style={{
                                                background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 3,
                                                padding: '4px 10px', fontSize: 10, fontWeight: 800, color: '#005D68',
                                                cursor: 'pointer', fontFamily: 'monospace'
                                            }}
                                        >
                                            INSPECT
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

