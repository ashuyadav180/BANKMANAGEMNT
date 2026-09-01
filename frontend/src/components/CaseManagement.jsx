import React, { useState } from 'react';
import { Plus, Download, Sparkles, Check, X, Save } from 'lucide-react';

export function CaseManagement({ onToast, onOpenNewCase }) {
    const [selectedCase, setSelectedCase] = useState('CASE-992-A');
    const [narrative, setNarrative] = useState(
        "Between 2023-10-01 and 2023-10-15, Apex Global Trading LLC exhibited behavior consistent with layered smurfing. Specifically, 47 deposits marginally below the $10,000 reporting threshold (avg. $9,850) were made across 5 different metropolitan branches by unverified individuals. Funds were subsequently consolidated into a central operational account and immediately wired to overseas accounts."
    );

    const draftCases = [
        { id: 'CASE-992-A', title: 'Layered Smurfing Suspected', time: '12H REMAINING', risk: 'CRITICAL', color: '#DC2626' },
        { id: 'CASE-988-B', title: 'Anomalous Wire Vol. (UAE)', time: '24H REMAINING', risk: 'HIGH', color: '#D97706' },
        { id: 'CASE-971-C', title: 'Struct. Cash Dep. (Multi-node)', time: '48H REMAINING', risk: 'MODERATE', color: '#475569' },
    ];

    const filings = [
        { id: 'SAR-2023-881', entity: 'Meridian Shell Holdings', type: 'Trade-Based ML', date: '2023-10-18 14:22Z', status: 'FILED (ACK)', state: 'success' },
        { id: 'SAR-2023-880', entity: 'John Doe (Acct #992)', type: 'Rapid Cash Movement', date: '2023-10-17 09:11Z', status: 'PENDING BATCH', state: 'pending' },
        { id: 'SAR-2023-875', entity: 'Vanguard Logistics Ltd.', type: 'Sanctions Evasion (OFAC)', date: '2023-10-15 16:45Z', status: 'REJECTED (FMT)', state: 'rejected' },
    ];

    return (
        <div style={{
            flex: 1, padding: '24px 32px', background: '#EDF1F5', overflowY: 'auto',
            fontFamily: 'Inter, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', gap: 20
        }}>
            {/* Header & Main Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>Case Management</h1>
                    <div style={{ fontSize: 13, color: '#475569', marginTop: 4, fontWeight: 500 }}>
                        Automated Suspicious Activity Report (SAR) Generation & Filing
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                        padding: '6px 14px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 20,
                        fontSize: 10, fontWeight: 800, color: '#005D68', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace'
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#008080' }} />
                        SAR ENGINE LIVE
                    </div>
                    <button
                        onClick={onOpenNewCase}
                        style={{
                            height: 36, padding: '0 16px', background: '#FFFFFF', border: '1px solid #CBD5E1',
                            borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#005D68', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace'
                        }}
                    >
                        <Plus size={14} /> NEW MANUAL CASE
                    </button>
                    <button
                        onClick={() => onToast && onToast("Filing all approved SAR cases to regulatory gateway...")}
                        style={{
                            height: 36, padding: '0 16px', background: '#005D68', border: 'none',
                            borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#FFFFFF', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace'
                        }}
                    >
                        FILE ALL APPROVED
                    </button>
                </div>
            </div>

            {/* Split Grid: Draft Queue vs SAR Editor */}
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16 }}>
                {/* Draft Queue List */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            DRAFT QUEUE
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 800, background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '2px 8px', borderRadius: 3, fontFamily: 'monospace' }}>
                            3 PENDING
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {draftCases.map(c => {
                            const isSelected = selectedCase === c.id;
                            return (
                                <div
                                    key={c.id}
                                    onClick={() => setSelectedCase(c.id)}
                                    style={{
                                        background: isSelected ? '#F8FAFC' : '#FFFFFF',
                                        border: isSelected ? '2px solid #005D68' : '1px solid #CBD5E1',
                                        borderRadius: 4, padding: 12, cursor: 'pointer', transition: 'all 120ms ease'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                                        <span>{c.id}</span>
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', marginTop: 4 }}>
                                        {c.title}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, fontSize: 10, fontFamily: 'monospace' }}>
                                        <span style={{ color: '#64748B' }}>⏱ {c.time}</span>
                                        <span style={{ fontWeight: 800, color: c.color }}>RISK: {c.risk}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SAR Drafting Editor Panel */}
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Sparkles size={18} color="#005D68" />
                            <span style={{ fontSize: 14, fontWeight: 900, color: '#0F172A', letterSpacing: '0.5px', fontFamily: 'monospace' }}>
                                AUTOMATED SAR DRAFTING ({selectedCase})
                            </span>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', fontFamily: 'monospace' }}>
                            AI CONFIDENCE: <strong style={{ color: '#005D68' }}>94%</strong>
                        </span>
                    </div>

                    {/* Subject Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>PRIMARY SUBJECT (ENTITY)</label>
                            <input readOnly value="Apex Global Trading LLC" style={{ width: '100%', height: 34, background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 3, padding: '0 10px', marginTop: 4, fontSize: 12, fontWeight: 600, color: '#0F172A' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>SUBJECT ID (TAX/REG)</label>
                            <input readOnly value="TX-99281-A2" style={{ width: '100%', height: 34, background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 3, padding: '0 10px', marginTop: 4, fontSize: 12, fontWeight: 600, color: '#0F172A', fontFamily: 'monospace' }} />
                        </div>
                    </div>

                    {/* Regulatory Citations */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: 4, padding: 12 }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#005D68', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'monospace' }}>
                            REGULATORY CITATIONS (AUTO-MAPPED)
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {['PMLA 2002 § 12', 'RBI AML Master Dir. 2016', 'BSA 31 U.S.C. 5318(g)'].map((cit, i) => (
                                <span key={i} style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '4px 10px', borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#0F172A', fontFamily: 'monospace' }}>
                                    {cit}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Narrative Textarea */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>SUSPICIOUS ACTIVITY NARRATIVE</label>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#005D68', cursor: 'pointer', fontFamily: 'monospace' }}>✎ EDIT</span>
                        </div>
                        <textarea
                            value={narrative}
                            onChange={e => setNarrative(e.target.value)}
                            style={{
                                width: '100%', height: 100, background: '#FFFFFF', border: '1px solid #CBD5E1',
                                borderRadius: 4, padding: 10, fontSize: 12, color: '#0F172A', lineHeight: 1.5,
                                outline: 'none', fontFamily: 'inherit', resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* Action Bar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid #E2E8F0', paddingTop: 14 }}>
                        <button
                            onClick={() => onToast && onToast("Draft REJECTED and returned to triage queue.")}
                            style={{ height: 34, padding: '0 16px', background: '#FFFFFF', border: '1px solid #FCA5A5', borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace' }}
                        >
                            <X size={14} /> REJECT DRAFT
                        </button>
                        <button
                            onClick={() => onToast && onToast("Draft saved successfully.")}
                            style={{ height: 34, padding: '0 16px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace' }}
                        >
                            <Save size={14} /> SAVE DRAFT
                        </button>
                        <button
                            onClick={() => onToast && onToast("SAR APPROVED for regulatory filing!")}
                            style={{ height: 34, padding: '0 16px', background: '#005D68', border: 'none', borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#FFFFFF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace' }}
                        >
                            <Check size={14} /> APPROVE FOR FILING
                        </button>
                    </div>
                </div>
            </div>

            {/* Filing History Table */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 4, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A', letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                        FILING HISTORY
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            onClick={() => onToast && onToast("Exporting filing log as JSON...")}
                            style={{ height: 26, padding: '0 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 3, fontSize: 10, fontWeight: 800, color: '#005D68', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace' }}
                        >
                            <Download size={12} /> JSON
                        </button>
                        <button
                            onClick={() => onToast && onToast("Exporting filing log as CSV...")}
                            style={{ height: 26, padding: '0 10px', background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 3, fontSize: 10, fontWeight: 800, color: '#005D68', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'monospace' }}
                        >
                            <Download size={12} /> CSV
                        </button>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                    <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #CBD5E1', color: '#0F172A', fontSize: 10, fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            <th style={{ padding: '10px 14px' }}>FILING ID</th>
                            <th style={{ padding: '10px 14px' }}>ENTITY</th>
                            <th style={{ padding: '10px 14px' }}>PRIMARY OFFENSE TYPE</th>
                            <th style={{ padding: '10px 14px' }}>DATE SUBMITTED</th>
                            <th style={{ padding: '10px 14px' }}>REGULATOR STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filings.map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '12px 14px', fontFamily: 'monospace', fontWeight: 800, color: '#0F172A' }}>{row.id}</td>
                                <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0F172A' }}>{row.entity}</td>
                                <td style={{ padding: '12px 14px', color: '#475569' }}>{row.type}</td>
                                <td style={{ padding: '12px 14px', color: '#475569', fontFamily: 'monospace' }}>{row.date}</td>
                                <td style={{ padding: '12px 14px' }}>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 3, fontSize: 10, fontWeight: 800, fontFamily: 'monospace',
                                        background: row.state === 'success' ? '#DCFCE7' : row.state === 'pending' ? '#F1F5F9' : '#FEF2F2',
                                        color: row.state === 'success' ? '#166534' : row.state === 'pending' ? '#475569' : '#DC2626',
                                        border: `1px solid ${row.state === 'success' ? '#86EFAC' : row.state === 'pending' ? '#CBD5E1' : '#FCA5A5'}`
                                    }}>
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

