import React, { useState } from 'react';
import { X, Plus, ShieldAlert, FolderPlus } from 'lucide-react';

export function NewCaseModal({ isOpen, onClose, onCreateCase }) {
    const [accId, setAccId] = useState('ACC-8392');
    const [offense, setOffense] = useState('Structuring & Rapid Layering');
    const [severity, setSeverity] = useState('HIGH');
    const [notes, setNotes] = useState('Multiple cash deposits under INR 50,000 threshold followed by immediate RTGS transfer.');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCase = {
            id: `CASE-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            accountId: accId,
            offense,
            severity,
            notes,
            date: new Date().toISOString().split('T')[0]
        };
        onCreateCase(newCase);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            fontFamily: 'Inter, -apple-system, sans-serif'
        }}>
            <div style={{
                width: 500, background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6,
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '16px 20px', background: '#F8FAFC', borderBottom: '1px solid #CBD5E1',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FolderPlus size={18} color="#005D68" />
                        <span style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace' }}>
                            CREATE NEW INVESTIGATION CASE
                        </span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            TARGET ACCOUNT ID
                        </label>
                        <input
                            required
                            value={accId}
                            onChange={e => setAccId(e.target.value)}
                            placeholder="e.g. ACC-8392"
                            style={{
                                width: '100%', height: 36, marginTop: 4, background: '#F8FAFC', border: '1px solid #CBD5E1',
                                borderRadius: 3, padding: '0 10px', fontSize: 12, fontWeight: 700, color: '#0F172A', fontFamily: 'monospace'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            PRIMARY SUSPECTED OFFENSE
                        </label>
                        <select
                            value={offense}
                            onChange={e => setOffense(e.target.value)}
                            style={{
                                width: '100%', height: 36, marginTop: 4, background: '#F8FAFC', border: '1px solid #CBD5E1',
                                borderRadius: 3, padding: '0 10px', fontSize: 12, fontWeight: 700, color: '#0F172A', fontFamily: 'monospace'
                            }}
                        >
                            <option value="Structuring & Rapid Layering">Structuring & Rapid Layering</option>
                            <option value="Pass-through Mule Account">Pass-through Mule Account</option>
                            <option value="Sanctions Evasion Node">Sanctions Evasion Node</option>
                            <option value="Synthetic Identity Network">Synthetic Identity Network</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            CASE SEVERITY
                        </label>
                        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                            {['CRITICAL', 'HIGH', 'MEDIUM'].map(lvl => (
                                <button
                                    type="button"
                                    key={lvl}
                                    onClick={() => setSeverity(lvl)}
                                    style={{
                                        flex: 1, height: 32, borderRadius: 3, fontSize: 11, fontWeight: 800, fontFamily: 'monospace',
                                        cursor: 'pointer', border: severity === lvl ? '2px solid #005D68' : '1px solid #CBD5E1',
                                        background: severity === lvl ? '#E6F4F1' : '#F8FAFC',
                                        color: severity === lvl ? '#005D68' : '#64748B'
                                    }}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            INITIAL ANALYST NOTES
                        </label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            style={{
                                width: '100%', marginTop: 4, background: '#F8FAFC', border: '1px solid #CBD5E1',
                                borderRadius: 3, padding: 10, fontSize: 12, color: '#0F172A', fontFamily: 'Inter, sans-serif'
                            }}
                        />
                    </div>

                    {/* Footer */}
                    <div style={{
                        marginTop: 8, paddingTop: 16, borderTop: '1px solid #E2E8F0',
                        display: 'flex', justifyContent: 'flex-end', gap: 10
                    }}>
                        <button type="button" onClick={onClose} style={{
                            height: 34, padding: '0 16px', background: '#FFFFFF', border: '1px solid #CBD5E1',
                            borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#0F172A', cursor: 'pointer', fontFamily: 'monospace'
                        }}>
                            CANCEL
                        </button>
                        <button type="submit" style={{
                            height: 34, padding: '0 16px', background: '#005D68', border: 'none',
                            borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#FFFFFF', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace'
                        }}>
                            <Plus size={14} /> CREATE CASE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
