import React, { useState } from 'react';
import { AlertTriangle, Users, Download, Zap, ChevronRight } from 'lucide-react';

export function Dashboard({ onToast, onOpenNewCase, onNavigate }) {
    const [timeRange, setTimeRange] = useState('24H');
    const banks = [
        { name: 'HDFC', lat: '8ms', status: '100%', state: 'nominal' },
        { name: 'ICICI', lat: '11ms', status: '99.8%', state: 'nominal' },
        { name: 'SBI', lat: '145ms', status: 'DEGRADED', state: 'degraded' },
        { name: 'AXIS', lat: '9ms', status: '100%', state: 'nominal' },
        { name: 'KOTAK', lat: '14ms', status: '99.9%', state: 'nominal' },
        { name: 'PNB', lat: '18ms', status: '99.5%', state: 'nominal' },
    ];

    return (
        <div style={{
            flex: 1, padding: '24px 32px', background: '#EDF1F5', overflowY: 'auto',
            fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', gap: 20
        }}>
            {/* Header & Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.8px' }}>Global Operations</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, fontSize: 13, color: '#475569', fontWeight: 600 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#008080' }} />
                        <span>System Nominal. Data sync latency: 12ms.</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button
                        onClick={() => onToast && onToast('Exporting global SOC intelligence report to PDF...')}
                        style={{
                            height: 36, padding: '0 18px', background: '#FFFFFF', border: '1px solid #CBD5E1',
                            borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', color: '#005D68',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace'
                        }}
                    >
                        EXPORT REPORT
                    </button>
                    <button
                        onClick={() => onToast && onToast('Triggered full system audit & compliance scan.')}
                        style={{
                            height: 36, padding: '0 18px', background: '#8C5808', border: 'none',
                            borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: '0.8px', color: '#FFFFFF',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace'
                        }}
                    >
                        TRIGGER AUDIT
                    </button>
                </div>
            </div>

            {/* 4 Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {/* Metric 1 */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 18, position: 'relative' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        TOTAL ACCOUNTS ANALYZED
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace', marginTop: 8, letterSpacing: '-0.5px' }}>
                        1,492,843
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#0284C7', marginTop: 4, fontFamily: 'monospace' }}>
                        ↗ +12.4% (24h)
                    </div>
                    <Users size={22} color="#CBD5E1" style={{ position: 'absolute', right: 18, top: 18 }} />
                </div>

                {/* Metric 2 */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderLeft: '4px solid #DC2626', borderRadius: 4, padding: 18, position: 'relative' }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        ACTIVE RISK ALERTS
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: '#DC2626', fontFamily: 'monospace', marginTop: 8, letterSpacing: '-0.5px' }}>
                        342
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#DC2626', marginTop: 4, fontFamily: 'monospace' }}>
                        ↑ 4 Critical
                    </div>
                    <AlertTriangle size={22} color="#FCA5A5" style={{ position: 'absolute', right: 18, top: 18 }} />
                </div>

                {/* Metric 3 */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 18 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        SYSTEM LATENCY
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace', marginTop: 8 }}>
                        12 <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>ms</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: '#E2E8F0', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
                        <div style={{ width: '24%', height: '100%', background: '#008080' }} />
                    </div>
                </div>

                {/* Metric 4 */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 18 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: '#64748B', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        MODEL ACCURACY
                    </div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: '#008080', fontFamily: 'monospace', marginTop: 8 }}>
                        98.7<span style={{ fontSize: 18, fontWeight: 700 }}>%</span>
                    </div>
                    <div style={{ width: '100%', height: 4, background: '#E2E8F0', borderRadius: 2, marginTop: 12, overflow: 'hidden' }}>
                        <div style={{ width: '98.7%', height: '100%', background: '#008080' }} />
                    </div>
                </div>
            </div>

            {/* Charts Grid: 24H Bar Chart & Radial Gauge */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
                {/* 24H Bar Chart Card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            LIVE RISK DISTRIBUTION (24H)
                        </span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {['1H', '24H', '7D'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => { setTimeRange(t); onToast && onToast(`Risk distribution view: ${t}`); }}
                                    style={{
                                        height: 24, padding: '0 10px', borderRadius: 3, border: 'none',
                                        background: timeRange === t ? '#005D68' : '#E2E8F0',
                                        color: timeRange === t ? '#FFFFFF' : '#475569',
                                        fontSize: 10, fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace'
                                    }}>{t}</button>
                            ))}
                        </div>
                    </div>

                    {/* Bar Chart Visualization */}
                    <div style={{ height: 180, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: '1px solid #E2E8F0' }}>
                        {[
                            { h: 30, color: '#E2E8F0' }, { h: 55, color: '#E2E8F0' }, { h: 25, color: '#E2E8F0' },
                            { h: 90, color: '#E2E8F0' }, { h: 70, color: '#76A9B6' }, { h: 120, color: '#E2E8F0' },
                            { h: 155, color: '#D94E48' }, { h: 75, color: '#E2E8F0' }, { h: 45, color: '#E2E8F0' },
                            { h: 80, color: '#005D68' }
                        ].map((b, i) => (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '100%', height: b.h, background: b.color, borderRadius: '2px 2px 0 0' }} />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748B', fontFamily: 'monospace', fontWeight: 600 }}>
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>NOW</span>
                    </div>
                </div>

                {/* Global Network Risk Radial Donut Gauge */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ alignSelf: 'flex-start', fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        GLOBAL NETWORK RISK
                    </div>

                    <div style={{ position: 'relative', width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="150" height="150" viewBox="0 0 150 150">
                            <circle cx="75" cy="75" r="58" fill="none" stroke="#E2E8F0" strokeWidth="14" />
                            <circle cx="75" cy="75" r="58" fill="none" stroke="#008080" strokeWidth="14" strokeDasharray="364" strokeDashoffset="90" strokeLinecap="butt" transform="rotate(-90 75 75)" />
                            <circle cx="75" cy="75" r="58" fill="none" stroke="#E8A23C" strokeWidth="14" strokeDasharray="364" strokeDashoffset="310" strokeLinecap="butt" transform="rotate(-90 75 75)" />
                        </svg>
                        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: 34, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace', lineHeight: 1 }}>76<span style={{ fontSize: 16, color: '#64748B' }}>/100</span></span>
                            <span style={{ fontSize: 9, fontWeight: 800, color: '#B45309', letterSpacing: '1px', textTransform: 'uppercase', marginTop: 4, fontFamily: 'monospace' }}>ELEVATED</span>
                        </div>
                    </div>

                    <div style={{ width: '100%', borderTop: '1px solid #E2E8F0', paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', fontFamily: 'monospace' }}>MULE PROBABILITY</div>
                            <div style={{ fontSize: 13, fontWeight: 900, color: '#0F172A', marginTop: 2, fontFamily: 'monospace' }}>HIGH</div>
                        </div>
                        <div>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', fontFamily: 'monospace' }}>VELOCITY RISK</div>
                            <div style={{ fontSize: 13, fontWeight: 900, color: '#0F172A', marginTop: 2, fontFamily: 'monospace' }}>MED</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Node Health Matrix Row */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        NODE HEALTH MATRIX
                    </span>
                    <button
                        onClick={() => onNavigate && onNavigate('ALERT_FEED')}
                        style={{ fontSize: 10, fontWeight: 800, color: '#005D68', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, fontFamily: 'monospace' }}
                    >
                        VIEW ALL <ChevronRight size={14} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
                    {banks.map((b, i) => {
                        const isDegraded = b.state === 'degraded';
                        return (
                            <div
                                key={i}
                                onClick={() => onNavigate && onNavigate('ALERT_FEED')}
                                style={{
                                    background: '#FFFFFF',
                                    border: isDegraded ? '2px solid #F59E0B' : '1px solid #CBD5E1',
                                    borderRadius: 4, padding: 12, position: 'relative',
                                    cursor: 'pointer', transition: 'box-shadow 150ms'
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,93,104,0.15)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                    <span style={{ fontSize: 13, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace' }}>{b.name}</span>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: isDegraded ? '#F59E0B' : '#008080' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'monospace' }}>
                                    <span style={{ color: '#64748B' }}>LAT: {b.lat}</span>
                                    <span style={{ fontWeight: 800, color: isDegraded ? '#D97706' : '#008080' }}>{b.status}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

