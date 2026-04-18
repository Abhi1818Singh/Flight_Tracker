import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';

export default function AutocompleteInput({ placeholder, value, onSelect, airportsList }) {
    const [query, setQuery] = useState(value ? `${value.city || value.name} (${value.iata})` : '');
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredAirports = airportsList.filter(a => {
        if (!query) return false;
        const q = query.toLowerCase();
        return (a.city && a.city.toLowerCase().includes(q)) ||
            (a.iata && a.iata.toLowerCase().includes(q)) ||
            (a.name && a.name.toLowerCase().includes(q));
    }).slice(0, 50); // limit to 50 for rendering performance

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--panel-border)', borderRadius: '10px', padding: '10px' }}>
                <MapPin size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                        onSelect(null); // clear selection when typing again
                    }}
                    onFocus={() => setShowDropdown(true)}
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontFamily: 'Outfit', fontSize: '0.9rem' }}
                />
            </div>

            {showDropdown && query && (
                <div className="glass-panel" style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
                    maxHeight: '200px', overflowY: 'auto', zIndex: 100, display: 'flex', flexDirection: 'column'
                }}>
                    {filteredAirports.length > 0 ? (
                        filteredAirports.map(airport => (
                            <div
                                key={airport.icao || airport.iata}
                                onClick={() => {
                                    setQuery(`${airport.city || airport.name} (${airport.iata})`);
                                    setShowDropdown(false);
                                    onSelect(airport);
                                }}
                                style={{ padding: '10px 12px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{airport.city ? airport.city : airport.name}</strong>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{airport.name}</span>
                                </div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '600' }}>{airport.iata}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '10px', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No airports found</div>
                    )}
                </div>
            )}
        </div>
    );
}
