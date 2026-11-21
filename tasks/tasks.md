# KindConnect: Project Tasks & Work Breakdown Structure (WBS)

---

## Document Metadata

| Field | Description |
| :--- | :--- |
| **System Document** | Project Tasks, Work Breakdown Structure (WBS) & Defect Resolution Matrix (`tasks.md`) |
| **Project Title** | KindConnect: A Modern Full-Stack Community Engagement & Grassroots Volunteer Management Platform |
| **Academic Course** | Web Programming Lab (Course Code: CSE 323) |
| **Academic Institution** | Department of Computer Science & Engineering, Metropolitan University, Sylhet |
| **Course Instructor** | Mr. Abu Jafar Md. Jakaria, Lecturer, Department of Computer Science & Engineering |
| **Lead Builder & Platform Admin** | Halima Yesmin Omi (Student ID: 251-112-001) — Platform Admin & Full-Stack Architect |
| **Co-Developer & QA Specialist** | Shraboni Das (Student ID: 251-112-006) — Quality Assurance & Testing Specialist |
| **AI Agent Ecosystem** | Google Antigravity Agent Framework (Multi-Agent Swarm) |
| **Academic Cohort** | 36th (Evening) Batch, Department of CSE |
| **Documentation Date** | November 2026 |
| **Platform Version** | Production Release v2.0.0 |
| **Project Status** | Complete / Verified in Production |
| **Source Repository** | [github.com/halimayesminomi/kindconnect](https://github.com/halimayesminomi/kindconnect.git) |
| **Live Production URL** | [kindconnect-7hc1.vercel.app](https://kindconnect-7hc1.vercel.app) |

---

## Table of Contents

- [1. Executive Task Summary & Project Metrics](#1-executive-task-summary--project-metrics)
  - [1.1 Engineering Scope Overview](#11-engineering-scope-overview)
  - [1.2 Key Project Metrics Dashboard](#12-key-project-metrics-dashboard)
- [2. Sprint & Milestone Execution Schedule](#2-sprint--milestone-execution-schedule)
- [3. Comprehensive Work Breakdown Structure (WBS) by Epic](#3-comprehensive-work-breakdown-structure-wbs-by-epic)
  - [3.1 Epic 1: Authentication, Google Identity & RBAC (`EPC-01`)](#31-epic-1-authentication-google-identity--rbac-epc-01)
  - [3.2 Epic 2: Event Lifecycle & Geospatial Discovery (`EPC-02`)](#32-epic-2-event-lifecycle--geospatial-discovery-epc-02)
  - [3.3 Epic 3: Volunteer Registration & Cryptographic Attendance (`EPC-03`)](#33-epic-3-volunteer-registration--cryptographic-attendance-epc-03)
  - [3.4 Epic 4: 1,000-Point Honor Gamification & QR Certification (`EPC-04`)](#34-epic-4-1000-point-honor-gamification--qr-certification-epc-04)
  - [3.5 Epic 5: Citizen Emergency Relief Hub & Base64 Compression (`EPC-05`)](#35-epic-5-citizen-emergency-relief-hub--base64-compression-epc-05)
  - [3.6 Epic 6: Two-Tier Real-Time Chat & Acoustic Chime Engine (`EPC-06`)](#36-epic-6-two-tier-real-time-chat--acoustic-chime-engine-epc-06)
  - [3.7 Epic 7: Administrative Governance & Analytics Dashboard (`EPC-07`)](#37-epic-7-administrative-governance--analytics-dashboard-epc-07)
  - [3.8 Epic 8: Serverless Architecture, Hydration & Optimization (`EPC-08`)](#38-epic-8-serverless-architecture-hydration--optimization-epc-08)
- [4. Forensic Bug Tracking & Defect Resolution Matrix](#4-forensic-bug-tracking--defect-resolution-matrix)
  - [4.1 Defect Summary Table](#41-defect-summary-table)
  - [4.2 Detailed Forensic Incident Resolutions](#42-detailed-forensic-incident-resolutions)
- [5. Quality Assurance & Production Verification](#5-quality-assurance--production-verification)
  - [5.1 22-Route Compilation Audit](#51-22-route-compilation-audit)
  - [5.2 Security & Cryptography Verification Checklist](#52-security--cryptography-verification-checklist)
- [6. Team Ownership & Contribution Matrix](#6-team-ownership--contribution-matrix)

---

## 1. Executive Task Summary & Project Metrics

### 1.1 Engineering Scope Overview

The KindConnect engineering initiative encompasses **48 primary engineering tasks** organized across **8 functional epics**, delivered across **8 sequential sprints**. The platform was designed, implemented, debugged, and launched by **Halima Yesmin Omi** and **Shraboni Das** in collaborative partnership with the **Google Antigravity AI Agent Ecosystem**.

Every task documented in this register has undergone rigorous static analysis, cross-browser validation, compilation verification (`npm run build`), and production deployment to Vercel's global edge network.

### 1.2 Key Project Metrics Dashboard

```text
+-----------------------------------------------------------------------------------------+
|                           KINDCONNECT TASK & DELIVERY METRICS                           |
|                                                                                         |
|  Total Engineering Epics:                                8 Epics                        |
|  Total Individual Tasks Tracked:                         48 Tasks                       |
|  Total Tasks Completed & Verified:                       48 / 48 (100% Completion)      |
|  Total Sprints Executed:                                 8 Sprints                      |
|  Total Next.js App Router Routes:                        22 Production Routes           |
|  Total Mongoose Database Collections:                    6 Collections                  |
|  Critical Forensic Defects Resolved:                     5 Major Incidents              |
|  Total Production Lines of Code:                         8,500+ LOC                     |
|  Final Build Compilation Status:                         0 Errors, 0 Warnings           |
|  Live Deployment Status:                                 Active on Vercel Edge CDN      |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Sprint & Milestone Execution Schedule

```mermaid
flowchart LR
    S1["Sprint 1: Scaffolding & Foundation"] --> S2["Sprint 2: Auth & Google GIS"]
    S2 --> S3["Sprint 3: Events & Geo-Discovery"]
    S3 --> S4["Sprint 4: Attendance & Venue QR"]
    S4 --> S5["Sprint 5: Gamification & Certificates"]
    S5 --> S6["Sprint 6: Citizen Relief Hub"]
    S6 --> S7["Sprint 7: Real-Time Chat & Audio"]
    S7 --> S8["Sprint 8: Admin & Production Launch"]
```

| Sprint | Timeline | Milestone Objective | Status | Key Deliverable |
| :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | Week 1 | Foundation, Theme & Core Models | **COMPLETED** | Next.js 15 App Router setup, Tailwind CSS theme, Mongoose schemas |
| **Sprint 2** | Week 2 | Identity, Security & Google OAuth | **COMPLETED** | Google Identity Services (GIS), Bcrypt hashing, JWT issuance |
| **Sprint 3** | Week 3 | Event Lifecycle & Geospatial Filtering | **COMPLETED** | Event CRUD, OpenStreetMap Nominatim geo-coding, filter search |
| **Sprint 4** | Week 4 | Cryptographic QR Attendance Engine | **COMPLETED** | QR code generation, mobile QR scanner, audit logging |
| **Sprint 5** | Week 5 | 1,000-Point Honor & QR Certificates | **COMPLETED** | Milestone point engine, verified certificates, clean print CSS |
| **Sprint 6** | Week 6 | Citizen Relief & Image Compression | **COMPLETED** | Emergency requests, HTML5 Canvas Base64 compression, urgency feed |
| **Sprint 7** | Week 7 | Two-Tier Chat & Web Audio Chime | **COMPLETED** | Compound key chat, event discussions, Web Audio API synthesizer |
| **Sprint 8** | Week 8 | Admin Governance & Cloud Release | **COMPLETED** | Admin analytics, forensic bug resolutions, Vercel edge deployment |

---

## 3. Comprehensive Work Breakdown Structure (WBS) by Epic

### 3.1 Epic 1: Authentication, Google Identity & RBAC (`EPC-01`)

* **Epic Owner:** Halima Yesmin Omi
* **Lead AI Collaborator:** `backend-builder`
* **Verification Status:** Verified & Deployed

| Task ID | Task Description | Priority | Assignee | Status | Deliverable File(s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-0101` | Design Mongoose `User` schema with Bcrypt password hashing and role enumeration (`admin`, `organizer`, `volunteer`, `citizen`). | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0102` | Implement stateless JWT token issuance (`jsonwebtoken`) with expiration and payload claims. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0103` | Integrate Google Identity Services (GIS) OAuth 2.0 endpoint with server-side Google UserInfo token verification. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0104` | Build client-side Login and Registration pages with real-time field validation and toast notifications. | P1 | Das / AI | **DONE** | `src/app/login/page.js`, `src/app/register/page.js` |
| `TSK-0105` | Implement Role-Based Access Control (RBAC) middleware protecting admin and organizer routes. | P0 | Omi | **DONE** | `src/app/admin/page.js`, `src/app/organizer/page.js` |
| `TSK-0106` | Implement dynamic welcome message personalization replacing hardcoded greeting strings. | P1 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |

### 3.2 Epic 2: Event Lifecycle & Geospatial Discovery (`EPC-02`)

* **Epic Owner:** Halima Yesmin Omi & Shraboni Das
* **Lead AI Collaborator:** `frontend-architect` & `backend-builder`
* **Verification Status:** Verified & Deployed

| Task ID | Task Description | Priority | Assignee | Status | Deliverable File(s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-0201` | Design Mongoose `Event` schema with category, capacity, urgency levels, coordinates, and organizer references. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0202` | Build Event Creation and Update interfaces for organizers with live form validation. | P1 | Das / AI | **DONE** | `src/app/dashboard/create-event/page.js`, `src/app/dashboard/update-event/[id]/page.js` |
| `TSK-0203` | Integrate OpenStreetMap Nominatim API for real-time reverse geo-coding of event venues. | P2 | Omi / AI | **DONE** | `src/app/events/page.js`, `src/app/events/[id]/page.js` |
| `TSK-0204` | Implement multi-facet filtering engine: text search, category tabs, urgency badges, and location filtering. | P1 | Das / AI | **DONE** | `src/app/events/page.js` |
| `TSK-0205` | Build detailed Event View page with participant roster, map view, and one-click registration. | P1 | Das | **DONE** | `src/app/events/[id]/page.js` |
| `TSK-0206` | Construct Organizer Management console to monitor participant quotas and event status transitions. | P1 | Omi | **DONE** | `src/app/organizer/page.js`, `src/app/dashboard/events/page.js` |

### 3.3 Epic 3: Volunteer Registration & Cryptographic Attendance (`EPC-03`)

* **Epic Owner:** Shraboni Das
* **Lead AI Collaborator:** `backend-builder` & `qa-auditor`
* **Verification Status:** Verified & Deployed

| Task ID | Task Description | Priority | Assignee | Status | Deliverable File(s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-0301` | Design Mongoose `Registration` schema with compound unique index on `(user, event)` to prevent double booking. | P0 | Das / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0302` | Implement atomic capacity checking during registration to avoid oversubscription race conditions. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0303` | Generate unique cryptographic QR codes for registered volunteers using `qrcode.react`. | P1 | Das / AI | **DONE** | `src/app/dashboard/joined/page.js` |
| `TSK-0304` | Construct in-venue QR Attendance Scanner interface for event organizers with live camera feed. | P1 | Das / AI | **DONE** | `src/app/dashboard/attendance/page.js` |
| `TSK-0305` | Build Attendance verification API (`/api/attendance/mark`) validating event status and marking timestamps. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0306` | Implement user Joined Events dashboard displaying participation history and attendance badges. | P2 | Das | **DONE** | `src/app/dashboard/joined/page.js` |

### 3.4 Epic 4: 1,000-Point Honor Gamification & QR Certification (`EPC-04`)

* **Epic Owner:** Halima Yesmin Omi & Shraboni Das
* **Lead AI Collaborator:** `frontend-architect`
* **Verification Status:** Verified & Deployed

| Task ID | Task Description | Priority | Assignee | Status | Deliverable File(s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-0401` | Design 1,000-Point Gamification milestone calculation engine (+100 pts per verified attendance, +50 pts per relief action). | P1 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0402` | Build dynamic tier progression visualizer: Bronze Volunteer (100 pts) -> Silver -> Gold -> Platinum Honor Guard (1,000 pts). | P2 | Das / AI | **DONE** | `src/app/dashboard/certificates/page.js`, `src/app/leaderboard/page.js` |
| `TSK-0403` | Design institutional Certificate of Service layout with Metropolitan University branding and student credits. | P1 | Omi / Das | **DONE** | `src/app/dashboard/certificates/page.js` |
| `TSK-0404` | Embed tamper-evident dynamic QR codes on certificates linking to live verification URLs. | P1 | Omi / AI | **DONE** | `src/app/dashboard/certificates/page.js` |
| `TSK-0405` | Engineer CSS `@media print` engine to suppress browser headers, URLs, and timestamps during PDF export. | P0 | Das / AI | **DONE** | `src/app/globals.css` |
| `TSK-0406` | Construct public Volunteer Leaderboard highlighting top contributors across Sylhet division. | P2 | Das | **DONE** | `src/app/leaderboard/page.js` |

### 3.5 Epic 5: Citizen Emergency Relief Hub & Base64 Compression (`EPC-05`)

* **Epic Owner:** Halima Yesmin Omi
* **Lead AI Collaborator:** `frontend-architect` & `backend-builder`
* **Verification Status:** Verified & Deployed

| Task ID | Task Description | Priority | Assignee | Status | Deliverable File(s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-0501` | Design Mongoose `EmergencyRequest` schema with disaster categories (Flood, Medical, Food, Blood) and urgency ratings. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0502` | Implement client-side HTML5 Canvas Base64 image compression pipeline to reduce upload payloads below 500KB. | P1 | Das / AI | **DONE** | `src/app/emergency/page.js` |
| `TSK-0503` | Build Citizen Emergency intake portal with GPS coordinate capture and contact verification. | P1 | Omi / AI | **DONE** | `src/app/emergency/page.js` |
| `TSK-0504` | Implement Emergency Feed interface for volunteers sorted by urgency and geographic proximity. | P1 | Das | **DONE** | `src/app/emergency/page.js` |
| `TSK-0505` | Build relief status transition workflow (`Pending` -> `In Progress` -> `Resolved`) with audit logs. | P1 | Omi | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0506` | Construct public Community Impact dashboard displaying aggregated metrics (meals served, blood units delivered). | P2 | Das | **DONE** | `src/app/impact/page.js` |

### 3.6 Epic 6: Two-Tier Real-Time Chat & Acoustic Chime Engine (`EPC-06`)

* **Epic Owner:** Shraboni Das & Halima Yesmin Omi
* **Lead AI Collaborator:** `qa-auditor` & `backend-builder`
* **Verification Status:** Verified & Deployed

| Task ID | Task Description | Priority | Assignee | Status | Deliverable File(s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-0601` | Design Mongoose `Message` schema supporting both event group rooms and direct support communications. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0602` | Enforce multi-tenant data isolation using deterministic compound conversation keys `[u1, u2].sort().join("_")`. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0603` | Implement polymorphic BSON `toIdVariants()` helper resolving ObjectId vs String query mismatches. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0604` | Build HTML5 Web Audio API synthesizer generating a pleasant two-tone chime (587.33 Hz -> 880 Hz) on message receipt. | P2 | Das / AI | **DONE** | `src/app/dashboard/chat/page.js` |
| `TSK-0605` | Build responsive Chat Viewport with unread counters, auto-scroll to bottom, and message status ticks. | P1 | Das | **DONE** | `src/app/dashboard/chat/page.js` |
| `TSK-0606` | Gate event group chat rooms to verified registered participants only. | P1 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |

### 3.7 Epic 7: Administrative Governance & Analytics Dashboard (`EPC-07`)

* **Epic Owner:** Halima Yesmin Omi
* **Lead AI Collaborator:** `backend-builder`
* **Verification Status:** Verified & Deployed

| Task ID | Task Description | Priority | Assignee | Status | Deliverable File(s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-0701` | Implement server-side aggregation pipelines for real-time KPI metrics (active users, events, relief tickets). | P1 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0702` | Build Admin Dashboard view with Recharts data visualizations (registration trends, category distributions). | P1 | Omi / Das | **DONE** | `src/app/admin/page.js` |
| `TSK-0703` | Construct User Management portal allowing admins to elevate roles, review volunteer hours, and audit accounts. | P1 | Omi | **DONE** | `src/app/admin/page.js` |
| `TSK-0704` | Implement Admin Direct Chat center providing private 1-on-1 support channels with platform volunteers. | P1 | Omi / AI | **DONE** | `src/app/admin/page.js`, `src/app/dashboard/chat/page.js` |
| `TSK-0705` | Build Emergency Relief moderation center enabling admins to dispatch verified teams to distress locations. | P1 | Omi | **DONE** | `src/app/admin/page.js` |

### 3.8 Epic 8: Serverless Architecture, Hydration & Optimization (`EPC-08`)

* **Epic Owner:** Halima Yesmin Omi & Shraboni Das
* **Lead AI Collaborator:** `antigravity-core`
* **Verification Status:** Verified & Deployed

| Task ID | Task Description | Priority | Assignee | Status | Deliverable File(s) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `TSK-0801` | Consolidate standalone Express server into Next.js 15 App Router serverless catch-all gateway (`api/[...route]`). | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0802` | Implement Mongoose serverless connection caching (`global.mongoose`) preventing Atlas socket exhaustion. | P0 | Omi / AI | **DONE** | `src/app/api/[...route]/route.js` |
| `TSK-0803` | Audit and resolve React 19 Client-Side Hydration exceptions (Errors #418 & #423) across all pages. | P0 | Das / AI | **DONE** | All `src/app/**/page.js` |
| `TSK-0804` | Wrap all client components accessing `useSearchParams()` in React `<Suspense>` boundaries. | P0 | Das / AI | **DONE** | `src/app/login/page.js`, `src/app/events/page.js` |
| `TSK-0805` | Execute MongoDB Atlas database data migration updating legacy test data ("Sadia") to authentic user records. | P1 | Omi / AI | **DONE** | Production MongoDB Atlas |
| `TSK-0806` | Perform full production build validation (`npm run build`) asserting 0 errors across all 22 routes. | P0 | Das / AI | **DONE** | Production Build Environment |
| `TSK-0807` | Configure Vercel Edge CI/CD pipeline and execute live production deployment (`kindconnect-7hc1.vercel.app`). | P0 | Omi / AI | **DONE** | Vercel Cloud Platform |

---

## 4. Forensic Bug Tracking & Defect Resolution Matrix

### 4.1 Defect Summary Table

| Defect ID | Severity | Root Cause Summary | Resolution Strategy | Assignee | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`BUG-01`** | **Critical (P0)** | Next.js 15 Client Hydration Mismatch on Vercel Edge | Enclosed `useSearchParams()` in `<Suspense>`, implemented `isMounted` state guards, normalized date locales. | Das / AI | **RESOLVED** |
| **`BUG-02`** | **Critical (P0)** | Chat Data Cross-Talk & Mongoose BSON Type Mismatch | Applied `toIdVariants()` polymorphic query helper and enforced deterministic compound keys `[u1, u2].sort().join("_")`. | Omi / AI | **RESOLVED** |
| **`BUG-03`** | **High (P1)** | Hardcoded "Sadia" Greeting in Registration & Chat | Executed MongoDB Atlas database migration script and implemented dynamic greeting string interpolation. | Omi / AI | **RESOLVED** |
| **`BUG-04`** | **High (P1)** | Certificate Print Distortion with Browser Watermarks | Implemented strict `@media print` CSS rules isolating the `#printable-certificate` container and zeroing page margins. | Das / AI | **RESOLVED** |
| **`BUG-05`** | **Medium (P2)** | Windows PowerShell `&&` Command Chaining Failure | Replaced Unix-style `&&` chaining with PowerShell `;` separators and wrote scratch scripts for dollar-signed operators. | AI Core | **RESOLVED** |

### 4.2 Detailed Forensic Incident Resolutions

```text
+-----------------------------------------------------------------------------------------+
| INCIDENT REPORT: BUG-01 (Client-Side Hydration Failure)                                 |
| Trigger: Production deployment on Vercel caused React Error #418 & #423.                |
| Investigation: Mismatched HTML between server UTC runtime and client BST (UTC+6) time. |
| Correction: Wrapped useSearchParams() in React Suspense; deferred client date renders.  |
| Verification: Zero hydration console warnings across desktop, iOS, and Android.         |
+-----------------------------------------------------------------------------------------+
| INCIDENT REPORT: BUG-02 (Multi-Tenant Chat Data Isolation)                              |
| Trigger: Admin support messages appeared in unauthorized volunteer user sessions.       |
| Investigation: Missing compound conversation keys; String vs ObjectId BSON mismatches.  |
| Correction: Injected toIdVariants() and enforced conversationKey = [u1,u2].sort().join() |
| Verification: Rigorous multi-session audit confirmed 100% tenant conversation isolation.|
+-----------------------------------------------------------------------------------------+
| INCIDENT REPORT: BUG-03 (Hardcoded Dynamic Welcome Greeting)                            |
| Trigger: New user registration displayed "Hello Sadia! Welcome to KindConnect."         |
| Investigation: Legacy seed record in MongoDB Atlas contained a static greeting message. |
| Correction: Ran automated migration updating record; refactored auth route greetings.   |
| Verification: Authentic registered name (e.g., "Hello Omi!") renders dynamically.       |
+-----------------------------------------------------------------------------------------+
| INCIDENT REPORT: BUG-04 (Certificate PDF Clean Print Failure)                           |
| Trigger: "Save Certificate as PDF" printed browser URL headers and page timestamps.     |
| Investigation: Standard browser print styles captured viewport chrome and default @page.|
| Correction: Configured @page { margin: 0; } and isolated #printable-certificate.       |
| Verification: Vector-sharp PDF certificates generated with zero browser watermark clutter.|
+-----------------------------------------------------------------------------------------+
```

---

## 5. Quality Assurance & Production Verification

### 5.1 22-Route Compilation Audit

All 22 static and dynamic routes compile cleanly with zero errors:

| Route Path | Route Type | Verification Status | Compilation Time |
| :--- | :--- | :--- | :--- |
| `/` | Static (Home / Hero) | **VERIFIED (0 errors)** | 4.1 kB (128 kB load) |
| `/about` | Static (About & Mission) | **VERIFIED (0 errors)** | 2.3 kB (115 kB load) |
| `/admin` | Dynamic (Admin Governance) | **VERIFIED (0 errors)** | 7.8 kB (142 kB load) |
| `/api/[...route]` | Serverless Catch-All API | **VERIFIED (0 errors)** | 0 B (Edge Function) |
| `/dashboard` | Dynamic (Volunteer Dashboard) | **VERIFIED (0 errors)** | 5.2 kB (135 kB load) |
| `/dashboard/attendance` | Dynamic (QR Scanner) | **VERIFIED (0 errors)** | 6.1 kB (138 kB load) |
| `/dashboard/certificates`| Dynamic (QR Certificates) | **VERIFIED (0 errors)** | 6.9 kB (141 kB load) |
| `/dashboard/chat` | Dynamic (Real-Time Messaging)| **VERIFIED (0 errors)** | 8.4 kB (146 kB load) |
| `/dashboard/create-event`| Dynamic (Event Builder) | **VERIFIED (0 errors)** | 5.6 kB (136 kB load) |
| `/dashboard/events` | Dynamic (Organizer Events) | **VERIFIED (0 errors)** | 4.8 kB (133 kB load) |
| `/dashboard/joined` | Dynamic (Joined Events) | **VERIFIED (0 errors)** | 4.2 kB (131 kB load) |
| `/dashboard/profile` | Dynamic (User Profile) | **VERIFIED (0 errors)** | 4.5 kB (132 kB load) |
| `/dashboard/update-event/[id]` | Dynamic (Event Edit) | **VERIFIED (0 errors)** | 5.7 kB (137 kB load) |
| `/emergency` | Dynamic (Relief Intake & Feed)| **VERIFIED (0 errors)** | 6.3 kB (139 kB load) |
| `/events` | Dynamic (Discovery & Search) | **VERIFIED (0 errors)** | 5.1 kB (134 kB load) |
| `/events/[id]` | Dynamic (Event Details) | **VERIFIED (0 errors)** | 6.4 kB (138 kB load) |
| `/impact` | Static (Community Analytics) | **VERIFIED (0 errors)** | 4.0 kB (129 kB load) |
| `/leaderboard` | Dynamic (Volunteer Ranks) | **VERIFIED (0 errors)** | 4.7 kB (133 kB load) |
| `/login` | Dynamic (Auth & Google GIS) | **VERIFIED (0 errors)** | 3.8 kB (126 kB load) |
| `/organizer` | Dynamic (Organizer Hub) | **VERIFIED (0 errors)** | 5.9 kB (137 kB load) |
| `/profile` | Dynamic (Public Profile) | **VERIFIED (0 errors)** | 4.3 kB (130 kB load) |
| `/register` | Dynamic (Volunteer Signup) | **VERIFIED (0 errors)** | 4.1 kB (127 kB load) |

### 5.2 Security & Cryptography Verification Checklist

* [x] **Bcrypt Password Encryption:** Salt factor 10 applied on all user passwords. Plaintext passwords never stored.
* [x] **Stateless JWT Tokens:** HS256 algorithm with cryptographic signatures; validated on all private route mutations.
* [x] **Google GIS OAuth 2.0:** Server-side token validation against Google UserInfo API before user onboarding.
* [x] **Multi-Tenant Chat Isolation:** Compound deterministic conversation keys prevent inter-account message leakage.
* [x] **BSON Polymorphism Safety:** All ID queries wrapped in `toIdVariants()` supporting both BSON ObjectId and strings.
* [x] **Serverless Connection Pooling:** Caching via `global.mongoose` prevents MongoDB Atlas connection starvation.
* [x] **Zero Mock Data Invariant:** Real-time queries fail gracefully with structured error payloads rather than hallucinated mocks.

---

## 6. Team Ownership & Contribution Matrix

| Engineering Area | Halima Yesmin Omi (251-112-001) | Shraboni Das (251-112-006) | Google Antigravity AI |
| :--- | :--- | :--- | :--- |
| **System Architecture** | Lead Architecture Design & Approvals | Architecture Review & Usability Inputs | WBS Synthesis & Topology Diagrams |
| **Backend & Serverless API** | Mongoose Models & Catch-All REST Gateway | API Integration & Endpoint Validation | Serverless Adapter & Connection Pool |
| **Frontend UI/UX** | Admin Center & Organizer Workflows | Event Views, Registration & Certificates | Tailwind Responsive Grid & Forms |
| **Security & Authentication**| Google GIS OAuth & JWT Middleware | Auth Form Validation & UI Error States | Token Verification Logic & Bcrypt |
| **Quality Assurance & Testing**| Database Schema Integrity & Migrations | Hydration Guarding & Cross-Browser QA | Forensic Bug Hunting & Build Evals |
| **Documentation & Release** | Architecture Documentation & Sign-Off | Tasks & Test Matrix Verification | WBS Formatting & Markdown Synthesis |

---

```text
========================================================================================
                          END OF TASKS SPECIFICATION DOCUMENT
                            KINDCONNECT ENGINEERING TEAM
                    Department of Computer Science & Engineering
                          Metropolitan University, Sylhet
========================================================================================
```
