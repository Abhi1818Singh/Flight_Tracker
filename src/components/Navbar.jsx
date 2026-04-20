import React from 'react';
import { Plane, LogIn, User, LogOut } from 'lucide-react';
import { supabase } from '../api/supabaseClient';

export default function Navbar({ session, onLoginClick }) {

    const handleLogout = async () => {
        if (supabase) await supabase.auth.signOut();
    };

    return (
        <nav className="glass-panel fade-in" style={{
            position: 'absolute', top: '24px', left: '24px', right: '24px', zIndex: 20,
            padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--primary-gradient)', padding: '10px', borderRadius: '12px' }}>
                    <Plane size={24} color="white" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>AeroTrack</h1>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Global Route Scheduler</p>
                </div>
            </div>

            <div>
                {session ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                            <User size={18} color="var(--accent-color)" />
                            <span style={{ fontSize: '0.9rem' }}>{session.user.email}</span>
                        </div>
                        <button onClick={handleLogout} style={{
                            background: 'transparent', border: '1px solid var(--error-color)', color: 'var(--error-color)',
                            padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                ) : (
                    <button onClick={onLoginClick} style={{
                        background: 'var(--primary-gradient)', color: 'white', border: 'none',
                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)'
                    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        <LogIn size={18} /> Login / Sign Up
                    </button>
                )}
            </div>
        </nav>
    );
}
