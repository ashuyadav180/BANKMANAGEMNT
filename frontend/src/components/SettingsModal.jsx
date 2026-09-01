import React, { useState } from 'react';
import { X, Save, Sliders, Bell, Shield, Server, Check } from 'lucide-react';

export function SettingsModal({ isOpen, onClose, onSaveToast }) {
    const [riskThreshold, setRiskThreshold] = useState(70);
    const [autoSar, setAutoSar] = useState(true);
    const [wsLive, setWsLive] = useState(true);
    const [backendUrl, setBackendUrl] = useState('http://localhost:3001');

    if (!isOpen) return null;

    const handleSave = () => {
        if (onSaveToast) onSaveToast('Settings saved successfully!');
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
                width: 520, background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 6,
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
                {/* Modal Header */}
                <div style={{
                    padding: '16px 20px', background: '#F8FAFC', borderBottom: '1px solid #CBD5E1',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Sliders size={18} color="#005D68" />
                        <span style={{ fontSize: 15, fontWeight: 900, color: '#0F172A', fontFamily: 'monospace' }}>
                            SOC COMMAND SYSTEM SETTINGS
                        </span>
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body Content */}
                <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {/* Backend API Endpoint */}
                    <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                            BACKEND API ENDPOINT
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                            <Server size={14} color="#64748B" />
                            <input
                                value={backendUrl}
                                onChange={e => setBackendUrl(e.target.value)}
                                style={{
                                    flex: 1, height: 36, background: '#F8FAFC', border: '1px solid #CBD5E1',
                                    borderRadius: 3, padding: '0 10px', fontSize: 12, fontWeight: 600, color: '#0F172A', fontFamily: 'monospace'
                                }}
                            />
                        </div>
                    </div>

                    {/* Alert Threshold Slider */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ fontSize: 10, fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                                RISK ALERT THRESHOLD SCORE ({riskThreshold}%)
                            </label>
                            <span style={{ fontSize: 10, fontWeight: 800, color: '#005D68', fontFamily: 'monospace' }}>HIGH CRITICALITY</span>
                        </div>
                        <input
                            type="range" min="30" max="95" value={riskThreshold}
                            onChange={e => setRiskThreshold(e.target.value)}
                            style={{ width: '100%', marginTop: 8, accentColor: '#005D68', cursor: 'pointer' }}
                        />
                    </div>

                    {/* Toggles */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid #E2E8F0', paddingTop: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Bell size={16} color="#005D68" />
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Automated SAR Narrative Generation</div>
                                    <div style={{ fontSize: 10, color: '#64748B' }}>Auto-draft SAR narrative using Gemini LLM when risk score {'>'} 70</div>
                                </div>
                            </div>
                            <input
                                type="checkbox" checked={autoSar} onChange={e => setAutoSar(e.target.checked)}
                                style={{ width: 16, height: 16, accentColor: '#005D68', cursor: 'pointer' }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Shield size={16} color="#005D68" />
                                <div>
                                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0F172A' }}>Real-time WebSocket Live Feed Sync</div>
                                    <div style={{ fontSize: 10, color: '#64748B' }}>Receive live alerts from Node.js backend port 3001</div>
                                </div>
                            </div>
                            <input
                                type="checkbox" checked={wsLive} onChange={e => setWsLive(e.target.checked)}
                                style={{ width: 16, height: 16, accentColor: '#005D68', cursor: 'pointer' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div style={{
                    padding: '12px 20px', background: '#F8FAFC', borderTop: '1px solid #CBD5E1',
                    display: 'flex', justifyContent: 'flex-end', gap: 10
                }}>
                    <button onClick={onClose} style={{
                        height: 34, padding: '0 16px', background: '#FFFFFF', border: '1px solid #CBD5E1',
                        borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#0F172A', cursor: 'pointer', fontFamily: 'monospace'
                    }}>
                        CANCEL
                    </button>
                    <button onClick={handleSave} style={{
                        height: 34, padding: '0 16px', background: '#005D68', border: 'none',
                        borderRadius: 3, fontSize: 11, fontWeight: 800, color: '#FFFFFF', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace'
                    }}>
                        <Save size={14} /> SAVE SETTINGS
                    </button>
                </div>
            </div>
        </div>
    );
}
