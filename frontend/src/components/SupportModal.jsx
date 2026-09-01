import React from 'react';
import { X, HelpCircle, ShieldCheck, CheckCircle2, Download, ExternalLink, LifeBuoy } from 'lucide-react';

export function SupportModal({ isOpen, onClose, onToast }) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            fontFamily: 'Inter, -apple-system, sans-serif'
        }}>
            <div style={{
                width: 540, background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6,
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '16px 20px', background: '#F8FAFC', borderBottom: '1px solid #CBD5E1',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <HelpCircle size={18} color="#005D68" />
                        <span style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace' }}>
                            SOC SUPPORT & DIAGNOSTICS
                        </span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* System Status Banner */}
                    <div style={{
                        background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 4,
                        padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <CheckCircle2 size={20} color="#166534" />
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 800, color: '#166534', fontFamily: 'monospace' }}>ALL SOC NODES OPERATIONAL</div>
                                <div style={{ fontSize: 10, color: '#15803D' }}>Latency: 14ms | Node.js Backend: Port 3001 Connected</div>
                            </div>
                        </div>
                        <span style={{ fontSize: 9, fontWeight: 800, color: '#166534', background: '#DCFCE7', padding: '2px 6px', borderRadius: 3, fontFamily: 'monospace' }}>
                            STABLE
                        </span>
                    </div>

                    {/* Resources List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            OPERATIONAL DOCUMENTATION & GUIDES
                        </label>

                        <div style={{ border: '1px solid #E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ padding: '10px 14px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <ShieldCheck size={14} color="#005D68" />
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>FIU-IND Anti-Money Laundering SOP Manual</span>
                                </div>
                                <button
                                    onClick={() => onToast && onToast('Downloading SOP Manual...')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#005D68', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <Download size={12} /> PDF
                                </button>
                            </div>

                            <div style={{ padding: '10px 14px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <LifeBuoy size={14} color="#005D68" />
                                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0F172A' }}>Level 4 Analyst Incident Response Playbook</span>
                                </div>
                                <button
                                    onClick={() => onToast && onToast('Opening Playbook...')}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#005D68', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}
                                >
                                    <ExternalLink size={12} /> VIEW
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #CBD5E1',
                    display: 'flex', justifyContent: 'flex-end'
                }}>
                    <button onClick={onClose} style={{
                        height: 34, padding: '0 16px', background: '#005D68', border: 'none',
                        borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#FFFFFF', cursor: 'pointer', fontFamily: 'monospace'
                    }}>
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}
