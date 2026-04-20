import React from 'react';

export default function Footer() {
    return (
        <div className="glass-panel fade-in" style={{
            position: 'absolute', bottom: '16px', right: '24px', zIndex: 10,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
            color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.5px'
        }}>
            made by <strong style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Abhishek Indradeo Singh</strong>
        </div>
    );
}
