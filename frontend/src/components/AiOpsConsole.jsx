import React, { useState, useEffect, useRef } from 'react';
import { Activity, CheckCircle2, ShieldCheck, FileText, Network, Cpu, Lock, Zap, RefreshCw, Trash2, Play } from 'lucide-react';

const LOG_TEMPLATES = [
    { agent: 'AGENT_01_INGEST', msg: 'Ingesting temporal velocity graph for node cluster...', accId: null },
    { agent: 'AGENT_02_SHAP', msg: 'Feature attribution computed. Top driver: Tx_Velocity (0.85)', accId: 'ACC-9921-XF' },
    { agent: 'AGENT_03_RL', msg: 'WARNING: Anomaly cluster detected in latent subspace 4.', accId: 'ACC-8392' },
    { agent: 'AGENT_04_NLP', msg: 'Generating SAR narrative summary... DONE', accId: null },
    { agent: 'AGENT_05_ZK', msg: 'ZK-proof generation complete. Commitment hash: 0xa3f9...', accId: null },
    { agent: 'AGENT_06_SAR', msg: 'Draft SAR submitted to regulatory gateway.', accId: 'ACC-3314-KL' },
    { agent: 'AGENT_01_INGEST', msg: 'RTGS wire transfer flagged — cross-border, high-risk jurisdiction.', accId: 'ACC-7741-99' },
    { agent: 'AGENT_02_SHAP', msg: 'Recalculating model weights post adversarial stress test...', accId: null },
];

function pad(n) { return String(n).padStart(2, '0'); }
function now() {
    const d = new Date();
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function AiOpsConsole({ onToast }) {
    const [logLines, setLogLines] = useState([
        { time: now(), agent: 'SYSTEM', accId: null, msg: 'MuleWatch AI v2.4.0 — 6-Agent pipeline initialized.' }
    ]);
    const logRef = useRef(null);

    const agentList = [
        { name: 'Intake Agent', icon: Cpu, throughput: '1,420 msg/s', mem: '142 MB', err: '0.01%', lat: '12ms', status: 'Healthy' },
        { name: 'Typology Matcher', icon: Zap, throughput: '890 msg/s', mem: '310 MB', err: '0.04%', lat: '45ms', status: 'Healthy' },
        { name: 'Network Mapper (FLAG GNN)', icon: Network, throughput: '420 graph/s', mem: '680 MB', err: '0.02%', lat: '88ms', status: 'Healthy' },
        { name: 'ZK Prover (Groth16)', icon: Lock, throughput: '150 proof/s', mem: '512 MB', err: '0.00%', lat: '120ms', status: 'Healthy' },
        { name: 'Narrative Builder (Gemini 2.5)', icon: FileText, throughput: '80 doc/s', mem: '240 MB', err: '0.05%', lat: '210ms', status: 'Healthy' },
        { name: 'SAR Drafter (FIU-IND)', icon: ShieldCheck, throughput: '210 sar/s', mem: '180 MB', err: '0.00%', lat: '34ms', status: 'Healthy' }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const tmpl = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
            setLogLines(prev => [...prev.slice(-80), { time: now(), ...tmpl }]);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [logLines]);

    const handleClearLogs = () => {
        setLogLines([{ time: now(), agent: 'SYSTEM', accId: null, msg: 'Log buffer cleared by analyst.' }]);
        if (onToast) onToast('System log cleared.');
    };

    const handleHealthCheck = () => {
        setLogLines(prev => [...prev, { time: now(), agent: 'SYSTEM', accId: null, msg: 'Full health check triggered. All 6 agents nominal.' }]);
        if (onToast) onToast('Health check complete — All 6 agents NOMINAL.');
    };

    const handleRestartAgent = (agentName) => {
        setLogLines(prev => [...prev, { time: now(), agent: 'SYSTEM', accId: null, msg: `RESTART issued for ${agentName}. Agent coming back online...` }]);
        if (onToast) onToast(`Restarting ${agentName}...`);
    };

    return (
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 400px', gap: 16, background: '#EDF1F5', padding: '24px 32px', overflow: 'hidden' }}>
            {/* Col 1: Global AI Console */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ height: 48, padding: '0 16px', background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Activity size={14} color="#005D68" />
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', fontFamily: 'monospace', textTransform: 'uppercase' }}>Global System Log Stream (Aggregated)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: '#64748B' }}>PROCESSING 25 LIVE FEEDS</span>
                        <button
                            onClick={handleHealthCheck}
                            title="Run Health Check"
                            style={{ height: 26, padding: '0 10px', background: '#E6F4F1', border: '1px solid #76A9B6', borderRadius: 3, fontSize: 10, fontWeight: 800, color: '#005D68', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace' }}
                        >
                            <Play size={10} /> HEALTH CHECK
                        </button>
                        <button
                            onClick={handleClearLogs}
                            title="Clear Logs"
                            style={{ height: 26, padding: '0 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 3, fontSize: 10, fontWeight: 800, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace' }}
                        >
                            <Trash2 size={10} /> CLEAR
                        </button>
                    </div>
                </div>

                {/* Log Window */}
                <div ref={logRef} style={{ flex: 1, padding: 16, background: '#0F172A', overflowY: 'auto', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.8, color: '#E2E8F0' }}>
                    {logLines.map((line, i) => (
                        <div key={i} style={{ marginBottom: 2 }}>
                            <span style={{ color: '#475569' }}>[{line.time}]</span>{' '}
                            <span style={{ color: line.agent === 'SYSTEM' ? '#F59E0B' : '#38BDF8', fontWeight: 700 }}>[{line.agent}]</span>{' '}
                            {line.accId && <span style={{ color: '#F59E0B' }}>({line.accId}) </span>}
                            <span style={{ color: line.msg.includes('WARNING') ? '#F87171' : '#F8FAFC' }}>{line.msg}</span>
                        </div>
                    ))}
                    <div style={{ color: '#38BDF8' }}>█</div>
                </div>
            </div>

            {/* Col 2: 6-Agent Pipeline Health Matrix */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ height: 48, padding: '0 16px', background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <ShieldCheck size={14} color="#005D68" />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', fontFamily: 'monospace', textTransform: 'uppercase' }}>6-Agent Pipeline Health</span>
                </div>

                <div style={{ flex: 1, padding: 14, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {agentList.map((ag, idx) => {
                        const Icon = ag.icon;
                        return (
                            <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 4, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <Icon size={14} color="#005D68" />
                                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>{ag.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{ fontSize: 9, fontWeight: 800, color: '#166534', background: '#DCFCE7', border: '1px solid #86EFAC', padding: '2px 6px', borderRadius: 3, display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace' }}>
                                            <CheckCircle2 size={10} /> {ag.status}
                                        </span>
                                        <button
                                            onClick={() => handleRestartAgent(ag.name)}
                                            title={`Restart ${ag.name}`}
                                            style={{ background: 'transparent', border: '1px solid #CBD5E1', borderRadius: 3, padding: '2px 5px', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center' }}
                                        >
                                            <RefreshCw size={10} />
                                        </button>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, textAlign: 'center' }}>
                                    {[
                                        { label: 'THROUGHPUT', val: ag.throughput, color: '#0F172A' },
                                        { label: 'MEMORY', val: ag.mem, color: '#0F172A' },
                                        { label: 'ERR RATE', val: ag.err, color: '#166534' },
                                        { label: 'LATENCY', val: ag.lat, color: '#005D68' }
                                    ].map(m => (
                                        <div key={m.label} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: 4, borderRadius: 3 }}>
                                            <div style={{ fontSize: 8, color: '#64748B', fontFamily: 'monospace' }}>{m.label}</div>
                                            <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: m.color }}>{m.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
