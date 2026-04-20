import React, { useState, useEffect } from 'react';
import { History } from 'lucide-react';
import { supabase } from '../api/supabaseClient';
import { fetchGlobalAirportsList } from '../api/flightApi';

export default function HubPanel({ setRouteCoordinates, session }) {
    const [globalAirports, setGlobalAirports] = useState([]);
    const [history, setHistory] = useState([]);
    const [dbLoading, setDbLoading] = useState(false);

    useEffect(() => {
        async function loadAirports() {
            const data = await fetchGlobalAirportsList();
            setGlobalAirports(data);
        }
        loadAirports();
    }, []);

    useEffect(() => {
        if (session) {
            fetchUserData();
        }
        const handler = () => fetchUserData();
        window.addEventListener('hub-update', handler);
        return () => window.removeEventListener('hub-update', handler);
    }, [session]);

    const fetchUserData = async () => {
        setDbLoading(true);
        try {
            const { data: historyData } = await supabase.from('search_history').select('*').order('created_at', { ascending: false }).limit(30);
            if (historyData) setHistory(historyData);
        } catch (e) {
            console.error(e);
        } finally {
            setDbLoading(false);
        }
    };

    const plotMapDataFromHub = async (origIata, destIata) => {
        const orig = globalAirports.find(a => a.iata === origIata) || { iata: origIata, name: origIata, lat: 0, lon: 0 };
        const dest = globalAirports.find(a => a.iata === destIata) || { iata: destIata, name: destIata, lat: 0, lon: 0 };

        if (!orig.lat || !dest.lat) return alert("Airport coordinate plotting is waiting for the global JSON dictionary to load...");

        setRouteCoordinates({
            origin: orig,
            destination: dest,
            path: [[parseFloat(orig.lat), parseFloat(orig.lon)], [parseFloat(dest.lat), parseFloat(dest.lon)]]
        });
    };

    if (!session) return null;

    return (
        <div className="glass-panel fade-in" style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                <div style={{ flex: 1, padding: '12px', background: 'transparent', color: 'white', fontWeight: '500', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', fontSize: '0.95rem' }}>
                    <History size={16} color="#f59e0b" /> Travel History
                </div>
            </div>

            <div style={{ padding: '16px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dbLoading ? <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Syncing records...</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {history.length > 0 ? history.map(h => (
                            <div key={h.id} className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'white', fontWeight: '600', fontSize: '0.85rem' }}>{h.origin_iata} ✈ {h.destination_iata}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '2px' }}>{new Date(h.created_at).toLocaleDateString()}</span>
                                </div>
                                <button onClick={() => plotMapDataFromHub(h.origin_iata, h.destination_iata)} style={{ background: 'var(--primary-gradient)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(56, 189, 248, 0.2)' }} onMouseEnter={e => e.currentTarget.style.opacity = 0.8} onMouseLeave={e => e.currentTarget.style.opacity = 1}>Plot</button>
                            </div>
                        )) : <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>No search history recorded yet.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
