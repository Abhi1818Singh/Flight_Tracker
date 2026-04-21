import React from 'react';
import { Plane, LogIn, User, LogOut } from 'lucide-react';
import { supabase } from '../api/supabaseClient';

export default function Navbar({ session, onLoginClick }) {

    const handleLogout = async () => {
        if (supabase) await supabase.auth.signOut();
    };

    return (
        <nav className="glass-panel fade-in navbar-wrapper">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="nav-logo-box">
                    <Plane className="nav-icon" color="white" />
                </div>
                <div>
                    <h1 className="nav-h1">AeroTrack</h1>
                    <p className="nav-sub">Global Route Scheduler</p>
                </div>
            </div>

            <div>
                {session ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div className="nav-user-box">
                            <User size={18} color="var(--accent-color)" />
                            <span className="nav-user-email">{session.user.email}</span>
                        </div>
                        <button onClick={handleLogout} className="logout-btn">
                            <LogOut size={16} /> <span className="nav-btn-text">Logout</span>
                        </button>
                    </div>
                ) : (
                    <button onClick={onLoginClick} className="login-btn">
                        <LogIn size={18} /> <span className="nav-btn-text">Login / Sign Up</span>
                    </button>
                )}
            </div>
        </nav>
    );
}
