import React, { useState } from 'react';
import { supabase } from '../api/supabaseClient';
import { X, Mail, Lock, User } from 'lucide-react';

export default function AuthModal({ onClose }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!supabase) return setError("Supabase keys are missing in .env!");

        setLoading(true);
        setError(null);
        try {
            if (mode === 'signup') {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: name } }
                });
                if (signUpError) throw signUpError;
                alert("Success! Please check your email inbox to verify your brand new account.");
                onClose();
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });
                if (signInError) throw signInError;
                onClose();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="glass-panel" style={{
                width: '100%', maxWidth: '420px', padding: '36px', borderRadius: '24px',
                position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                    <X size={24} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: '600', letterSpacing: '-0.5px' }}>
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {mode === 'login' ? 'Sign in to access your flight hub and routes' : 'Join AeroTrack Pro to save global routes'}
                    </p>
                </div>

                {error && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {mode === 'signup' && (
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '14px' }}>
                            <User size={18} color="var(--accent-color)" style={{ marginRight: '12px' }} />
                            <input required type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontFamily: 'Outfit', fontSize: '0.95rem' }} />
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '14px' }}>
                        <Mail size={18} color="var(--accent-color)" style={{ marginRight: '12px' }} />
                        <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontFamily: 'Outfit', fontSize: '0.95rem' }} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '14px' }}>
                        <Lock size={18} color="var(--accent-color)" style={{ marginRight: '12px' }} />
                        <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontFamily: 'Outfit', fontSize: '0.95rem' }} />
                    </div>

                    <button disabled={loading} type="submit" style={{
                        background: 'var(--primary-gradient)', color: 'white', border: 'none', borderRadius: '10px',
                        padding: '16px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginTop: '8px', fontSize: '1.05rem', letterSpacing: '0.5px', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
                    }} onMouseEnter={e => e.currentTarget.style.transform = loading ? 'none' : 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        {loading ? 'Processing...' : (mode === 'login' ? 'Sign In Securely' : 'Sign Up')}
                    </button>
                </form>

                <p style={{ textAlign: 'center', margin: '16px 0 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', fontWeight: '600', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                        {mode === 'login' ? 'Sign Up' : 'Log In'}
                    </button>
                </p>

            </div>
        </div>
    );
}
