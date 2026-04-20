import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Using a custom HTML marker for Airports
const getAirportIcon = (color) => {
    return L.divIcon({
        html: `<div style="color: ${color}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
           </div>`,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
    });
};

function MapUpdater({ routeDetails }) {
    const map = useMap();
    useEffect(() => {
        if (routeDetails && routeDetails.path) {
            map.fitBounds(routeDetails.path, { padding: [50, 50], duration: 1.5 });
        }
    }, [routeDetails, map]);
    return null;
}

export default function FlightMap({ routeDetails }) {
    const defaultCenter = [20.0, 0.0];

    const maxBounds = [
        [-90, -180],
        [90, 180]
    ];

    return (
        <MapContainer
            center={defaultCenter}
            zoom={3}
            minZoom={2.5}
            maxBounds={maxBounds}
            maxBoundsViscosity={1.0}
            zoomControl={false}
            attributionControl={false}
            style={{ width: '100%', height: '100%' }}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                noWrap={true}
                bounds={maxBounds}
            />

            {routeDetails && (
                <>
                    <Marker position={[routeDetails.origin.lat, routeDetails.origin.lon]} icon={getAirportIcon('#0ea5e9')}>
                        <Popup className="plane-popup">
                            <div style={{ textAlign: 'center', padding: '4px' }}>
                                <strong style={{ color: 'var(--accent-color)' }}>{routeDetails.origin.city || routeDetails.origin.name}</strong><br />
                                ({routeDetails.origin.iata})
                            </div>
                        </Popup>
                    </Marker>

                    <Marker position={[routeDetails.destination.lat, routeDetails.destination.lon]} icon={getAirportIcon('#10b981')}>
                        <Popup className="plane-popup">
                            <div style={{ textAlign: 'center', padding: '4px' }}>
                                <strong style={{ color: '#10b981' }}>{routeDetails.destination.city || routeDetails.destination.name}</strong><br />
                                ({routeDetails.destination.iata})
                            </div>
                        </Popup>
                    </Marker>

                    <Polyline
                        positions={routeDetails.path}
                        color="#10b981"
                        weight={4}
                        dashArray="10, 15"
                        className="animated-route"
                    />
                </>
            )}

            <MapUpdater routeDetails={routeDetails} />
        </MapContainer>
    );
}
