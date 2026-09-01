import React, { useState } from 'react';
import { Sparkles, Terminal, Download, ShieldAlert, Cpu } from 'lucide-react';

export function Investigation({ selectedAccountId = 'ACC-8392', onToast }) {
    const [activeTab, setActiveTab] = useState('QUANTUM');
    const [activeTerminalTab, setActiveTerminalTab] = useState('AI_LOG');

    const handleFreezeAccount = () => {
        if (onToast) onToast(`CRITICAL: Account ${selectedAccountId} HAS BEEN FROZEN across all bank networks.`);
    };

    const handleMarkCleared = () => {
        if (onToast) onToast(`Account ${selectedAccountId} marked as CLEARED & risk score reset.`);
    };

    const handleExportSar = () => {
        if (onToast) onToast(`Generating and exporting full SAR package for ${selectedAccountId}...`);
    };

    const handleExportTelemetry = () => {
        if (onToast) onToast(`Exporting Quantum VQC Telemetry log for ${selectedAccountId}...`);
    };

    return (
        <div style={{
            flex: 1, padding: '24px 32px', background: '#EDF1F5', overflowY: 'auto',
            fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', gap: 16
        }}>
            {/* Account Header Metadata Strip */}
            <div style={{
                background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: '14px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace' }}>
                        {selectedAccountId}
                    </span>
                    <span style={{
                        padding: '3px 10px', borderRadius: 3, background: '#FEF2F2', border: '1px solid #FCA5A5',
                        color: '#DC2626', fontSize: 10, fontWeight: 800, letterSpacing: '0.8px', fontFamily: 'monospace'
                    }}>
                        ▲ RISK: HIGH
                    </span>
                    <span style={{
                        padding: '3px 10px', borderRadius: 3, background: '#F1F5F9', border: '1px solid #CBD5E1',
                        color: '#475569', fontSize: 10, fontWeight: 800, letterSpacing: '0.8px', fontFamily: 'monospace'
                    }}>
                        RETAIL_CHECKING
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 11, color: '#64748B', fontFamily: 'monospace' }}>
                    <span>KYC: <strong style={{ color: '#0F172A' }}>VERIFIED_L2</strong></span>
                    <span>TENURE: <strong style={{ color: '#0F172A' }}>4 YRS</strong></span>
                    <span>LAST IP: <strong style={{ color: '#0F172A' }}>192.168.1.144</strong></span>
                    <div style={{ borderLeft: '1px solid #CBD5E1', paddingLeft: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>CURRENT BALANCE</span>
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace' }}>₹1,42,000</span>
                    </div>
                </div>
            </div>

            {/* Main Content & Multi-Agent Terminal Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16, flex: 1 }}>
                {/* Left Investigation Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Analysis Tab Bar */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #CBD5E1', gap: 24, paddingLeft: 4 }}>
                        {['OVERVIEW', 'FLAG GRAPH', 'QUANTUM', 'ZK PROOF', 'TEMPORAL'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '8px 0', border: 'none', background: 'transparent',
                                    borderBottom: activeTab === tab ? '2px solid #005D68' : '2px solid transparent',
                                    color: activeTab === tab ? '#005D68' : '#64748B',
                                    fontSize: 11, fontWeight: activeTab === tab ? 900 : 700,
                                    letterSpacing: '0.8px', cursor: 'pointer', fontFamily: 'monospace'
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* OVERVIEW TAB */}
                    {activeTab === 'OVERVIEW' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {/* Gemini Narrative Card */}
                            <div style={{ background: '#FFFFFF', border: '1px solid #76A9B6', borderRadius: 4, padding: 18 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#005D68', marginBottom: 8 }}>
                                    <Sparkles size={16} />
                                    <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '1px', fontFamily: 'monospace' }}>GEMINI NARRATIVE</span>
                                </div>
                                <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                                    Account ACC-8392 exhibits highly anomalous structuring behavior characterized by rapid, sub-threshold deposits immediately followed by cross-border wire transfers to known high-risk jurisdictions. The velocity and topology of these transactions strongly correlate with observed mule network typologies in recent 30-day models.
                                </p>
                            </div>

                            {/* Split Grid: Rule Triggers vs SHAP Drivers */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                {/* Rule Triggers */}
                                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 16 }}>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 12, fontFamily: 'monospace' }}>
                                        RULE TRIGGERS (IF-AND-THEN)
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 3, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#991B1B', fontWeight: 600 }}>IF (Vel_24h &gt; 50) AND (Avg_Amt &lt; ₹50k)</span>
                                            <span style={{ fontSize: 9, fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '2px 6px', borderRadius: 3, fontFamily: 'monospace' }}>TRIGGERED</span>
                                        </div>
                                        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 3, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#475569', fontWeight: 600 }}>IF (CrossBorder == TRUE) AND (Age &lt; 30d)</span>
                                            <span style={{ fontSize: 9, fontWeight: 800, color: '#64748B', background: '#E2E8F0', padding: '2px 6px', borderRadius: 3, fontFamily: 'monospace' }}>PASS</span>
                                        </div>
                                        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 3, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#991B1B', fontWeight: 600 }}>IF (IP_Geo != KYC_Geo) AND (Login_Freq &gt; 10)</span>
                                            <span style={{ fontSize: 9, fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '2px 6px', borderRadius: 3, fontFamily: 'monospace' }}>TRIGGERED</span>
                                        </div>
                                    </div>
                                </div>

                                {/* SHAP Feature Drivers */}
                                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 16 }}>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 12, fontFamily: 'monospace' }}>
                                        SHAP FEATURE DRIVERS
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 11, fontFamily: 'monospace' }}>
                                        {[
                                            { label: 'Tx_Velocity', val: '+0.85', color: '#DC2626', w: '85%' },
                                            { label: 'IP_Distance', val: '+0.60', color: '#DC2626', w: '60%' },
                                            { label: 'Acc_Age', val: '-0.20', color: '#008080', w: '20%' },
                                            { label: 'Device_ID', val: '+0.45', color: '#DC2626', w: '45%' }
                                        ].map((f, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <span style={{ width: 85, color: '#0F172A', fontWeight: 600 }}>{f.label}</span>
                                                <div style={{ flex: 1, height: 8, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
                                                    <div style={{ width: f.w, height: '100%', background: f.color }} />
                                                </div>
                                                <span style={{ width: 45, textAlign: 'right', fontWeight: 800, color: f.color }}>{f.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* QUANTUM TAB */}
                    {activeTab === 'QUANTUM' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Cpu size={18} color="#005D68" /> Quantum Decision Manifold
                                    </h3>
                                    <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500, fontFamily: 'monospace' }}>Forensic Analysis: Account ACC-8392</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ padding: '4px 10px', borderRadius: 3, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: 11, fontWeight: 800, fontFamily: 'monospace' }}>
                                        RISK: 94.2%
                                    </span>
                                    <button
                                        onClick={handleExportTelemetry}
                                        style={{ height: 30, padding: '0 14px', background: '#005D68', color: '#FFF', border: 'none', borderRadius: 3, fontSize: 10, fontWeight: 800, cursor: 'pointer', fontFamily: 'monospace' }}
                                    >
                                        EXPORT TELEMETRY
                                    </button>
                                </div>
                            </div>

                            {/* 4-Qubit VQC Circuit & Inference Comparison */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 14 }}>
                                {/* VQC Circuit Card */}
                                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 16 }}>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 14, fontFamily: 'monospace' }}>
                                        4-QUBIT VARIATIONAL QUANTUM CIRCUIT (VQC)
                                    </div>
                                    <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        {['q0', 'q1', 'q2', 'q3'].map((q) => (
                                            <div key={q} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <span style={{ color: '#0F172A', fontWeight: 800, width: 20 }}>{q}</span>
                                                <div style={{ flex: 1, height: 2, background: '#94A3B8', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                                                    <div style={{ background: '#F1F5F9', border: '1px solid #64748B', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontWeight: 800, zIndex: 1, color: '#0F172A' }}>H</div>
                                                    <div style={{ background: '#F1F5F9', border: '1px solid #64748B', padding: '2px 8px', borderRadius: 2, fontSize: 9, fontWeight: 800, zIndex: 1, color: '#0F172A' }}>Ry</div>
                                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#005D68', zIndex: 1 }} />
                                                    <div style={{ background: '#E2E8F0', border: '1px solid #64748B', padding: '2px 6px', borderRadius: 2, fontSize: 9, zIndex: 1, color: '#0F172A', fontWeight: 800 }}>M</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Inference Comparison Card */}
                                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', fontFamily: 'monospace' }}>
                                        INFERENCE COMPARISON
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, fontFamily: 'monospace' }}>Classical XGBoost</div>
                                        <div style={{ fontSize: 22, fontWeight: 900, color: '#B45309', fontFamily: 'monospace' }}>0.824</div>
                                    </div>
                                    <div style={{ borderTop: '1px solid #CBD5E1', paddingTop: 8 }}>
                                        <div style={{ fontSize: 10, color: '#005D68', fontWeight: 800, fontFamily: 'monospace' }}>Quantum SVM (VQC)</div>
                                        <div style={{ fontSize: 26, fontWeight: 900, color: '#DC2626', fontFamily: 'monospace' }}>0.987</div>
                                        <div style={{ fontSize: 9, color: '#64748B', marginTop: 4, fontFamily: 'monospace', fontWeight: 700 }}>Latency: 18ms | Conf: High</div>
                                    </div>
                                </div>
                            </div>

                            {/* 2D PCA Decision Manifold Card */}
                            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 10, fontFamily: 'monospace' }}>
                                    2D DECISION MANIFOLD PROJECTION (PCA)
                                </div>
                                <div style={{ height: 160, background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 4, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* Grid Lines & Scatter Dots */}
                                    <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                                    <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#DC2626', position: 'absolute', left: '38%', top: '65%', border: '2px solid #FFF', boxShadow: '0 0 10px rgba(220,38,38,0.7)' }} />
                                    <span style={{ position: 'absolute', left: '38%', top: '78%', fontSize: 9, fontWeight: 800, color: '#DC2626', background: '#FFF', padding: '2px 6px', border: '1px solid #FCA5A5', borderRadius: 3, fontFamily: 'monospace' }}>ACC-8392</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FLAG GRAPH TAB */}
                    {activeTab === 'FLAG GRAPH' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 14, fontFamily: 'monospace' }}>
                                    TRANSACTION NETWORK GRAPH — FLAG GNN OUTPUT
                                </div>
                                <div style={{ height: 220, background: '#F8FAFC', border: '1px dashed #CBD5E1', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                                    {/* Central flagged node */}
                                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 52, height: 52, borderRadius: '50%', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 9, fontWeight: 900, fontFamily: 'monospace', textAlign: 'center', zIndex: 3, boxShadow: '0 0 18px rgba(220,38,38,0.5)' }}>
                                        {selectedAccountId}
                                    </div>
                                    {/* Connected nodes */}
                                    {[
                                        { label: 'NODE-A', left: '18%', top: '22%', color: '#F59E0B' },
                                        { label: 'NODE-B', left: '75%', top: '18%', color: '#F59E0B' },
                                        { label: 'NODE-C', left: '12%', top: '68%', color: '#64748B' },
                                        { label: 'NODE-D', left: '78%', top: '72%', color: '#DC2626' },
                                        { label: 'HDFC-BR', left: '42%', top: '12%', color: '#008080' },
                                    ].map((n, i) => (
                                        <div key={i} style={{ position: 'absolute', left: n.left, top: n.top, width: 38, height: 38, borderRadius: '50%', background: '#FFF', border: `2px solid ${n.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, fontFamily: 'monospace', color: n.color, zIndex: 2 }}>
                                            {n.label}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 10, fontFamily: 'monospace' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} /> HIGH RISK NODE</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} /> LINKED MULE</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#008080', display: 'inline-block' }} /> BANK NODE</span>
                                </div>
                            </div>
                            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 10, fontFamily: 'monospace' }}>GRAPH CENTRALITY METRICS</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                                    {[{ label: 'DEGREE CENTRALITY', val: '0.94' }, { label: 'BETWEENNESS', val: '0.81' }, { label: 'CONNECTED NODES', val: '14' }].map((m, i) => (
                                        <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 3, padding: 12, textAlign: 'center' }}>
                                            <div style={{ fontSize: 8, color: '#64748B', fontFamily: 'monospace' }}>{m.label}</div>
                                            <div style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace', marginTop: 4 }}>{m.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ZK PROOF TAB */}
                    {activeTab === 'ZK PROOF' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 18 }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 14, fontFamily: 'monospace' }}>ZK-PROOF VERIFICATION STATUS (Groth16)</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                                    <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 4, padding: 14 }}>
                                        <div style={{ fontSize: 10, color: '#166534', fontWeight: 800, fontFamily: 'monospace' }}>PROOF VERIFIED ✓</div>
                                        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569', marginTop: 8, wordBreak: 'break-all', lineHeight: 1.6 }}>
                                            <span style={{ color: '#64748B' }}>Commitment:</span><br />
                                            <span style={{ fontWeight: 700 }}>0xa3f9c2...8b21</span><br />
                                            <span style={{ color: '#64748B' }}>Proof Hash:</span><br />
                                            <span style={{ fontWeight: 700 }}>0x7fe10c...d492</span>
                                        </div>
                                    </div>
                                    <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 4, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {[{ label: 'PROTOCOL', val: 'Groth16' }, { label: 'CIRCUIT', val: 'KYC-4-bit' }, { label: 'PROVING TIME', val: '120ms' }, { label: 'VERIFIER', val: 'FIU-IND Node' }].map((r, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'monospace' }}>
                                                <span style={{ color: '#64748B' }}>{r.label}</span>
                                                <span style={{ fontWeight: 800, color: '#0F172A' }}>{r.val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 18 }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 10, fontFamily: 'monospace' }}>PRIVACY AUDIT TRAIL</div>
                                {[{ time: '09:41:22', event: 'ZK commitment generated for KYC attributes', ok: true },
                                { time: '09:41:24', event: 'Proof submitted to FIU-IND Groth16 verifier node', ok: true },
                                { time: '09:41:25', event: 'Proof verification returned: VALID (0-knowledge preserved)', ok: true },
                                { time: '09:41:27', event: 'Audit hash anchored to immutable ledger', ok: true }
                                ].map((e, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, fontSize: 11, fontFamily: 'monospace' }}>
                                        <span style={{ color: '#64748B', flexShrink: 0 }}>[{e.time}]</span>
                                        <span style={{ color: e.ok ? '#166534' : '#DC2626' }}>{e.event}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* TEMPORAL TAB */}
                    {activeTab === 'TEMPORAL' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 14, fontFamily: 'monospace' }}>TEMPORAL VELOCITY CHART — 30-DAY TRANSACTION HEATMAP</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30,1fr)', gap: 3, marginBottom: 10 }}>
                                    {Array.from({ length: 30 }, (_, i) => {
                                        const risk = i > 24 ? 'HIGH' : i > 18 ? 'MED' : 'LOW';
                                        const bg = risk === 'HIGH' ? '#DC2626' : risk === 'MED' ? '#F59E0B' : '#DCFCE7';
                                        const h = risk === 'HIGH' ? 44 + Math.random() * 20 : risk === 'MED' ? 24 + Math.random() * 16 : 8 + Math.random() * 12;
                                        return (
                                            <div key={i} title={`Day ${i + 1}: ${risk} risk`} style={{ height: 52, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                                                <div style={{ width: '100%', height: h, background: bg, borderRadius: '2px 2px 0 0' }} />
                                                <div style={{ fontSize: 7, color: '#94A3B8', fontFamily: 'monospace' }}>{i + 1}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div style={{ display: 'flex', gap: 14, fontSize: 10, fontFamily: 'monospace' }}>
                                    <span><span style={{ color: '#DC2626', fontWeight: 800 }}>■</span> HIGH VELOCITY</span>
                                    <span><span style={{ color: '#F59E0B', fontWeight: 800 }}>■</span> MEDIUM</span>
                                    <span><span style={{ color: '#166534', fontWeight: 800 }}>■</span> NORMAL</span>
                                </div>
                            </div>
                            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 16 }}>
                                <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', marginBottom: 10, fontFamily: 'monospace' }}>PEAK ANOMALY WINDOWS</div>
                                {[
                                    { window: 'Day 26–30', pattern: 'Rapid sub-threshold deposits (<₹50k)', severity: 'CRITICAL' },
                                    { window: 'Day 19–24', pattern: 'Cross-border RTGS velocity spike (+420%)', severity: 'HIGH' },
                                    { window: 'Day 10–14', pattern: 'Account dormancy then sudden reactivation', severity: 'MEDIUM' },
                                ].map((r, i) => (
                                    <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: 3, padding: '10px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>{r.window}</div>
                                            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{r.pattern}</div>
                                        </div>
                                        <span style={{ padding: '2px 8px', borderRadius: 3, fontSize: 9, fontWeight: 800, fontFamily: 'monospace', background: r.severity === 'CRITICAL' ? '#FEF2F2' : r.severity === 'HIGH' ? '#FFFBEB' : '#F1F5F9', color: r.severity === 'CRITICAL' ? '#DC2626' : r.severity === 'HIGH' ? '#D97706' : '#475569', border: `1px solid ${r.severity === 'CRITICAL' ? '#FCA5A5' : r.severity === 'HIGH' ? '#FDE68A' : '#CBD5E1'}` }}>{r.severity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Bottom Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 'auto', paddingTop: 10 }}>
                        <button
                            onClick={handleExportSar}
                            style={{ height: 36, padding: '0 16px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#0F172A', cursor: 'pointer', fontFamily: 'monospace' }}
                        >
                            EXPORT SAR
                        </button>
                        <button
                            onClick={handleMarkCleared}
                            style={{ height: 36, padding: '0 16px', background: '#FFFFFF', border: '1px solid #005D68', borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#005D68', cursor: 'pointer', fontFamily: 'monospace' }}
                        >
                            MARK CLEARED
                        </button>
                        <button
                            onClick={handleFreezeAccount}
                            style={{ height: 36, padding: '0 16px', background: '#DC2626', border: 'none', borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace' }}
                        >
                            <ShieldAlert size={14} /> FREEZE ACCOUNT
                        </button>
                    </div>
                </div>

                {/* Right Panel: Multi-Agent Terminal */}
                <div style={{ background: '#0F172A', color: '#F8FAFC', borderRadius: 4, border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {/* Terminal Header */}
                    <div style={{ padding: '12px 14px', background: '#1E293B', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Terminal size={14} color="#38BDF8" />
                            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.8px', color: '#CBD5E1', fontFamily: 'monospace' }}>MULTI-AGENT TERMINAL</span>
                        </div>
                        <span style={{ fontSize: 9, color: '#38BDF8', fontWeight: 800, fontFamily: 'monospace' }}>● 6 AGENTS ACTIVE</span>
                    </div>

                    {/* Sub-tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #334155', background: '#0F172A', fontSize: 10, fontFamily: 'monospace' }}>
                        {['AI_LOG', 'AUTO-SAR', 'AGENT-PIPE'].map(tt => (
                            <button
                                key={tt}
                                onClick={() => setActiveTerminalTab(tt)}
                                style={{
                                    flex: 1, padding: '8px 0', border: 'none', background: activeTerminalTab === tt ? '#1E293B' : 'transparent',
                                    color: activeTerminalTab === tt ? '#38BDF8' : '#64748B', fontWeight: 800, cursor: 'pointer'
                                }}
                            >
                                {tt}
                            </button>
                        ))}
                    </div>

                    {/* Terminal Output */}
                    <div style={{ flex: 1, padding: 14, fontFamily: 'monospace', fontSize: 11, lineHeight: 1.6, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ color: '#38BDF8' }}>&gt; INIT FORENSIC_SCAN({selectedAccountId})</div>
                        <div style={{ color: '#94A3B8' }}>[09:41:22] [AGENT_01_INGEST] Ingesting temporal transaction graph... OK</div>
                        <div style={{ color: '#94A3B8' }}>[09:41:23] [AGENT_02_SHAP] Calculating feature attribution vectors... OK</div>
                        <div style={{ color: '#F87171' }}>[09:41:25] [AGENT_03_RL] WARNING: Anomaly cluster detected in subspace 4.</div>
                        <div style={{ color: '#94A3B8' }}>[09:41:26] [AGENT_04_NLP] Generating narrative summary... OK</div>
                        <div style={{ color: '#38BDF8', marginTop: 6 }}>&gt; SCAN COMPLETE. AWAITING ANALYST INPUT_</div>
                    </div>

                    {/* Pipe Status Meters */}
                    <div style={{ padding: 12, background: '#1E293B', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: 6, fontSize: 9, fontFamily: 'monospace' }}>
                        <div style={{ color: '#94A3B8', fontWeight: 800, marginBottom: 2 }}>PIPE STATUS</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                            <span>INGEST</span>
                            <span style={{ color: '#38BDF8', fontWeight: 800 }}>100%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                            <span>SHAP_V</span>
                            <span style={{ color: '#38BDF8', fontWeight: 800 }}>100%</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#CBD5E1' }}>
                            <span>ZK_PROOF</span>
                            <span style={{ color: '#F59E0B', fontWeight: 800 }}>GEN...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

