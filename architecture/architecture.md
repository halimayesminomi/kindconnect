# KindConnect: Software Architecture & Technical System Specification

---

## Document Metadata

| Field | Description |
| :--- | :--- |
| Project Title | KindConnect: A Modern Full-Stack Community Engagement & Grassroots Volunteer Management Platform |
| Academic Course | Web Programming Lab (Course Code: CSE 323) |
| Academic Institution | Department of Computer Science & Engineering, Metropolitan University, Sylhet |
| Course Instructor | Mr. Abu Jafar Md. Jakaria, Lecturer, Department of Computer Science & Engineering |
| Lead Builder & Admin | Halima Yesmin Omi (Student ID: 251-112-001) — Platform Admin & Full-Stack Architect |
| Co-Developer & QA | Shraboni Das (Student ID: 251-112-006) — Quality Assurance Specialist |
| Academic Cohort | 36th (Evening) Batch, Department of CSE |
| Date of Documentation | November 2026 |
| Version | Production Release v2.0.0 |
| Source Repository | [github.com/halimayesminomi/kindconnect](https://github.com/halimayesminomi/kindconnect.git) |
| Live Production URL | [kindconnect-7hc1.vercel.app](https://kindconnect-7hc1.vercel.app) |

---

## Table of Contents

- [1. Architectural Overview & Design Principles](#1-architectural-overview--design-principles)
  - [1.1 System Vision & Architectural Context](#11-system-vision--architectural-context)
  - [1.2 Foundational Architectural Principles](#12-foundational-architectural-principles)
- [2. 4-Tier Client-Server Architectural Pattern](#2-4-tier-client-server-architectural-pattern)
  - [2.1 High-Level Architecture Topology](#21-high-level-architecture-topology)
  - [2.2 Tier-by-Tier Architectural Responsibilities](#22-tier-by-tier-architectural-responsibilities)
  - [2.3 Technology Stack Selection & Rationale](#23-technology-stack-selection--rationale)
- [3. Subsystem & Component Architecture](#3-subsystem--component-architecture)
  - [3.1 Anti-Fraud Identity & Authentication Hub](#31-anti-fraud-identity--authentication-hub)
  - [3.2 Event Lifecycle & Cryptographic Attendance Engine](#32-event-lifecycle--cryptographic-attendance-engine)
  - [3.3 1,000-Point Honor Gamification & Certification Engine](#33-1000-point-honor-gamification--certification-engine)
  - [3.4 Citizen Emergency Relief Hub](#34-citizen-emergency-relief-hub)
  - [3.5 Two-Tier Real-Time Chat & Acoustic Audio Engine](#35-two-tier-real-time-chat--acoustic-audio-engine)
  - [3.6 Platform Administrative Governance Center](#36-platform-administrative-governance-center)
  - [3.7 Dual-Theming & Bilingual Internationalization (i18n) Engine](#37-dual-theming--bilingual-internationalization-i18n-engine)
- [4. Data Architecture & Database Design](#4-data-architecture--database-design)
  - [4.1 Database Design Philosophy](#41-database-design-philosophy)
  - [4.2 Comprehensive Entity-Relationship Schemas](#42-comprehensive-entity-relationship-schemas)
  - [4.3 BSON Polymorphism & The `toIdVariants()` Invariant](#43-bson-polymorphism--the-toidvariants-invariant)
  - [4.4 Cloud Connection Pooling Strategy](#44-cloud-connection-pooling-strategy)
- [5. API Architecture & Serverless Gateway Design](#5-api-architecture--serverless-gateway-design)
  - [5.1 Unified Catch-All REST Gateway Pattern](#51-unified-catch-all-rest-gateway-pattern)
  - [5.2 REST API Routing & Endpoint Specifications](#52-rest-api-routing--endpoint-specifications)
- [6. Cross-Cutting Concerns & Security Architecture](#6-cross-cutting-concerns--security-architecture)
  - [6.1 Defense-in-Depth Security Model](#61-defense-in-depth-security-model)
  - [6.2 Client-Side Exception Resilience & Hydration Safety](#62-client-side-exception-resilience--hydration-safety)
  - [6.3 Client-Side Image Compression Architecture](#63-client-side-image-compression-architecture)
  - [6.4 Vector-Sharp Clean Print Architecture](#64-vector-sharp-clean-print-architecture)
- [7. Deployment Topology & Cloud Infrastructure](#7-deployment-topology--cloud-infrastructure)
  - [7.1 Cloud Hosting Topology](#71-cloud-hosting-topology)
  - [7.2 Continuous Integration & Continuous Deployment (CI/CD)](#72-continuous-integration--continuous-deployment-cicd)

---

## 1. Architectural Overview & Design Principles

### 1.1 System Vision & Architectural Context

KindConnect is engineered as an enterprise-grade, cloud-native digital ecosystem bridging grassroots volunteers, community organizers, citizens in distress, and academic evaluators into an auditable web framework. Developed for the Web Programming Lab (CSE 323) at Metropolitan University, Sylhet, the platform addresses critical communication and coordination failures in local community service across Bangladesh (such as flood relief in Sylhet, winter blanket distribution, and urgent blood donor mobilization).

The platform replaces fragmented social media coordination with real-time event discovery, anti-fraud Google identity verification, cryptographic venue attendance tracking, a 1,000-point gamified milestone honors system, auto-generated institutional certificates with live QR verification, bidirectional multi-channel real-time chat, and administrative governance.

### 1.2 Foundational Architectural Principles

KindConnect adheres to six core software engineering design principles:

1. **High Cohesion, Loose Coupling:** Subsystems (Authentication, Events, Attendance, Messaging, Relief) function through distinct data models and modular route controllers while sharing an integrated persistence layer.
2. **Serverless Edge Performance:** Presentation and API execution run on Vercel's global edge network, minimizing infrastructure overhead and cold-start latency.
3. **Defense-in-Depth Security:** Every incoming mutation undergoes multi-stage verification: algorithmic regex filtering, Google GIS OAuth token verification, Bcrypt password encryption, stateless JWT validation, and Role-Based Access Control (RBAC).
4. **Data Isolation & Multi-Tenancy:** Direct support communications are strictly partitioned via deterministic compound keys, guaranteeing absolute privacy across accounts.
5. **Universal Accessibility (WCAG AAA):** High-contrast color palettes and instant bilingual (English ↔ বাংলা) toggles ensure inclusive usability across daytime, nighttime, and multilingual contexts.
6. **Graceful Fault Tolerance:** Client components feature hydration state guards, React `<Suspense>` boundaries, and local fallback data stores to prevent unhandled runtime exceptions.

---

## 2. 4-Tier Client-Server Architectural Pattern

### 2.1 High-Level Architecture Topology

KindConnect follows a robust 4-Tier Client-Server Architecture:

```text
+-----------------------------------------------------------------------------------------+
|                        TIER 1: PRESENTATION & INTERACTION LAYER                         |
|  - Next.js 15 App Router | React 19 Client Components                                   |
|  - Tailwind CSS UI Framework | Lucide Vector Icons                                      |
|  - HTML5 Web Audio API Synthesizer (587 Hz -> 880 Hz Sine Chime)                        |
|  - HTML5 Canvas Base64 Client-Side Image Compression                                    |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v  HTTPS / REST JSON / OAuth 2.0 Bearer
+-----------------------------------------------------------------------------------------+
|                  TIER 2: EXTERNAL SECURITY & GEO-SPATIAL GATEWAY LAYER                  |
|  - Google Identity Services (GIS) OAuth 2.0 UserInfo API Gateway                        |
|  - OpenStreetMap Nominatim Geo-Coding Tile Servers                                      |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v  Serverless Request Context / Token Verify
+-----------------------------------------------------------------------------------------+
|                   TIER 3: APPLICATION LOGIC & REST API GATEWAY LAYER                    |
|  - Next.js Serverless Route Controller (/api/[...route]/route.js)                       |
|  - Stateless JWT Session Lifecycle & Role-Based Access Control (RBAC)                   |
|  - Bcrypt Key Derivation (Salt Work Factor: 10)                                         |
|  - In-Memory Regex Engine (60+ Disposable Burner Domain Blocklist)                      |
+-----------------------------------------------------------------------------------------+
                                           |
                                           v  Mongoose 8.x Connection Pool / BSON Queries
+-----------------------------------------------------------------------------------------+
|                         TIER 4: CLOUD DATA PERSISTENCE LAYER                            |
|  - MongoDB Atlas Cloud Cluster                                                          |
|  - Collections: users, events, registrations, attendance, messages, emergencyrequests   |
+-----------------------------------------------------------------------------------------+
```

### 2.2 Tier-by-Tier Architectural Responsibilities

#### Tier 1: Presentation & Interaction Layer
* **Role:** Delivers responsive, high-performance UI across desktop and mobile browsers.
* **Key Components:**
  * Next.js 15 App Router providing static optimization and client-side page transitions.
  * React 19 client components managing local state, modals, and dynamic filtering.
  * Tailwind CSS delivering responsive utility classes and WCAG AAA compliant Dark/Light mode theming.
  * HTML5 Web Audio API synthesizer generating real-time acoustic notifications directly in the browser.
  * HTML5 Canvas API compressing mobile gallery photo uploads to lightweight Base64 strings client-side.

#### Tier 2: External Security & Geo-Spatial Gateway Layer
* **Role:** Interfaces with authoritative external cloud providers for identity and location verification.
* **Key Components:**
  * Google Identity Services (GIS) OAuth 2.0 endpoint validating incoming bearer tokens against Google's UserInfo API to prevent disposable email registrations.
  * OpenStreetMap Nominatim servers delivering map tile rendering and location coordinates for community events.

#### Tier 3: Application Logic & REST API Gateway Layer
* **Role:** Executes business logic, authorization policies, and database transactions.
* **Key Components:**
  * Unified Serverless Catch-All API Controller (`src/app/api/[...route]/route.js`) handling over 20 REST endpoints.
  * Stateless JWT authentication middleware verifying signatures and extracting user claims (`id`, `email`, `role`).
  * In-memory regex engine screening incoming emails against a blocklist of 60+ disposable burner domains.
  * Bcrypt password encryption engine hashing credentials with a cost factor of 10.

#### Tier 4: Cloud Data Persistence Layer
* **Role:** Manages persistent, multi-tenant document storage with cloud replication.
* **Key Components:**
  * MongoDB Atlas distributed database cluster.
  * Mongoose 8.x Object Data Modeling (ODM) layer enforcing schema validation, compound indexing, and lifecycle hooks.
  * Adaptive connection pooling maintaining persistent database handles across serverless invocations.

### 2.3 Technology Stack Selection & Rationale

| Architecture Layer | Technology | Version | Architectural Justification |
| :--- | :--- | :--- | :--- |
| Frontend Framework | Next.js (App Router) | `15.5.28` | Combines server-side rendering, static pre-rendering, and serverless routing within a single codebase. |
| UI Library | React | `19.0.0` | Latest concurrent rendering primitives, action hooks, and optimized component lifecycles. |
| Styling Framework | Tailwind CSS | `3.4.x` | Zero-runtime CSS footprint, seamless dark/light theme switching, and responsive design. |
| Vector Iconography | Lucide React | `0.4x` | Tree-shakable SVG vector icons with zero layout shift. |
| Persistence ODM | Mongoose | `8.x` | Strongly typed document schemas, pre/post middleware hooks, and compound unique indexing. |
| Cloud Database | MongoDB Atlas | Cloud Cluster | Multi-region distributed BSON document store ensuring high availability and scalable read/write. |
| Credential Hashing | Bcrypt.js | `2.4.x` | Industry-standard salted key derivation preventing rainbow table attacks. |
| Session Security | JSON Web Tokens | `9.x` | Stateless, tamper-resistant authorization tokens across serverless function invocations. |
| Identity Verification | Google GIS OAuth | 2.0 | Authoritative identity verification directly via Google servers to eliminate burner emails. |
| Audio Engine | HTML5 Web Audio API | Native Browser | In-browser synthesizer producing clean audio chimes without external asset download latency. |
| Cloud Deployment | Vercel Platform | Edge Network | Git-driven automated CI/CD pipeline deploying to edge servers with automatic SSL and zero downtime. |

---

## 3. Subsystem & Component Architecture

### 3.1 Anti-Fraud Identity & Authentication Hub

The Anti-Fraud Authentication Subsystem protects platform integrity through a three-stage validation pipeline:

```text
[ Registration Request (Name, Email, Password, Google Token) ]
                           |
                           v
              [ Stage 1: Burner Domain Filter ]
    Is domain in 60+ disposable blocklist? ---> YES ---> [ 400 Bad Request: Disposable Prohibited ]
                           | NO
                           v
             [ Stage 2: Google GIS Verification ]
    Query Google UserInfo API with Bearer Token.
    Does Google verified email match input? ---> NO ---> [ 401 Unauthorized: Identity Mismatch ]
                           | YES
                           v
             [ Stage 3: Bcrypt Salted Key Derivation ]
    Hash password with salt (factor: 10).
    Create User record with role: 'user'.
                           |
                           v
               [ Issue Signed 7-Day JWT Token ]
```

#### RBAC State Machine
Users belong to one of three strictly enforced roles:
* `user`: Standard volunteer authorized for event discovery, QR attendance, certificate generation, and direct support.
* `organizer`: Verified community coordinator authorized to publish, update, and manage local events.
* `admin`: Platform Administrator (**Halima Yesmin Omi**) possessing universal moderation, user inspection, and role promotion privileges.

---

### 3.2 Event Lifecycle & Cryptographic Attendance Engine

#### Event State Machine
An event progresses through three discrete lifecycle states:

```text
[ Upcoming ] ---> Capacity decrements on RSVP ---> [ Ongoing ] ---> Venue QR check-in ---> [ Completed ]
```

#### Cryptographic QR Attendance Verification
To prevent attendance fraud, organizers project a dynamic 6-character cryptographic check-in code formatted as:
```text
KC-[EVENT_HASH_4]-[YYYYMMDD]  (e.g., KC-A4B1-20261121)
```

When scanned or submitted by a registered volunteer:
1. The server confirms the requesting user holds an active `Registration` for the event.
2. Checks whether an `Attendance` record already exists for this `(eventId, userId)` pair.
3. Creates a permanent `Attendance` document, attributes **+100 impact points**, and increments verified volunteer hours by **+3 hours**.

---

### 3.3 1,000-Point Honor Gamification & Certification Engine

Volunteers accumulate points through verified event attendance and community relief activities. Upon achieving the **1,000-Point Honor Milestone**:

```text
[ User Points >= 1000 ]
           |
           v
[ Presidential Milestone Certificate of Social Excellence Unlocked ]
           |
           +---> 1. Dynamic Binding: Candidate Name, Academic Designation, Date
           |
           +---> 2. Alphanumeric Credential ID: KC-HONOR-[NAME_4]-[USER_ID_6]-[YEAR]
           |
           +---> 3. Live Smartphone-Scannable QR Verification Code
           |
           +---> 4. Dual Signatures: Course Instructor Mr. Jakaria & Admin Halima Yesmin Omi
           |
           +---> 5. CSS @media print Stylesheet (Browser Header & Timestamp Suppression)
```

---

### 3.4 Citizen Emergency Relief Hub

The Emergency Relief Subsystem (`/emergency`) provides an intake and dispatch portal for acute humanitarian crises:
* **Urgency Stratification:** Requests are categorized into `Critical` (immediate blood transfusions, boat rescue), `High` (post-flood rations), and `Medium` (winter clothing).
* **Direct Responder Telephony:** Volunteers click "Join Relief Team" to register as responders. The interface creates an immediate one-click telephonic dialer link directly connecting the volunteer to the on-site patient or relief coordinator.

---

### 3.5 Two-Tier Real-Time Chat & Acoustic Audio Engine

KindConnect implements a multi-channel messaging architecture:

```text
+-----------------------------------------------------------------------------------------+
|                                 TWO-TIER CHAT ARCHITECTURE                              |
+-----------------------------------------------------------------------------------------+
|  TIER A: Event-Specific Volunteer Group Rooms                                           |
|  - Channel: /dashboard/chat?event=[eventId]                                             |
|  - Authorization: Strict database verification. Only confirmed registered attendees,    |
|    the event organizer, and platform admins can read or transmit messages.              |
+-----------------------------------------------------------------------------------------+
|  TIER B: 1-on-1 Direct Support with Platform Admin                                      |
|  - Channel: /dashboard/chat?admin=true                                                  |
|  - Authorization: Strictly isolated between the authenticated volunteer and Admin Omi   |
|    (omi@kindconnect.org) via deterministic compound keys: [user, admin].sort().join("_")|
+-----------------------------------------------------------------------------------------+
```

#### Acoustic Audio Synthesizer Architecture
Incoming messages trigger an in-browser sine-wave chime using the HTML5 Web Audio API:
```javascript
// Web Audio API pure tone synthesizer
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const osc = ctx.createOscillator();
const gain = ctx.createGain();

osc.type = "sine";
osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 tone
osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5 tone
gain.gain.setValueAtTime(0.18, ctx.currentTime);
gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

osc.connect(gain);
gain.connect(ctx.destination);
osc.start();
osc.stop(ctx.currentTime + 0.35);
```
This architecture provides immediate acoustic feedback with zero network latency and no external audio file dependencies.

---

### 3.6 Platform Administrative Governance Center

The Administrative Governance Subsystem (`/admin`) is restricted to Platform Administrator **Halima Yesmin Omi** (`omi` / `Omi@2026`).

#### Administrative Architecture Capabilities
* **Deep User Profile Inspection Modal:** Administrators can inspect any registered volunteer's full profile, participation history, verified points, email, phone number, and account creation timestamp with a single click.
* **Dynamic Role Promotion & Demotion:** Administrators can adjust user roles between `user` and `organizer` with instantaneous database synchronization.
* **Flagged Content Moderation:** Direct verification, approval, or deletion of citizen emergency appeals and newly submitted volunteer initiatives.

---

### 3.7 Dual-Theming & Bilingual Internationalization (i18n) Engine

* **CSS Custom Property Theming:** Themes are implemented via root CSS custom properties toggled by a `data-theme="dark"` or `data-theme="light"` HTML attribute.
* **WCAG AAA Compliance:** High-contrast text palettes ensure full readability under direct sunlight and dark environments.
* **Client-Side Internationalization:** A lightweight, reactive localization dictionary provides 1-click instantaneous toggling between English and Bengali (বাংলা) across all routes without reloading the page.

---

## 4. Data Architecture & Database Design

### 4.1 Database Design Philosophy

KindConnect utilizes MongoDB Atlas cloud clustering managed through Mongoose 8.x ODM. Document schemas are normalized for core transactional consistency (registrations, attendance, credentials) while embedding denormalized display metadata (user names, avatars, titles) to minimize multi-document joins.

---

### 4.2 Comprehensive Entity-Relationship Schemas

#### 1. `users` Collection Schema
```javascript
{
  _id: ObjectId,
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Bcrypt salted hash
  role: { type: String, enum: ["user", "organizer", "admin"], default: "user" },
  points: { type: Number, default: 150 },
  hoursVolunteered: { type: Number, default: 2 },
  phone: { type: String, default: "" },
  photoURL: { type: String, default: "" },
  designation: { type: String, default: "Active Volunteer" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

#### 2. `events` Collection Schema
```javascript
{
  _id: ObjectId,
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: "" },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, default: "10:00 AM - 01:00 PM" },
  capacity: { type: Number, default: 50 },
  volunteersCount: { type: Number, default: 0 },
  creatorEmail: { type: String, required: true },
  creatorName: { type: String, default: "KindConnect Organizer" },
  status: { type: String, enum: ["published", "completed", "cancelled"], default: "published" },
  createdAt: { type: Date, default: Date.now }
}
```

#### 3. `registrations` Collection Schema
```javascript
{
  _id: ObjectId,
  eventId: { type: ObjectId, ref: "Event", required: true },
  userId: { type: ObjectId, ref: "User", required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  status: { type: String, enum: ["confirmed", "waitlist", "cancelled"], default: "confirmed" },
  registeredAt: { type: Date, default: Date.now }
}
// Compound unique index: { eventId: 1, userId: 1 } (Prevents duplicate RSVP)
```

#### 4. `attendance` Collection Schema
```javascript
{
  _id: ObjectId,
  eventId: { type: ObjectId, ref: "Event", required: true },
  userId: { type: ObjectId, ref: "User", required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  pointsAwarded: { type: Number, default: 100 },
  checkedInAt: { type: Date, default: Date.now }
}
// Compound unique index: { eventId: 1, userId: 1 } (Prevents duplicate check-in)
```

#### 5. `messages` Collection Schema
```javascript
{
  _id: ObjectId,
  type: { type: String, enum: ["direct", "event_group"], required: true },
  conversationId: { type: String, index: true }, // [senderId, recipientId].sort().join("_")
  eventId: { type: String, index: true },        // Populated for event_group messages
  sender: { type: ObjectId, ref: "User", required: true },
  senderName: { type: String, required: true },
  senderUsername: { type: String },
  senderRole: { type: String, default: "user" },
  senderDesignation: { type: String },
  senderPhoto: { type: String, default: "" },
  recipient: { type: ObjectId, ref: "User" },     // Populated for direct messages
  recipientName: { type: String },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  readBy: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
}
```

#### 6. `emergencyrequests` Collection Schema
```javascript
{
  _id: ObjectId,
  title: { type: String, required: true },
  category: { type: String, required: true },
  urgency: { type: String, enum: ["Critical", "High", "Medium"], default: "High" },
  location: { type: String, required: true },
  contactPhone: { type: String, required: true },
  description: { type: String, required: true },
  requesterName: { type: String, required: true },
  requesterEmail: { type: String, required: true },
  volunteersJoined: { type: Number, default: 0 },
  status: { type: String, enum: ["open", "in_progress", "resolved"], default: "open" },
  responders: [{
    userId: { type: ObjectId, ref: "User" },
    name: String,
    email: String,
    phone: String,
    message: String,
    respondedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
}
```

---

### 4.3 BSON Polymorphism & The `toIdVariants()` Invariant

#### The Architectural Challenge
In MongoDB and Mongoose, document identifiers exist polymorphically as both 24-character hexadecimal strings (`"6ae78656..."`) and binary BSON `mongoose.Types.ObjectId` instances. In loose queries, string comparisons fail against indexed `ObjectId` fields, causing critical data omissions.

#### The Architectural Solution
Every subsystem queries identifiers using the `toIdVariants()` utility:

```javascript
function toIdVariants(id) {
  if (!id) return [];
  const str = id.toString();
  const variants = [str];
  if (mongoose.Types.ObjectId.isValid(str)) {
    try {
      variants.push(new mongoose.Types.ObjectId(str));
    } catch (_) {}
  }
  return variants;
}
```

By querying with `$in: toIdVariants(targetId)`, the application guarantees 100% type-safe query matching regardless of whether the identifier originated from a JSON payload, URL query parameter, or Mongoose reference.

---

### 4.4 Cloud Connection Pooling Strategy

Serverless functions instantiate on demand, which can exhaust MongoDB connection limits if new connections are created on every request. KindConnect implements a persistent connection cache:

```javascript
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  cachedConnection = await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
  return cachedConnection;
}
```
This guarantees that concurrent invocations reuse existing socket handles, keeping cloud database connection counts well within Atlas limits.

---

## 5. API Architecture & Serverless Gateway Design

### 5.1 Unified Catch-All REST Gateway Pattern

KindConnect utilizes Next.js 15 App Router's dynamic catch-all route architecture located at:
```text
src/app/api/[...route]/route.js
```
This pattern provides the flexibility of an Express.js controller while operating natively within Vercel's serverless runtime. Incoming requests are parsed by method (`GET`, `POST`, `PATCH`, `DELETE`) and dispatched based on path segment arrays (`params.route`).

---

### 5.2 REST API Routing & Endpoint Specifications

| Endpoint Path | HTTP Method | Authorization | Request Body / Parameters | Success Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public (GIS) | `{ name, email, password, googleToken }` | `201 Created` + JWT Token + User Object |
| `/api/auth/login` | `POST` | Public | `{ email, password }` | `200 OK` + JWT Token + User Object |
| `/api/auth/google` | `POST` | Public (GIS) | `{ userInfo, googleToken }` | `200 OK` + JWT Token + User Object |
| `/api/events` | `GET` | Public | Query: `?category=&search=` | `200 OK` + Event List Array |
| `/api/events` | `POST` | Organizer | `{ title, description, category, date, capacity }` | `201 Created` + Event Object |
| `/api/events/[id]` | `GET` | Public | Path Parameter: `[id]` | `200 OK` + Event Object |
| `/api/events/[id]` | `PATCH` | Organizer / Admin | `{ title, description, capacity, ... }` | `200 OK` + Updated Event Object |
| `/api/events/[id]` | `DELETE`| Organizer / Admin | Path Parameter: `[id]` | `200 OK` + Success Message |
| `/api/registrations` | `POST` | Authenticated | `{ eventId }` | `201 Created` + Registration Record |
| `/api/attendance/check-in`| `POST` | Authenticated | `{ eventId, code }` | `200 OK` + Updated User Points (+100) |
| `/api/emergency` | `GET` | Public | Query: `?category=&urgency=` | `200 OK` + Emergency Requests List |
| `/api/emergency` | `POST` | Public / Auth | `{ title, category, location, phone, description }`| `201 Created` + Emergency Record |
| `/api/emergency/[id]/respond` | `POST` | Authenticated | `{ name, email, phone, message }` | `200 OK` + Updated Responder List |
| `/api/chat/my-events` | `GET` | Authenticated | Header: `Authorization: Bearer <token>` | `200 OK` + Enrolled Event Channels |
| `/api/chat/events/[id]/messages`| `GET` | Enrolled Member | Path: `[id]` (Event ID) | `200 OK` + Group Messages Array |
| `/api/chat/events/[id]/messages`| `POST`| Enrolled Member | `{ text }` | `201 Created` + New Group Message |
| `/api/chat/direct/admin` | `GET` | Authenticated | Header: `Authorization: Bearer <token>` | `200 OK` + Isolated Direct Messages |
| `/api/chat/direct/admin` | `POST`| Authenticated | `{ text }` | `201 Created` + New Direct Message |
| `/api/admin/users` | `GET` | Platform Admin | Header: `Authorization: Bearer <token>` | `200 OK` + Full User Database List |
| `/api/admin/users/[id]` | `PATCH` | Platform Admin | `{ role: "organizer" / "user" }` | `200 OK` + Updated User Record |

---

## 6. Cross-Cutting Concerns & Security Architecture

### 6.1 Defense-in-Depth Security Model

KindConnect enforces security across multiple architectural layers:

```text
[ Incoming Request ]
         |
         v
[ Layer 1: Network & Origin Shield ]
  - Vercel Edge DDoS mitigation and SSL termination
         |
         v
[ Layer 2: Disposable Domain Engine ]
  - Regex screening against 60+ burner email providers
         |
         v
[ Layer 3: Google Identity Verification ]
  - Real-time OAuth bearer token check with Google UserInfo API
         |
         v
[ Layer 4: Stateless Cryptographic JWT Guard ]
  - Verification of signature, expiration (7 days), and claims
         |
         v
[ Layer 5: Role-Based Authorization Guard ]
  - Enforced RBAC check: 'admin' required for governance routes
         |
         v
[ Layer 6: Data Isolation & BSON Verification ]
  - Compound conversation hashing and toIdVariants() query expansion
         |
         v
[ Layer 7: Salted Hash Persistence ]
  - Bcrypt (Cost: 10) encryption protecting stored credentials
```

---

### 6.2 Client-Side Exception Resilience & Hydration Safety

Next.js 15 App Router performs strict hydration consistency checks between server-rendered HTML and client-rendered DOM.

#### Hydration Safety Invariant
To prevent `Application error: a client-side exception has occurred`:
1. **Mounting State Guards:** Components accessing client-only APIs (`window`, `localStorage`, `AudioContext`) are gated by a `mounted` boolean hook state:
   ```javascript
   const [mounted, setMounted] = useState(false);
   useEffect(() => { setMounted(true); }, []);
   if (!mounted) return null; // Prevents SSR/CSR DOM structural mismatch
   ```
2. **React `<Suspense>` Enclosures:** All pages consuming dynamic search parameters (`useSearchParams()`) are wrapped inside `<Suspense>` boundaries.
3. **Locale-Invariant Date Formatting:** Date strings are parsed using fixed ISO formats to prevent discrepancies between server UTC and client BST timezones.

---

### 6.3 Client-Side Image Compression Architecture

To eliminate expensive cloud blob storage dependencies (such as AWS S3 or Cloudinary) and prevent payload limits on serverless endpoints, profile image uploads are processed client-side:

```text
[ User Selects Image from Gallery / File Picker ]
                       |
                       v
[ HTML5 FileAPI Reads File into Memory ]
                       |
                       v
[ Image Loaded onto HTML5 Off-Screen Canvas ]
                       |
                       v
[ Canvas Resizes Image to Max 400x400 Pixels ]
                       |
                       v
[ Canvas Compresses Image into Lightweight Base64 JPEG ]
                       |
                       v
[ Base64 String Transmitted via Standard JSON Payload ]
```
This architecture delivers instant image uploads from mobile galleries while maintaining payloads under 50 KB.

---

### 6.4 Vector-Sharp Clean Print Architecture

When printing or saving certificates as PDF, standard browsers inject unwanted headers, footers, timestamps, and page URLs. KindConnect incorporates a dedicated print engine:

```css
@media print {
  @page {
    margin: 0;
    size: landscape;
  }
  body {
    visibility: hidden;
    background: transparent !important;
  }
  #printable-certificate {
    visibility: visible;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    margin: 0;
    padding: 0;
    box-shadow: none !important;
  }
  header, footer, nav, aside, .no-print {
    display: none !important;
  }
}
```
This isolates the `#printable-certificate` container, rendering crisp, vector-sharp institutional certificates without browser header clutter.

---

## 7. Deployment Topology & Cloud Infrastructure

### 7.1 Cloud Hosting Topology

KindConnect operates on an enterprise cloud infrastructure:

```text
[ Client Web Browsers (Mobile & Desktop) ]
                   |
                   v HTTPS / Anycast DNS
[ Vercel Global Edge Network (Edge CDN Caching) ]
                   |
                   v Serverless Edge Function Invocation
[ Next.js 15 Serverless Runtime Gateway (/api/[...route]) ]
                   |
                   +---> Google Identity Services API (OAuth 2.0 Verification)
                   |
                   +---> OpenStreetMap Nominatim API (Geo-Coding Tiles)
                   |
                   v Mongoose 8.x Connection Pool (TLS 1.3)
[ MongoDB Atlas Multi-Region Cloud Cluster (AWS) ]
```

### 7.2 Continuous Integration & Continuous Deployment (CI/CD)

The production release pipeline is fully automated via Git-driven CI/CD:

1. **Local Pre-Commit Verification:**
   * Static compilation check: `npm run build` executed locally.
   * All 22 static and dynamic routes must compile with zero errors.
2. **Push to Remote Main:**
   * Git commits pushed to `origin main` ([github.com/halimayesminomi/kindconnect](https://github.com/halimayesminomi/kindconnect.git)).
3. **Vercel Automated Build Pipeline:**
   * Vercel webhook triggers an automated edge build.
   * Build artifacts are optimized and deployed to production edge nodes.
4. **Zero-Downtime Live Rollout:**
   * Immediate live update at `https://kindconnect-7hc1.vercel.app`.

---

```text
========================================================================================
                          END OF ARCHITECTURE SPECIFICATION
                           KINDCONNECT ENGINEERING TEAM
                   Department of Computer Science & Engineering
                         Metropolitan University, Sylhet
========================================================================================
```
