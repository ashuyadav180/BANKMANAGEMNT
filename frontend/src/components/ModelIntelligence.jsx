import React, { useState } from 'react';
import { Lock, ShieldCheck, Play, Network } from 'lucide-react';

export function ModelIntelligence({ onToast }) {
    const [resilienceScore, setResilienceScore] = useState(80);
    const [mutationLogs, setMutationLogs] = useState([
        { time: '14:22:01', type: 'Smurfing Mutation', status: 'VULNERABILITY DETECTED', state: 'vuln' },
        { time: '14:15:44', type: 'Temporal Shift', status: 'RESISTED (99.8%)', state: 'resisted' }
    ]);

    const runAttack = (attackName) => {
        const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
        const isSuccess = Math.random() > 0.4;
        const newLog = {
            time: timeStr,
            type: attackName,
            status: isSuccess ? 'RESISTED (99.9%)' : 'VULNERABILITY DETECTED',
            state: isSuccess ? 'resisted' : 'vuln'
        };
        setMutationLogs(prev => [newLog, ...prev]);
        if (!isSuccess) {
            setResilienceScore(prev => Math.max(60, prev - 2));
        }
        if (onToast) {
            onToast(`Adversarial attack executed: ${attackName} — ${isSuccess ? 'RESISTED' : 'VULNERABILITY DETECTED'}`);
        }
    };

    return (
        <div style={{
            flex: 1, padding: '24px 32px', background: '#EDF1F5', overflowY: 'auto',
            fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', gap: 20
        }}>
            {/* Header & Status Badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Model Intelligence Suite</h1>
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 4, fontWeight: 500 }}>
                        Advanced privacy-preserving telemetry and adversarial robustness validation across federated institutional nodes.
                    </div>
                </div>

                <div style={{
                    padding: '6px 14px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 20,
                    fontSize: 10, fontWeight: 800, color: '#005D68', display: 'flex', alignItems: 'center', gap: 6,
                    fontFamily: 'monospace'
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#008080' }} />
                    Live Sync Active
                </div>
            </div>

            {/* Main Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Federated Intelligence Card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <Network size={20} color="#005D68" />
                            <span style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace' }}>FEDERATED Intelligence</span>
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 800, background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', padding: '3px 8px', borderRadius: 3, letterSpacing: '0.8px', fontFamily: 'monospace' }}>
                            MULTI-INSTITUTION TENSORS
                        </span>
                    </div>

                    {/* Protocol & Framework Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 3, padding: 12 }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontFamily: 'monospace' }}>Encryption Protocol</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#005D68', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace' }}>
                                <Lock size={12} /> CKKS Homomorphic
                            </div>
                        </div>

                        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 3, padding: 12 }}>
                            <div style={{ fontSize: 9, fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontFamily: 'monospace' }}>Privacy Framework</div>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#005D68', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace' }}>
                                <ShieldCheck size={12} /> Differential Privacy
                            </div>
                        </div>
                    </div>

                    {/* Central Mesh Visualizer */}
                    <div style={{
                        height: 220, background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 4,
                        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {/* Grid Dot Pattern */}
                        <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

                        {/* Central Global Model Node */}
                        <div style={{
                            width: 64, height: 64, borderRadius: 8, background: '#005D68', color: '#FFF',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            zIndex: 2, boxShadow: '0 4px 12px rgba(0,93,104,0.3)', position: 'relative'
                        }}>
                            <Network size={24} />
                            <span style={{ fontSize: 9, fontWeight: 800, position: 'absolute', bottom: -20, color: '#005D68', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>Global Model</span>
                        </div>

                        {/* Satellite Bank Nodes */}
                        <div style={{ position: 'absolute', left: 30, top: 30, background: '#FFF', border: '1px solid #94A3B8', borderRadius: 3, padding: '4px 10px', fontSize: 10, fontWeight: 800, fontFamily: 'monospace' }}>HDFC <span style={{ fontSize: 8, color: '#64748B' }}>v1.2.4</span></div>
                        <div style={{ position: 'absolute', right: 30, top: 30, background: '#FFF', border: '1px solid #94A3B8', borderRadius: 3, padding: '4px 10px', fontSize: 10, fontWeight: 800, fontFamily: 'monospace' }}>ICICI <span style={{ fontSize: 8, color: '#64748B' }}>v1.2.4</span></div>
                        <div style={{ position: 'absolute', left: 30, bottom: 30, background: '#FFF', border: '1px solid #94A3B8', borderRadius: 3, padding: '4px 10px', fontSize: 10, fontWeight: 800, fontFamily: 'monospace' }}>SBI <span style={{ fontSize: 8, color: '#64748B' }}>v1.2.3</span></div>
                        <div style={{ position: 'absolute', right: 30, bottom: 30, background: '#FFF', border: '1px solid #94A3B8', borderRadius: 3, padding: '4px 10px', fontSize: 10, fontWeight: 800, fontFamily: 'monospace' }}>+3 <span style={{ fontSize: 8, color: '#64748B' }}>Pending</span></div>
                    </div>
                </div>

                {/* Adversarial Stress Tester Card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} />
                            <span style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace' }}>ADVERSARIAL Stress Tester</span>
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 800, background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', padding: '3px 8px', borderRadius: 3, letterSpacing: '0.8px', fontFamily: 'monospace' }}>
                            MUTATION ENGINE
                        </span>
                    </div>

                    {/* Donut Score & Attack Buttons Split */}
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, alignItems: 'center' }}>
                        {/* Donut Gauge */}
                        <div style={{ position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="110" height="110" viewBox="0 0 110 110">
                                <circle cx="55" cy="55" r="42" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                                <circle cx="55" cy="55" r="42" fill="none" stroke="#005D68" strokeWidth="10" strokeDasharray="264" strokeDashoffset={264 - (264 * resilienceScore) / 100} strokeLinecap="round" transform="rotate(-90 55 55)" />
                            </svg>
                            <div style={{ position: 'absolute', textAlign: 'center' }}>
                                <div style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace', lineHeight: 1 }}>{resilienceScore}%</div>
                                <div style={{ fontSize: 8, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginTop: 2, fontFamily: 'monospace' }}>RESILIENCE</div>
                            </div>
                        </div>

                        {/* Action Attack Triggers */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <button
                                onClick={() => runAttack('Amount Normalization Attack')}
                                style={{
                                    height: 36, padding: '0 12px', background: '#005D68', color: '#FFFFFF',
                                    border: 'none', borderRadius: 3, fontSize: 11, fontWeight: 800, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'monospace'
                                }}
                            >
                                <span>Execute Amount Normalization Attack</span>
                                <Play size={12} />
                            </button>
                            <button
                                onClick={() => runAttack('Transaction Spreading Attack')}
                                style={{
                                    height: 36, padding: '0 12px', background: '#FFFFFF', color: '#0F172A',
                                    border: '1px solid #CBD5E1', borderRadius: 3, fontSize: 11, fontWeight: 800, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'monospace'
                                }}
                            >
                                <span>Execute Transaction Spreading</span>
                                <Play size={12} color="#0F172A" />
                            </button>
                        </div>
                    </div>

                    {/* Mutation Logs Table */}
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>
                            RECENT MUTATION LOGS
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {mutationLogs.map((log, i) => (
                                <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 3, padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, fontFamily: 'monospace' }}>
                                    <span style={{ color: '#64748B' }}>{log.time}</span>
                                    <span style={{ color: '#0F172A', fontWeight: 700 }}>{log.type}</span>
                                    <span style={{
                                        padding: '2px 6px', borderRadius: 3, fontSize: 9, fontWeight: 800,
                                        background: log.state === 'vuln' ? '#FEF2F2' : '#DCFCE7',
                                        color: log.state === 'vuln' ? '#DC2626' : '#166534',
                                        border: `1px solid ${log.state === 'vuln' ? '#FCA5A5' : '#86EFAC'}`
                                    }}>
                                        {log.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

