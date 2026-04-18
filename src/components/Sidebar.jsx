import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchFlightSchedules, fetchGlobalAirportsList } from '../api/flightApi';
import AutocompleteInput from './AutocompleteInput';

export default function Sidebar({ setRouteCoordinates }) {
    // Global airports state (fetched from network API)
    const [globalAirports, setGlobalAirports] = useState([]);
    const [airportsLoading, setAirportsLoading] = useState(true);

    useEffect(() => {
        async function loadAirports() {
            const data = await fetchGlobalAirportsList();
            setGlobalAirports(data);
            setAirportsLoading(false);
        }
        loadAirports();
    }, []);

    // Route search state
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [routeLoading, setRouteLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleRouteSearch = async () => {
        if (!origin || !destination) return;
        setRouteLoading(true);
        setHasSearched(true);
        try {
            const results = await fetchFlightSchedules(origin.iata, destination.iata);
            setSchedules(results);
            // Draw path and markers on Map
            setRouteCoordinates({
                origin: origin,
                destination: destination,
                path: [[parseFloat(origin.lat), parseFloat(origin.lon)], [parseFloat(destination.lat), parseFloat(destination.lon)]]
            });
        } catch (e) {
            console.error(e);
            alert("Failed to fetch from AviationStack. Check console for details.");
        } finally {
            setRouteLoading(false);
        }
    };

    return (
        <div className="glass-panel fade-in" style={{ display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 140px)' }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--panel-border)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--accent-color)', margin: 0 }}>Global Route Tracker</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Powered by AviationStack</p>
            </div>

            <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '500', marginBottom: '4px' }}>Find Flights</h3>

                    {airportsLoading ? (
                        <p style={{ color: 'var(--accent-color)', fontSize: '0.85rem' }}>Fetching global airport network database...</p>
                    ) : (
                        <>
                            <AutocompleteInput placeholder="Origin (e.g. London, LHR)" value={origin} onSelect={setOrigin} airportsList={globalAirports} />
                            <AutocompleteInput placeholder="Destination (e.g. New York, JFK)" value={destination} onSelect={setDestination} airportsList={globalAirports} />
                        </>
                    )}

                    <button
                        onClick={handleRouteSearch}
                        disabled={!origin || !destination || routeLoading}
                        style={{
                            background: 'var(--primary-gradient)', color: 'white', border: 'none', borderRadius: '10px',
                            padding: '12px', fontWeight: '600', cursor: (!origin || !destination) ? 'not-allowed' : 'pointer',
                            opacity: (!origin || !destination || routeLoading) ? 0.5 : 1, transition: 'all 0.2s', marginTop: '4px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <Search size={16} />
                        {routeLoading ? 'Searching routes...' : 'Search & Plot Path'}
                    </button>
                </div>

                {schedules.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                        <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--panel-border)', paddingBottom: '8px' }}>
                            Live Schedule ({origin?.iata} ✈ {destination?.iata})
                        </h3>
                        {schedules.map((schedule, idx) => (
                            <div key={idx} style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px', border: '1px solid var(--panel-border)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <strong style={{ color: 'var(--text-main)' }}>{schedule.airline} {schedule.flightNumber}</strong>
                                    <span style={{ fontSize: '0.8rem', color: schedule.status === 'Delayed' ? '#ef4444' : '#4ade80' }}>
                                        {schedule.status}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <span>Dep: {schedule.departureTime}</span>
                                    <span>Arr: {schedule.arrivalTime}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {hasSearched && !routeLoading && origin && destination && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '10px', marginTop: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.4 }}>
                                    <strong>No flights mapping found!</strong><br />
                                    AviationStack's free tier has strict boundaries. Try a massive global route like <strong>LHR</strong> ✈ <strong>JFK</strong> or wait for more active flights!
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
