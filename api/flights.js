export default async function handler(req, res) {
    // Extract query parameters passed from our React frontend
    const { dep, arr } = req.query;

    // Vercel Serverless Functions have access to the Environment Variables you glued into the Dashboard!
    const apiKey = process.env.VITE_AVIATIONSTACK_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing API Key in Vercel settings' });
    }

    // The Server makes the HTTP request natively (NodeJS ignores Mixed Content browser blocks)
    const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&dep_iata=${dep}&arr_iata=${arr}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch securely from AviationStack' });
    }
}
