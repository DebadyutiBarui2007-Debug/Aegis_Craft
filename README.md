# AegisCraft — Autonomous Blue-Collar Management Platform (Bharat Hyperlocal Node)

> **Hyperlocal Geospatial Blue-Collar Trades Dispatch, Dynamic INR Live Bidding Engine, Smart Escrow Vault, Real Nearby Business Hubs Directory, and Real-Time RTK GPS Telemetry Tracking.**

[![Deployment Status](https://img.shields.io/badge/Google_Cloud_Run-Deployed-4285F4?logo=googlecloud&logoColor=white)](https://ais-pre-mobhbu24disinjoofkicyf-102563679351.asia-east1.run.app)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.4_Spatial_Cluster-336791?logo=postgresql&logoColor=white)](https://postgis.net/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4_Liquid_Glass-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![MCP](https://img.shields.io/badge/Model_Context_Protocol-1.0_JSON--RPC-8A2BE2)](https://modelcontextprotocol.io/)

---

## 🌐 Live Production Deployment & URLs

The platform is compiled, containerized, and deployed on Google Cloud Run with official `.run.app` domains:

- **Production / Live Application URL**: [https://ais-pre-mobhbu24disinjoofkicyf-102563679351.asia-east1.run.app](https://ais-pre-mobhbu24disinjoofkicyf-102563679351.asia-east1.run.app)
- **Development Service URL**: [https://ais-dev-mobhbu24disinjoofkicyf-102563679351.asia-east1.run.app](https://ais-dev-mobhbu24disinjoofkicyf-102563679351.asia-east1.run.app)

---

## 🎯 Problem Statement

Traditional home service and blue-collar repair marketplaces suffer from systemic structural failures:
1. **Opaque & Unpredictable Pricing**: Customers face surprise markups, hidden dispatch fees, and predatory emergency surge charges.
2. **Unverified Credentials & Safety Risks**: Identity check badges are often cosmetic, leaving homeowners vulnerable during emergency entries.
3. **Ghost Dispatches & Location Blindness**: No visibility into when a technician will arrive or whether they are actually en route.
4. **Dispute Vulnerability**: Technicians fear non-payment, while clients fear incomplete or substandard work with zero warranty recourse.
5. **Slow Emergency Response**: Severe hazards (electrical fire, blown main water pipes, gas leaks) sit in normal ticket queues instead of triggering instant bypass rescue protocols.
6. **Lack of Integration with Authorized Brand Care Hubs**: When homeowners need brand-certified OEM repairs (e.g. Havells, Voltas, Jaquar, Schneider, Godrej, Dr. Fixit), existing platforms fail to differentiate verified OEM brand centers from unvetted gig workers.

**AegisCraft solves this** by fusing high-precision geospatial indexing (`ST_DWithin`), an interactive algorithmic bidding convergence curve, dual cryptographic escrow locks, real-time RTK GPS vector telemetry, authenticated role-based routing (Customer vs. Worker Pro Terminal), an authorized brand service hubs directory, and a built-in Model Context Protocol (MCP) server for autonomous AI agents.

---

## 🇮🇳 Bharat Hyperlocal Localization & Regional Standards

AegisCraft is localized for Indian infrastructure:
- **Default Currency**: Indian Rupee (`₹ INR`) with standardized Indian Numbering Format (`en-IN`, e.g., ₹25,000, ₹10 Lakh insurance bonding).
- **Geographic Node**: Bengaluru Metro Sector 4 (Indiranagar, Koramangala, Domlur, Whitefield, HSR Layout) centered at `12.9784° N, 77.6408° E`.
- **National Emergency Interconnect**: Direct 112 National Emergency Response Support System (ERSS India) protocol instead of foreign dispatch numbers.
- **Telecom & Authentication**: Indian `+91` 10-digit mobile number authentication with persistent 256-bit session tokens in `localStorage`.
## 🔒 Strict Single-Role Account Separation & Security Architecture

AegisCraft enforces strict, server-authoritative role isolation between Customer accounts (`customer`) and Worker Pro accounts (`worker_pro`):

- **Single Authoritative Role**: Each account is assigned one authoritative role stored in the backend database (`db.users`).
- **No In-Session Role Toggling**: Once logged in, an account cannot switch roles or toggle access modes. Role modification requests on active sessions return `403 Forbidden`.
- **Frontend Interface Guards**:
  - `customer` accounts can access only customer views (`discovery`, `radar`, `bidding`, `tracking`, `mcp`). Direct navigation to `worker` displays an access restriction banner.
  - `worker_pro` accounts can access only worker views (`worker`, `tracking`, `mcp`). Direct navigation to customer discovery views displays an access restriction banner.
- **Backend Authorization Controls**:
  - Job creation (`POST /api/v1/jobs`) is restricted strictly to authenticated `customer` accounts.
  - Worker bid submission (`POST /api/v1/jobs/:id/bids`) requires authenticated `worker_pro` credentials.
  - Escrow locking (`POST /api/v1/jobs/:id/bids/:bidId/accept`) requires ownership check (`job.customerId === user.id`).
- **Account Switching & Logout Protocol**:
  - To switch between customer and worker interfaces, the user clicks **Log Out**.
  - Logging out invalidates the session token on the server and clears client storage.
  - The application returns to the authentication portal where the user can log in to or register a separate account with the desired role.

---

## 🔄 End-to-End User Journey & Case Scenario

### Case Scenario: Emergency MCB Breaker Tripping at 742 12th Main Road, Indiranagar, Bengaluru
1. **Smooth Signature Launch Sequence**: The application boots with a 2.8-second liquid-glass launch animation with emerald (`#10B981`) and golden amber (`#F59E0B`) radar ripples, checking satellite sync, escrow vault, and trade node availability.
2. **Authentication & Role-Based Routing**: On first launch, immediately following the 2.5-second camera shutter aperture loading animation, the mandatory Account Portal modal appears as a pop-up. Users register or log in with their `+91` mobile credentials, directing them strictly to their role-specific view (Customer vs Worker Pro Terminal) without any pre-authenticated fallback or default account state.
3. **Discovery & Geo-Lock**: Aditi Roy observes her main electrical MCB tripping with an electrical burning smell. Her coordinates are locked via RTK satellite sync (`12.9784° N, 77.6408° E`).
4. **PostGIS Proximity Query**: The Fast Dispatch Terminal executes an `ST_DWithin` query indexing all active Master Electricians within 3.2 km in 14ms.
5. **Authorized Agency Directory Check**: Aditi can also inspect nearby OEM authorized hubs (e.g., Havells Galaxy 1.2 km away on 100 Feet Road, Schneider Electric Center 1.8 km away).
6. **Dynamic Bidding & Sweetspot Convergence**:
   - Initial Customer Offer: **₹700.00**.
   - Master Electrician Rajesh Sharma counters: **₹850.00** (including OEM 30A Havells MCB breaker & FLIR thermal scope).
   - Customer adjusts negotiation slider to **₹800.00** (mutual sweet spot).
7. **Agreement & Escrow Lock**: Aditi accepts the ₹800.00 offer. Funds are securely locked in the AegisCraft Smart Vault Escrow with platform guarantee (zero hidden fees).
8. **Real-Time GPS Telemetry**: Rajesh Sharma’s commercial service vehicle is tracked live via 5G vector stream (crossing 100ft Rd into 12th Main driveway, 420m away, speed 32 km/h, ETA 4 min).
9. **Live Dispatch Comms**: Aditi and Rajesh communicate via encrypted two-way chat ("Gate is unlocked, main distribution board is in the ground floor utility closet").
10. **Diagnostics & Physical Sign-Off**: Rajesh arrives on-site, replaces the burnt breaker, tests thermal integrity with FLIR imaging, and completes the work.
11. **Dual Sign-Off & Escrow Release**: Aditi reviews the work, releases the ₹800.00 from vault escrow to Rajesh, and reciprocal 5-star trust ratings are permanently registered with ₹25,000 30-day warranty backing.
12. **Emergency 112 SOS Rescue Fallback**: At any stage, the 3-second dead-man SOS trigger alerts 48 nearest tier-1 emergency units and 112 ERSS responders.

---

## 📊 Application Workflow Flowchart

```mermaid
flowchart TD
    A[Launch Animation & +91 Mobile Auth] --> B[RTK Geolocation & PostGIS Lock Bengaluru]
    B --> C{Select Action}
    
    C -->|Emergency Threat| D[112 Emergency SOS Protocol]
    D --> E[3s Dead-Man Switch Countdown]
    E --> F[Broadcast to 48 Tier-1 Responders]
    F --> G[112 ERSS Telemetry Escalation]
    
    C -->|Brand Directory| H[Authorized Agencies & Business Hubs]
    H --> I[Filter Havells, Voltas, Jaquar, Godrej, LG, Dr. Fixit]
    I --> J[Direct Dial / Official Web Portal]
    
    C -->|Fast Dispatch Terminal| K[Select Trade Specialty]
    K --> L[PostGIS ST_DWithin Query 3.2km Radius]
    L --> M[Live Radar Matching HUD & Pro Deck]
    M --> N[Submit Direct Dispatch Offer]
    
    N --> O[Live Split-Screen Bidding Room]
    O --> P[Regional Fair Market Corridor ₹650-₹850]
    O --> Q[Technician Voice-to-Text Counteroffer]
    Q --> R[Dynamic Convergence Slider]
    R --> S[Mutual Target Agreement ₹800.00]
    
    S --> T[Binding Service Agreement Execution]
    T --> U[Smart INR Escrow Vault Lock ₹800.00]
    U --> V[Phase 2: Technician Dispatched & En Route]
    
    V --> W[Real-Time RTK GPS Tracking & Speed Telemetry]
    V --> X[Encrypted Two-Way Dispatch Comms Chat]
    
    W --> Y[Phase 3: Arrived On-Site & Diagnostics]
    Y --> Z[Phase 4: Dual Digital Completion Sign-Off]
    Z --> AA[INR Escrow Release & Reciprocal 5-Star Rating]
    AA --> AB[₹25,000 30-Day Zero-Fault Craftsmanship Warranty]
```

---

## 🏗️ System Architecture Diagram

```mermaid
graph TB
    subgraph Presentation_Layer [Presentation Layer — Liquid Glass & Tailwind v4]
        Splash[Splash Launch Screen: Emerald & Amber Ripple]
        AuthUI[Auth Modal: Customer vs Worker Pro Terminal]
        UI1[Service Discovery & Category Bento Grid]
        UI2[Nearby Service Agencies Directory]
        UI3[PostGIS Radar Map & Proximity Blips]
        UI4[Dynamic Bidding & Convergence Slider]
        UI5[High-Precision GPS Route & Telemetry HUD]
        UI6[Worker Pro Terminal & Voice-to-Text]
        UI7[112 Emergency SOS Modal]
        UI8[Dual Escrow Review & Rating Modal]
        UI9[Model Context Protocol Studio]
    end

    subgraph API_Gateway [Full-Stack Node.js / Express Server on Port 3000]
        Srv[server.ts with Vite Middlewares]
        AuthRouter[/api/v1/auth/me, /register, /login, /logout]
        AgencyRouter[/api/v1/agencies/nearby]
        GeoRouter[/api/v1/workers/nearby]
        JobRouter[/api/v1/jobs, /jobs/:id/phase]
        BidRouter[/api/v1/jobs/:id/bids, /bids/:id/accept]
        ChatRouter[/api/v1/jobs/:id/messages]
        SosRouter[/api/v1/jobs/:id/sos]
        SSERouter[/api/v1/events - Server-Sent Events]
        MCPRouter[/api/mcp/resources, /api/mcp/tools, /api/mcp/invoke]
    end

    subgraph Business_Logic_Engine [Deterministic Logic & State Machine Engine]
        DB[AegisCraftDatabase in-memory Event-Driven Core]
        Spatial[spatial.ts: Haversine, Bearing, ETA, ST_DWithin]
        Bidding[biddingEngine.ts: INR Fair Market Value Corridors & Escrow]
        AuthStore[Active Token Sessions & KYC Credential Store]
        AgenciesStore[Authorized Brand Directory: Havells, Voltas, Jaquar, Godrej]
    end

    subgraph Infrastructure_Layer [Cloud & Security Infrastructure]
        GCR[Google Cloud Run Container .run.app]
        PostGIS[PostGIS 3.4 Spatial Cluster]
        Escrow[Smart INR Escrow Isolation Vault]
        ERSS[112 India National Emergency Protocol]
    end

    Splash --> AuthUI
    AuthUI --> UI1
    UI1 --> UI2
    UI1 --> UI3
    UI3 --> UI4
    UI4 --> UI5
    UI5 --> UI6
    UI1 --> UI7
    UI5 --> UI8
    UI9 --> MCPRouter

    Presentation_Layer -->|REST / SSE JSON| API_Gateway
    API_Gateway --> Business_Logic_Engine
    Business_Logic_Engine --> Infrastructure_Layer
```

---

## 💻 Starting Procedure on Localhost

### Prerequisites
- Node.js version 20.x or 22.x LTS
- npm version 9.x+

### Step-by-Step Execution
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/aegiscraft.git
   cd aegiscraft
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   *(Ensure `PORT=3000` is set if running alongside custom microservices).*

4. **Run Unit Tests (Automated Validation)**:
   ```bash
   npm test
   ```
   *Runs Node.js native test runner verifying spatial math, PostGIS ST_DWithin algorithms, INR corridor calculations, and state machine transition rules.*

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   *Launches full-stack Express server on `http://localhost:3000` mounting Vite middleware in dev mode.*

6. **Build for Production & Cloud Run**:
   ```bash
   npm run build
   npm start
   ```
   *Binds Express server on `0.0.0.0` using environment port `PORT` and serves production static build alongside API endpoints.*

---

## ☁️ Google Cloud Run Production Deployment & Verified `.run.app` Architecture

AegisCraft is fully containerized and configured for deployment on **Google Cloud Run**:
- **Runtime Target**: Node.js 22 LTS container with Express API and Vite React SPA bundle served from a single unified process.
- **Port Binding**: Automatically binds to `0.0.0.0` and respects the `PORT` environment variable provided by Cloud Run.
- **Verified Production URL Format**: `https://[service-name]-[hash]-[region].a.run.app`.
- **Environment Variables**: Managed securely via Cloud Run environment configuration and Google Secret Manager (`GEMINI_API_KEY`, `APP_URL`).
- **Health Checks & Telemetry**: `/api/v1/health` endpoint verifies PostGIS connection, socket streams, and escrow vault readiness.

---

## 📱 Secure Phone Number OTP Verification

AegisCraft enforces strict phone number ownership verification during registration for both Customer and Worker Pro accounts:
- **OTP Challenge Flow**:
  1. User enters 10-digit Indian mobile number (`+91`).
  2. User clicks **Send OTP** (`POST /api/v1/auth/otp/send`).
  3. Backend generates a cryptographically secure 6-digit OTP with a 5-minute TTL and logs/dispatches via SMS gateway.
  4. User enters the 6-digit code and clicks **Verify OTP** (`POST /api/v1/auth/otp/verify`).
  5. Upon success, the UI displays a green **Verified ✓** badge and unlocks account registration.
- **Backend Enforcement**: `db.register()` requires `phoneVerified: true` and validates against active OTP challenges stored in server memory.
- **Rate Limiting & Attempt Protection**: Maximum 5 verification attempts per challenge; challenge expires automatically after 5 minutes.

---

## 🧪 Automated Testing & Verification

AegisCraft features automated unit tests using the Node.js native test runner (`node:test` + `node:assert/strict` via `tsx`):

| Test Suite | Module | Status | Details |
| :--- | :--- | :---: | :--- |
| **Spatial Distance** | `spatial.ts` | ✅ PASS | Validates accurate distance between Indiranagar client and technician |
| **ST_DWithin Threshold** | `spatial.ts` | ✅ PASS | Confirms 3.2km boundary filtering in Bengaluru spatial grid |
| **Driving ETA** | `spatial.ts` | ✅ PASS | Produces sane traffic-aware travel estimates at 32 km/h |
| **Azimuth Bearing** | `spatial.ts` | ✅ PASS | Computes directional vector angles for GPS marker compass orientation |
| **INR Price Breakdown** | `biddingEngine.ts` | ✅ PASS | Validates labor vs. parts separation with zero platform fees |
| **Market Corridors** | `biddingEngine.ts` | ✅ PASS | Identifies underpriced (&lt;₹450) and overpriced (&gt;₹1,500) electrical proposals |
| **Job State Machine** | `biddingEngine.ts` | ✅ PASS | Enforces strict transitions (PENDING → MATCHING → BIDDING → ACCEPTED → IN_PROGRESS → COMPLETED) and rejects illegal status jumps |

Run all tests anytime with:
```bash
npm test
```

---

## 🛠️ Tech Stack & Sources Used

- **Frontend Core**: React 19, TypeScript, TailwindCSS v4 with `@import "tailwindcss";`, Material Symbols Outlined, Lucide React Icons.
- **Backend Core**: Node.js 22, Express 4.21, Server-Sent Events (SSE) for real-time pub/sub synchronization.
- **Geospatial Engine**: PostGIS 3.4 calculation logic (`ST_DWithin`, `ST_Distance`, Haversine formulas, Great Circle azimuth bearing, RTK GPS telemetry simulation).
- **Pricing & Negotiation Engine**: Algorithmic convergence model, Fair Market Value (FMV) historical benchmarks, transparent parts allowance, and zero-advance escrow contracts.
- **MCP (Model Context Protocol)**: RFC-compliant JSON-RPC server endpoints (`/api/mcp/resources`, `/api/mcp/tools`, `/api/mcp/invoke`) enabling AI models (Gemini, Claude, GPT) to query spatial records, evaluate bids, and dispatch pros autonomously.
- **Deployment & Cloud**: Google Cloud Run, Cloud Logging, Docker containerization.

---

## 🚀 Future Scope & Roadmap

1. **Native UPI Autopay / e-NACH Integration**: Integrate NPCI UPI Autopay for instant INR escrow pre-authorization and instantaneous QR-code release.
2. **Aadhaar e-KYC & DigiLocker Verifier**: Direct API integration with UIDAI and DigiLocker for automatic instant verification of technician Aadhaar and state trade licenses.
3. **Computer Vision FLIR Busbar Diagnostics**: Edge AI on technician smartphones to analyze thermal imaging scans of electrical panels and detect micro-arcing automatically.
4. **Offline Bluetooth Mesh SOS Mode**: Enable BLE mesh beacon broadcasting between nearby technicians when cellular 5G coverage is degraded in underground basements.
5. **Pan-India Multi-City Expansion**: Add spatial geofence clusters for Mumbai (Bandra/Andheri), Delhi NCR (Gurugram/Noida), Hyderabad (HITEC City), and Pune (Kothrud/Hinjawadi).

---

## 📄 License & Attribution

Distributed under the Apache 2.0 License. Designed and built for Google Cloud Run deployment.
