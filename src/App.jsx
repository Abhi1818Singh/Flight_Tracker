import React, { useState } from 'react';
import FlightMap from './components/FlightMap';
import Sidebar from './components/Sidebar';
import { Plane } from 'lucide-react';

function App() {
  // We now only care about the isolated flight route path.
  // routeCoordinates structure: { origin: {...}, destination: {...}, path: [[lat, lon], [lat, lon]] }
  const [routeCoordinates, setRouteCoordinates] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <FlightMap routeDetails={routeCoordinates} />
      </div>

      <header className="glass-panel fade-in" style={{
        position: 'absolute', top: '24px', left: '24px', zIndex: 10,
        padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px',
        maxWidth: '350px'
      }}>
        <div style={{ background: 'var(--primary-gradient)', padding: '10px', borderRadius: '12px' }}>
          <Plane size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>AeroTrack Pro</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Global Route Scheduler</p>
        </div>
      </header>

      <div style={{ position: 'absolute', top: '120px', left: '24px', zIndex: 10, width: '380px' }}>
        <Sidebar setRouteCoordinates={setRouteCoordinates} />
      </div>
    </div>
  );
}

export default App;
