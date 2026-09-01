import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export function ToastNotification({ toast, onClose }) {
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toast, onClose]);

    if (!toast) return null;

    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 2000,
            background: '#0F172A', color: '#F8FAFC', border: '1px solid #334155',
            borderRadius: 6, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
            animation: 'fadeIn 200ms ease-out'
        }}>
            <CheckCircle2 size={16} color="#00C2A8" />
            <span>{toast}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', marginLeft: 8 }}>
                <X size={14} />
            </button>
        </div>
    );
}
