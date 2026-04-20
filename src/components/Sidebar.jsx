import React, { useState, useEffect } from 'react';
import { Search, Compass } from 'lucide-react';
import { fetchFlightSchedules, fetchGlobalAirportsList } from '../api/flightApi';
import AutocompleteInput from './AutocompleteInput';
import { supabase } from '../api/supabaseClient';

export default function Sidebar({ setRouteCoordinates, session }) {
    const [globalAirports, setGlobalAirports] = useState([]);
    const [airportsLoading, setAirportsLoading] = useState(true);

    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [routeLoading, setRouteLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        async function loadAirports() {
            const data = await fetchGlobalAirportsList();
            setGlobalAirports(data);
            setAirportsLoading(false);
        }
        loadAirports();
    }, []);

    const handleRouteSearch = async (forceOrigin, forceDest) => {
        const o = forceOrigin || origin;
        const d = forceDest || destination;

        if (!o || !d) return;
        setRouteLoading(true);
        setHasSearched(true);

        try {
            const results = await fetchFlightSchedules(o.iata, d.iata);
            setSchedules(results);

            setRouteCoordinates({
                origin: o,
                destination: d,
                path: [[parseFloat(o.lat), parseFloat(o.lon)], [parseFloat(d.lat), parseFloat(d.lon)]]
            });

            if (session && supabase) {
                await supabase.from('search_history').insert([
                    { user_id: session.user.id, origin_iata: o.iata, destination_iata: d.iata }
                ]);
                window.dispatchEvent(new Event('hub-update'));
            }
        } catch (e) {
            console.error(e);
            alert("Failed to fetch routes.");
        } finally {
            setRouteLoading(false);
        }
    };

    const getFullAirport = (iataCode) => {
        return globalAirports.find(a => a.iata === iataCode) || { iata: iataCode, name: iataCode, lat: 0, lon: 0 };
    };

    const popularSuggestions = [
        { orig: 'BOM', dest: 'DEL', label: 'Mumbai to Delhi (Domestic)' },
        { orig: 'JFK', dest: 'LHR', label: 'New York to London (Global)' },
        { orig: 'DXB', dest: 'SIN', label: 'Dubai to Singapore (Global)' }
    ];

    return (
        <div className="glass-panel fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--panel-border)' }}>
                <div style={{ flex: 1, padding: '16px', background: 'transparent', color: 'white', fontWeight: '600', display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', fontSize: '1.05rem' }}>
                    <Search size={18} color="var(--accent-color)" /> Flight Scheduler
                </div>
            </div>

            <div style={{ padding: '24px 20px 10px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {airportsLoading ? (
                        <p style={{ color: 'var(--accent-color)', fontSize: '0.85rem', textAlign: 'center' }}>Connecting to Global Aviation nodes...</p>
                    ) : (
                        <>
                            <AutocompleteInput placeholder="Origin (e.g. London, LHR)" value={origin} onSelect={setOrigin} airportsList={globalAirports} />
                            <AutocompleteInput placeholder="Destination (e.g. New York, JFK)" value={destination} onSelect={setDestination} airportsList={globalAirports} />
                        </>
                    )}

                    <button
                        onClick={() => handleRouteSearch()}
                        disabled={!origin || !destination || routeLoading}
                        style={{
                            background: 'var(--primary-gradient)', color: 'white', border: 'none', borderRadius: '12px',
                            padding: '14px', fontWeight: '600', cursor: (!origin || !destination) ? 'not-allowed' : 'pointer',
                            opacity: (!origin || !destination || routeLoading) ? 0.5 : 1, transition: 'all 0.2s', marginTop: '4px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = (!origin || !destination || routeLoading) ? 'none' : 'translateY(-2px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                        <Search size={18} />
                        {routeLoading ? 'Scanning...' : 'Search & Plot Path'}
                    </button>
                </div>
            </div>

            <div style={{ padding: '10px 20px 20px 20px', flex: 1, overflowY: 'auto' }}>
                {/* Live Results Render Here */}
                {schedules.length > 0 ? (
                    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', paddingBottom: '12px', marginBottom: '4px' }}>
                            <h3 style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: 0 }}>
                                Active Map ({origin?.iata} ✈ {destination?.iata})
                            </h3>
                        </div>

                        {schedules.map((schedule, idx) => (
                            <div key={idx} style={{ padding: '14px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ color: 'var(--text-main)', fontSize: '1rem' }}>{schedule.airline} {schedule.flightNumber}</strong>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: schedule.status === 'Delayed' ? '#ef4444' : '#10b981', background: schedule.status === 'Delayed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                                        {schedule.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <span>Dep: <span style={{ color: 'white' }}>{schedule.departureTime}</span></span>
                                    <span>Arr: <span style={{ color: 'white' }}>{schedule.arrivalTime}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {hasSearched ? (
                            <>
                                {!routeLoading && origin && destination && (
                                    <div className="fade-in" style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
                                            <strong>No active nodes mapped!</strong><br />
                                            AviationStack Free tier requires major volume routes. Test globally connected hubs like <strong>DXB</strong> or <strong>LHR</strong>!
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Top Global Suggestions mapped actively to the main sidebar canvas */
                            <div className="fade-in">
                                <h3 style={{ fontSize: '0.95rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 12px 0' }}><Compass size={16} /> Top Global Suggestions</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                    {popularSuggestions.map((sug, idx) => (
                                        <div key={idx} onClick={() => {
                                            const o = getFullAirport(sug.orig);
                                            const d = getFullAirport(sug.dest);
                                            setOrigin(o); setDestination(d);
                                            handleRouteSearch(o, d);
                                        }} style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>{sug.orig} ✈ {sug.dest}</strong>
                                                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>{sug.label}</span>
                                            </div>
                                            <Compass size={16} color="#10b981" opacity={0.5} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
