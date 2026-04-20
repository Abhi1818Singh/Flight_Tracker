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
    }).slice(0, 50);

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%', zIndex: showDropdown ? 100 : 1 }}>
            {/* Reverted Input Bar to exact previous proportions */}
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px', transition: 'all 0.2s', boxShadow: showDropdown ? '0 4px 15px rgba(56, 189, 248, 0.2)' : 'none' }}>
                <MapPin size={16} color={showDropdown ? "var(--accent-color)" : "var(--text-muted)"} style={{ marginRight: '10px', transition: 'color 0.2s' }} />
                <input
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                        onSelect(null);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', fontFamily: 'Outfit', fontSize: '0.9rem' }}
                />
            </div>

            {/* Reverted dropdown geometry bounds entirely to original constraint frame padding */}
            {showDropdown && query && (
                <div className="glass-panel slide-down" style={{
                    position: 'absolute', top: '100%', left: '0', right: '0', width: '100%', marginTop: '6px',
                    maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.7)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px'
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
                                style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>{airport.city ? airport.city : airport.name}</strong>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{airport.name}</span>
                                </div>
                                <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: '700', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '4px 6px', borderRadius: '6px' }}>{airport.iata}</span>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No matching global nodes found</div>
                    )}
                </div>
            )}
        </div>
    );
}
