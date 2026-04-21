import React, { useState, useEffect } from 'react';
import FlightMap from './components/FlightMap';
import Sidebar from './components/Sidebar';
import HubPanel from './components/HubPanel';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { supabase } from './api/supabaseClient';

function App() {
  const [routeCoordinates, setRouteCoordinates] = useState(null);
  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="app-container">
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        <FlightMap routeDetails={routeCoordinates} />
      </div>

      <Navbar session={session} onLoginClick={() => setShowAuthModal(true)} />

      {/* Responsive Panels Engine replacing static absolute wrappers */}
      <div className="panels-wrapper">
        <div className="left-panel">
          <Sidebar setRouteCoordinates={setRouteCoordinates} session={session} />
        </div>

        <div className="right-panel">
          <HubPanel setRouteCoordinates={setRouteCoordinates} session={session} />
        </div>
      </div>

      <Footer />

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default App;
