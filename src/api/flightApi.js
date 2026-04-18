import axios from 'axios';

/**
 * Fetch all global airports from an open JSON API dataset.
 * This completely avoids manually added lists!
 */
export const fetchGlobalAirportsList = async () => {
    try {
        const res = await axios.get('https://raw.githubusercontent.com/mwgg/Airports/master/airports.json');
        // Result is an object dictionary, so we map it to an array
        const airportArray = Object.values(res.data);
        // Only return major airports that have IATA codes
        return airportArray.filter(a => a.iata && a.iata.trim() !== '');
    } catch (error) {
        console.error("Failed to fetch world airports:", error);
        return [];
    }
};

/**
 * Fetch real commercial flight schedules using AviationStack
 */
export const fetchFlightSchedules = async (originIata, destinationIata) => {
    // Use the securely stored env var only
    const apiKey = import.meta.env.VITE_AVIATIONSTACK_KEY;

    if (!apiKey) {
        console.error("No API key configured. Check your .env file.");
        return [];
    }

    // Note: Free tier AviationStack ONLY supports HTTP data.
    // Because Vercel deploys an HTTPS website, we use a secure CORS proxy wrapper so browsers don't block the request!
    const aviationEndpoint = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${originIata}&arr_iata=${destinationIata}`;
    const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(aviationEndpoint)}`;

    try {
        const response = await axios.get(url);
        if (!response.data || !response.data.data) return [];

        // Map AviationStack format to our existing UI format
        return response.data.data.map(flight => {
            const formatTime = (timeString) => {
                if (!timeString) return 'N/A';
                const d = new Date(timeString);
                return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            };

            return {
                airline: flight.airline?.name || 'Unknown Airline',
                flightNumber: flight.flight?.iata || flight.flight?.number || 'N/A',
                departureTime: formatTime(flight.departure?.scheduled),
                arrivalTime: formatTime(flight.arrival?.scheduled),
                status: flight.flight_status ? (flight.flight_status.charAt(0).toUpperCase() + flight.flight_status.slice(1)) : 'Scheduled'
            };
        });
    } catch (error) {
        console.error("AviationStack error:", error);
        throw error;
    }
};
