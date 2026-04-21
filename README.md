# ✈️ AeroTrack
**AeroTrack** is a professional, full-stack flight routing and tracking application built natively for real-time global map visualizations. Engineered as a comprehensive end-term computing project, it elegantly bridges live aviation APIS, interactive mapping, and a scalable cloud database backend.

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
