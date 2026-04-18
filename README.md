# ✈️ AeroTrack Pro

A fully interactive, premium real-time flight route tracking application built with React, Vite, and Leaflet. Powered by AviationStack's live Flight JSON REST API.

### 🌐 Live Demo
**[Click Here to open the live Application!](https://flight-tracker-git-main-abhi1818singhs-projects.vercel.app)**

---

## ✨ Features
- **Global Airport Autocomplete**: Natively fetches a massive JSON database of 28,000+ worldwide airports for split-second precision route searching.
- **Route Pathing**: Select an origin and destination to securely query the AviationStack API for active commercial flight schedules on that route.
- **Dynamic Animated Mapping**: Powered by `react-leaflet`. When searching for a route, the map automatically flies to bound the cities and plots a beautifully animated dotted path across the globe.
- **Glassmorphism UI**: Built purely with native CSS variables and modern aesthetic gradients, without heavy UI component blocks.
- **Vercel Serverless Backend**: Uses a custom Node.js `/api` Serverless Endpoint designed strictly for Vercel. This bypasses CORS mechanisms entirely and permanently prevents browser Mixed-Content blocking caused by HTTP API data fetching on an HTTPS frontend.

## 🚀 Running Locally

1. **Clone & Install**
   ```bash
   git clone https://github.com/Abhi1818Singh/Flight_Tracker.git
   cd Flight_Tracker
   npm install

2. Environment Variables Create a .env file in the root directory and add your free API key:
   ```bash
   VITE_AVIATIONSTACK_KEY=YOUR_FREE_API_KEY


3. Start the development Server

   ```bash
   npm run dev 


🛠️ Built With
React 18
Vite JS
Leaflet & React-Leaflet
Lucide-React (Icons)
Vercel Serverless Functions
AviationStack Free API


***Developed for Web Dev End-term Final Project by Abhishek Indradeo Singh***
