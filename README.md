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


## 🏗 System Architecture

The application implements a decoupled, modern Serverless SaaS architecture.

### 1. Frontend Client (React + Vite)
*   **User Interface:** Designed entirely with Vanilla CSS utilizing premium 'Glassmorphism' principles for deep, floating widget design and responsiveness. Icons powered by `lucide-react`.
*   **Component Structure:** Implements a strict Left/Right dual-panel view (`Sidebar.jsx` and `HubPanel.jsx`) masking over a fixed, global `z-index: 0` map container. 
*   **Mapping:** Driven by `React-Leaflet` rendering dark-mode CARTO basemaps with custom CSS SVG nodes representing dynamically placed airport hubs.

### 2. Backend API & Serverless Proxy
*   **The Mixed-Content Problem:** *AviationStack's* free tier runs exclusively on `HTTP`. Modern browsers immediately block `HTTP` requests from secure `HTTPS` frontend deployments (like Vercel) due to Mixed Content policies.
*   **The Vercel Serverless Solution:** To bypass browser network blocking, AeroTrack employs a custom highly-secure Serverless Endpoint located in `/api/flights.js`. 
*   **Routing Logic:** When a user requests a flight, the React frontend pings the secure Vercel edge function. Vercel securely accesses the remote `HTTP` AviationStack payload in the backend, unwraps it, and fires it back down securely as `HTTPS` JSON to the React client window. 

### 3. Database & Authentication (Supabase / Postgres)
*   **Authentication:** `supabase-js` is deployed client-side to operate an overlay popup `AuthModal.jsx`. It natively wires into Supabase utilizing secure Email/Password cryptographic hashing and JSON Web Tokens (JWT) for magic session persistence.
*   **PostgreSQL Engine:** The user's active travel logs are logged across a rigid relational schema running entirely on PostgreSQL.
*   **Row-Level Security (RLS):** Supabase RLS ensures zero unauthorized access. Users are granted strict, non-bypassable generic policies dictating that `SELECT` and `INSERT` commands to the `search_history` tables forcefully match `auth.uid() = user_id`, completely compartmentalizing global user actions.

## 🚀 Environment Configuration

To clone and run AeroTrack locally, create a `.env` file at the root following the `.env.example` structure:

```env
VITE_AVIATIONSTACK_KEY=your_aviation_stack_key
VITE_SUPABASE_URL=https://your_project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

## 🛠 Tech Stack
*   **Core:** React, Vite, Node.js
*   **Maps:** Leaflet.js, React-Leaflet, CartoDB Maps
*   **Database:** Supabase, PostgreSQL
*   **Hosting:** Vercel Hosting & Vercel Edge Serverless Functions
*   **APIs:** AviationStack 

***Developed for Web Dev End-term Final Project by Abhishek Indradeo Singh***
