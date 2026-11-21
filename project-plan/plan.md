# KindConnect: Project Plan & Engineering Execution Blueprint

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

- [1. Project Overview & Problem Statement](#1-project-overview--problem-statement)
  - [1.1 Executive Summary](#11-executive-summary)
  - [1.2 Background & Operational Failures Addressed](#12-background--operational-failures-addressed)
  - [1.3 Strategic Project Objectives](#13-strategic-project-objectives)
- [2. Scope & Work Breakdown Structure (WBS)](#2-scope--work-breakdown-structure-wbs)
  - [2.1 Core System Modules & Epics](#21-core-system-modules--epics)
  - [2.2 In-Scope Deliverables](#22-in-scope-deliverables)
  - [2.3 Out-of-Scope Boundaries](#23-out-of-scope-boundaries)
- [3. Technical Architecture & System Specifications](#3-technical-architecture--system-specifications)
  - [3.1 4-Tier Client-Server Architecture](#31-4-tier-client-server-architecture)
  - [3.2 Technology Stack Selection & Rationale](#32-technology-stack-selection--rationale)
  - [3.3 Cloud Database Schema & Data Models](#33-cloud-database-schema--data-models)
  - [3.4 Serverless REST API Routing Matrix](#34-serverless-rest-api-routing-matrix)
- [4. Sprint Execution Plan & Milestone Schedule](#4-sprint-execution-plan--milestone-schedule)
  - [4.1 Phased Sprint Breakdown](#41-phased-sprint-breakdown)
  - [4.2 Milestone Verification Criteria](#42-milestone-verification-criteria)
- [5. Risk Management & Security Governance](#5-risk-management--security-governance)
  - [5.1 Comprehensive Risk Assessment Matrix](#51-comprehensive-risk-assessment-matrix)
  - [5.2 Security Invariants & Data Protection Protocols](#52-security-invariants--data-protection-protocols)
- [6. Quality Assurance, Test Strategy & Incident History](#6-quality-assurance-test-strategy--incident-history)
  - [6.1 Testing Methodology & Build Verification](#61-testing-methodology--build-verification)
  - [6.2 Key Forensic Incidents & Engineering Resolutions](#62-key-forensic-incidents--engineering-resolutions)
- [7. Post-Launch Operational Maintenance & Future Roadmap](#7-post-launch-operational-maintenance--future-roadmap)
  - [7.1 Monitoring & Continuous Integration](#71-monitoring--continuous-integration)
  - [7.2 Post-Launch Feature Roadmap](#72-post-launch-feature-roadmap)

---

## 1. Project Overview & Problem Statement

### 1.1 Executive Summary

KindConnect is an enterprise-grade, full-stack, cloud-native web platform engineered to connect grassroots volunteers, community organizers, citizens in acute humanitarian crisis, and academic evaluators into an auditable digital ecosystem. Developed for the Web Programming Lab (CSE 323) at Metropolitan University, Sylhet, the platform replaces fragmented manual coordination with real-time event discovery, anti-fraud Google identity verification, cryptographic venue attendance tracking, a 1,000-point gamified milestone honors system, auto-generated institutional certificates with live QR verification, bidirectional multi-channel real-time chat, and administrative governance.

### 1.2 Background & Operational Failures Addressed

Grassroots volunteering, disaster relief, and emergency local aid across Bangladesh (such as flood rescue operations in Sylhet, winter clothing distribution, and emergency blood appeals) predominantly rely on unorganized personal networks and social media posts. This fragmentation causes four fundamental failures:

1. **Ghost Registrations & Account Fabrication:** Community organizers suffer from anonymous, non-verified registrations and disposable burner email accounts that corrupt logistics and resource planning.
2. **Attendance Fabrication:** Manual paper-based attendance logs lack tamper-proof cryptographic validation, enabling unverified claims of community service.
3. **Delayed Humanitarian Response:** Citizens requiring immediate life-saving aid (e.g., urgent O-negative blood donors or flood relief boats) struggle to reach verified changemakers quickly.
4. **Absence of Verifiable Academic Credentials:** Volunteers lack standardized, tamper-resistant credentials recognizing their service hours for academic and institutional evaluation.

### 1.3 Strategic Project Objectives

* **Zero-Spam Registration:** Enforce real-time Google Identity Services (GIS) OAuth 2.0 verification and algorithmic disposable domain filtering to eliminate fake signups.
* **Cryptographic Attendance Verification:** Replace paper logs with dynamically generated venue QR codes conferring authenticated impact points directly to user profiles.
* **Verifiable Milestone Certification:** Confer individual Presidential Certificates of Social Excellence equipped with unique alphanumeric credential IDs and live smartphone-scannable QR verification.
* **Isolated Two-Tier Communication:** Provide real-time event group collaboration alongside strictly isolated, multi-tenant 1-on-1 direct support channels with Platform Administrator Halima Yesmin Omi.
* **Accessibility & Inclusivity:** Implement WCAG AAA compliant dual Dark/Light themes and dynamic 1-click English and Bengali (বাংলা) internationalization.

---

## 2. Scope & Work Breakdown Structure (WBS)

### 2.1 Core System Modules & Epics

KindConnect is partitioned into eight functional epics:

```text
+---------------------------------------------------------------------------------------------------+
|                                     KINDCONNECT SCOPE BREAKDOWN                                   |
+---------------------------------------------------------------------------------------------------+
|  Epic 1: Anti-Fraud Authentication & User Profiling  --> Google GIS, Burner Blocker, RBAC, Photo  |
|  Epic 2: Event Lifecycle Management                  --> Creation, Discovery, Capacity, Filtering |
|  Epic 3: Physical Venue Attendance & Hours Ledger    --> Cryptographic QR Check-In, Point Accrual |
|  Epic 4: Verifiable Certification & Gamification     --> 1000-Pt Milestone, Dynamic QR, PDF Print|
|  Epic 5: Citizen Emergency Relief Hub                --> Blood Donation, Relief Intake, Responders|
|  Epic 6: Multi-Channel Real-Time Chat Engine         --> 2-Tier Rooms, BSON Safety, Audio Chime   |
|  Epic 7: Administrative Governance Center            --> Profile Modal, Role Elevation, Moderation|
|  Epic 8: Accessibility, Theming & i18n Engine        --> WCAG Dark/Light, 1-Click Bengali / English|
+---------------------------------------------------------------------------------------------------+
```

### 2.2 In-Scope Deliverables

* **Client Presentation Layer:** 22 static and dynamic routes built on Next.js 15 (App Router) and React 19.
* **Serverless API Controller:** Unified catch-all REST gateway (`/api/[...route]`) serving over 20 secure endpoints.
* **Cloud Database Architecture:** Persistent multi-model collections in MongoDB Atlas managed via Mongoose 8.x ODM.
* **Authentication Pipeline:** Hybrid stateless JWT token lifecycle coupled with Bcrypt salted hashing and Google GIS token validation.
* **Audio Synthesizer:** Pure browser-based Web Audio API harmonic chime generator (587 Hz -> 880 Hz).
* **Print Stylesheet Engine:** CSS `@media print` rules suppressing browser chrome, timestamps, and URLs for clean PDF export.

### 2.3 Out-of-Scope Boundaries

* Third-party payment gateway integration for monetary donations (volunteering and relief responses are non-monetary and physical-presence oriented).
* Native mobile application compilation for iOS/Android (application is engineered as a responsive Progressive Web UI accessible via mobile browsers).
* Automated SMS delivery gateways (notifications are delivered via in-app real-time badges and acoustic chimes).

---

## 3. Technical Architecture & System Specifications

### 3.1 4-Tier Client-Server Architecture

```text
[ Tier 1: Presentation & Interaction Layer ]
  - Next.js 15 App Router | React 19 Client Components
  - Tailwind CSS UI Framework | Lucide Vector Icons
  - HTML5 Web Audio API Synthesizer (587 Hz -> 880 Hz Sine Chime)
  - HTML5 Canvas Base64 Client-Side Image Compression
         |
         v (HTTPS / REST JSON / OAuth 2.0 GIS Bearer)
[ Tier 2: External Security & Geo-Spatial Gateway ]
  - Google Identity Services (GIS) OAuth 2.0 UserInfo API
  - OpenStreetMap Nominatim Geo-Coding Tile Servers
         |
         v (Serverless Request Context / Bearer Verification)
[ Tier 3: Application Logic & REST API Controller ]
  - Next.js Serverless Route Controller (/api/[...route]/route.js)
  - Stateless JWT Session Lifecycle & Role-Based Access Control (RBAC)
  - Bcrypt Key Derivation (Salt Work Factor: 10)
  - In-Memory Regex Engine (60+ Disposable Domain Blocklist)
         |
         v (Mongoose 8.x Connection Pool)
[ Tier 4: Cloud Data Persistence Layer ]
  - MongoDB Atlas Cloud Cluster
  - Document Collections: users, events, registrations, attendance, messages, emergencyrequests
```

### 3.2 Technology Stack Selection & Rationale

| Architecture Tier | Technology | Version | Selection Rationale |
| :--- | :--- | :--- | :--- |
| Frontend Framework | Next.js (App Router) | `15.5.28` | Production server-side rendering (SSR), optimized bundle splitting, and integrated serverless routing. |
| UI Library | React | `19.0.0` | Latest concurrent rendering primitives, action hooks, and optimized component lifecycles. |
| Styling Framework | Tailwind CSS | `3.4.x` | Utility-first responsive design, zero runtime CSS overhead, and WCAG AAA contrast compliance. |
| Iconography | Lucide React | `0.4x` | Lightweight, scalable vector icons with tree-shaking support. |
| Data Persistence ODM | Mongoose | `8.x` | Schema validation, strongly typed document casting, and automated connection management. |
| Cloud Database | MongoDB Atlas | Cloud Cluster | Scalable cloud document persistence with multi-region replication. |
| Password Security | Bcrypt.js | `2.4.x` | Industry-standard salted key derivation protecting stored credentials. |
| Session Token | JSON Web Tokens | `9.x` | Stateless, tamper-resistant authorization tokens across serverless function invocations. |
| External Identity | Google GIS OAuth | 2.0 | Mandatory verification against Google servers to eliminate disposable email fraud. |
| Audio Engine | HTML5 Web Audio API | Native Browser | In-browser synthesizer producing clean audio notifications without external asset latency. |
| Cloud Deployment | Vercel Platform | Edge Network | Automated Git-driven CI/CD deployment with edge CDN caching and zero-downtime rollouts. |

### 3.3 Cloud Database Schema & Data Models

| Collection Name | Primary Keys & References | Core Field Attributes | Indexing & Constraints |
| :--- | :--- | :--- | :--- |
| `users` | `_id` (ObjectId) | `name`, `username`, `email`, `password`, `role`, `points`, `hoursVolunteered`, `phone`, `photoURL`, `designation` | Unique index on `email` and `username`. Role enum: `user`, `organizer`, `admin`. |
| `events` | `_id` (ObjectId) | `title`, `description`, `category`, `location`, `date`, `capacity`, `volunteersCount`, `creatorEmail`, `status` | Indexed by `date` and `category`. Capacity check constraint enforced on RSVP. |
| `registrations` | `_id`, `eventId`, `userId` | `eventId`, `userId`, `userEmail`, `userName`, `status`, `registeredAt` | Compound unique index on `(eventId, userId)` preventing duplicate event registrations. |
| `attendance` | `_id`, `eventId`, `userId` | `eventId`, `userId`, `userEmail`, `userName`, `pointsAwarded`, `checkedInAt` | Compound unique index on `(eventId, userId)`. Awards +100 points per event check-in. |
| `messages` | `_id`, `sender`, `recipient`, `eventId` | `type`, `conversationId`, `sender`, `senderName`, `recipient`, `recipientName`, `text`, `read`, `readBy` | Indexed by `conversationId` and `(type, eventId)`. Types: `direct`, `event_group`. |
| `emergencyrequests` | `_id` (ObjectId) | `title`, `category`, `urgency`, `location`, `contactPhone`, `description`, `volunteersJoined`, `responders` | Indexed by `urgency` and `createdAt`. Urgency enum: `Critical`, `High`, `Medium`. |

### 3.4 Serverless REST API Routing Matrix

| Route Path | HTTP Method | Authorization Level | Functional Responsibility |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public (GIS Verified) | Creates new volunteer account after validating Google OAuth token and email domain. |
| `/api/auth/login` | `POST` | Public | Validates credentials via Bcrypt comparison and issues 7-day signed JWT token. |
| `/api/auth/google` | `POST` | Public (GIS Verified) | Handles Google OAuth pop-up login and auto-provisions verified volunteer account. |
| `/api/events` | `GET` / `POST` | Public / Organizer | Lists active events with category filtering; enables verified organizers to publish events. |
| `/api/events/[id]` | `GET` / `PATCH` / `DELETE` | Public / Organizer / Admin | Details, edits, or deletes an existing event with role and ownership checks. |
| `/api/registrations` | `POST` | Authenticated | Registers volunteer for an event, checks capacity, and increments attendee count. |
| `/api/attendance/check-in` | `POST` | Authenticated | Verifies 6-char cryptographic venue check-in token and awards +100 points to user. |
| `/api/emergency` | `GET` / `POST` | Public / Authenticated | Lists citizen distress requests; allows citizens to post emergency appeals. |
| `/api/emergency/[id]/respond` | `POST` | Authenticated | Registers volunteer as emergency responder and links direct contact details. |
| `/api/chat/my-events` | `GET` | Authenticated | Returns list of event group channels for which user holds approved registration. |
| `/api/chat/events/[id]/messages`| `GET` / `POST` | Enrolled Members / Admin | Protected event group discussion; strictly restricts read/write to enrolled volunteers. |
| `/api/chat/direct/admin` | `GET` / `POST` | Authenticated / Admin | Isolated 1-on-1 direct support channel between volunteer and Platform Admin Omi. |
| `/api/admin/users` | `GET` / `PATCH` / `DELETE` | Platform Admin (`omi`) | Admin governance: inspects full profiles, modifies roles, and deletes flagged users. |

---

## 4. Sprint Execution Plan & Milestone Schedule

### 4.1 Phased Sprint Breakdown

The project was executed across eight intensive development sprints leading to production deployment:

```text
+---------------------------------------------------------------------------------------------------+
|                                  PROJECT SPRINT ROADMAP & TIMELINE                                |
+---------------------------------------------------------------------------------------------------+
|  Sprint 1: Architecture, Modeling & Scaffolding     --> Proposal, DFDs, ERDs, Next.js 15 Monorepo |
|  Sprint 2: Data Modeling & Serverless Controller   --> Mongoose Models, REST Catch-All Gateway    |
|  Sprint 3: Anti-Fraud Google Authentication Hub    --> Google GIS OAuth, Burner Domain Blocker    |
|  Sprint 4: Event Lifecycle & Venue QR Attendance    --> Dynamic RSVP, Cryptographic QR Check-in    |
|  Sprint 5: Citizen Emergency Relief Hub             --> Blood/Aid Intake, One-Click Phone Linking  |
|  Sprint 6: Real-Time Chat Isolation & Audio Engine  --> BSON Type Safety, Compound Keys, Web Audio|
|  Sprint 7: Milestone Certification & Print Engine   --> 1000-Pt Engine, Live QR, Clean PDF Styles |
|  Sprint 8: Admin Panel, Theming & Production Launch --> Admin Governance, Dual Theme, Vercel Live  |
+---------------------------------------------------------------------------------------------------+
```

### 4.2 Milestone Verification Criteria

| Milestone Target | Primary Deliverables | Acceptance Verification Criteria |
| :--- | :--- | :--- |
| **M1: Core Architecture** | System Architecture, ERD, DFD Level 0 & 1 | Formal proposal approved by Course Instructor Mr. Abu Jafar Md. Jakaria. |
| **M2: Identity & Security** | Google GIS integration, 60+ domain blocklist, JWT | 100% rejection of disposable burner emails; verified Google token handshake. |
| **M3: Event & Attendance** | Dynamic event publishing, QR attendance token | Successful venue check-in yielding +100 point attribution in cloud database. |
| **M4: Relief & Chat** | Emergency responder intake, isolated direct chat | Zero cross-account message leakage; verified 1-on-1 Admin isolation. |
| **M5: Certification** | Presidential Milestone certificate, clean PDF | Clean print export hiding browser chrome; smartphone-scannable QR verification. |
| **M6: Cloud Deployment** | Vercel production hosting, 22 compiled routes | Local `npm run build` static compilation passing with zero warnings or errors. |

---

## 5. Risk Management & Security Governance

### 5.1 Comprehensive Risk Assessment Matrix

| Risk ID | Identified Risk Event | Probability | Impact | Proactive Mitigation Strategy | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **RSK-01** | Bot registrations and temporary burner email spam | High | Critical | Integrated 60+ disposable domain regex blocklist + mandatory Google GIS OAuth token verification. | Mitigated & Tested |
| **RSK-02** | Multi-tenant cross-talk in direct admin support messages | High | Critical | Engineered deterministic compound keys (`[user, admin].sort().join("_")`) and BSON variant querying (`toIdVariants`). | Mitigated & Tested |
| **RSK-03** | Unauthorized access to private event group discussions | Medium | High | Enforced database validation checking user's approved `Registration` record before granting channel read/write. | Mitigated & Tested |
| **RSK-04** | Client-side hydration mismatch crashes in Next.js 15 | High | High | Enclosed `useSearchParams()` in `<Suspense>` boundaries; added client-mount state guards and safe date formatters. | Mitigated & Tested |
| **RSK-05** | Browser header and URL clutter on certificate PDF prints | Medium | Medium | Implemented CSS `@media print` rules enforcing fixed sizing and complete suppression of browser chrome. | Mitigated & Tested |
| **RSK-06** | Legacy hardcoded data appearing in onboarding chat | Low | Medium | Executed targeted MongoDB database migrations and established dynamic greeting generation pipelines. | Mitigated & Tested |

### 5.2 Security Invariants & Data Protection Protocols

1. **Credential Invariant:** Passwords must be hashed using Bcrypt with a work factor of 10. Plaintext passwords must never be stored, logged, or transmitted in responses.
2. **Identity Invariant:** During registration, the email address provided in the payload must strictly match the verified Google account returned by the Google UserInfo API.
3. **Multi-Tenant Invariant:** Direct support chats must strictly isolate messages between the authenticated user and Platform Admin Halima Yesmin Omi (`omi@kindconnect.org`).
4. **Administrative Invariant:** Destructive operations (role modification, event deletion, user purging) must be gated by verified administrative JWT claims.
5. **Connection Invariant:** MongoDB connection handles must be cached across serverless function invocations to prevent connection pool exhaustion on Atlas.

---

## 6. Quality Assurance, Test Strategy & Incident History

### 6.1 Testing Methodology & Build Verification

The quality assurance plan combined automated static compilation with isolated runtime scripting:

* **Static Compilation Audits:** Every release underwent local compilation via `next build`, verifying type safety, route boundaries, and tree-shaking across all 22 static and dynamic routes.
* **Scratch-File Isolation Protocol:** To prevent terminal shell variable interpolation issues (e.g., PowerShell handling of `$` variables in inline scripts), all database queries, migrations, and API tests were executed via standalone Node.js scripts in the persistent `scratch/` directory.
* **Cross-Browser & Multi-Device Testing:** The UI was validated across desktop (Chrome, Edge, Firefox) and mobile browsers (iOS Safari, Android Chrome) ensuring responsive breakpoints, camera access, and acoustic audio chime performance.

### 6.2 Key Forensic Incidents & Engineering Resolutions

| Incident ID | Subsystem | Root Cause | Engineering Resolution | Status |
| :--- | :--- | :--- | :--- | :--- |
| **INC-01** | Production Hosting | SSR Hydration mismatch and unwrapped `useSearchParams()` | Integrated React `<Suspense>` boundaries and client mount guards | Resolved |
| **INC-02** | Real-Time Chat | Cross-account message leakage via loose BSON queries | Implemented `toIdVariants()` and bidirectional key hashing | Resolved |
| **INC-03** | Onboarding Chat | Hardcoded "Sadia" greeting in legacy database records | Executed MongoDB migration script and added dynamic greeting pipeline | Resolved |
| **INC-04** | Certificate System | Browser timestamps and URL headers appearing on PDF export | Implemented CSS `@media print` rules suppressing browser chrome | Resolved |
| **INC-05** | Authentication | Vulnerability to disposable temporary burner emails | Integrated 60+ domain blocklist and mandatory Google GIS OAuth | Resolved |

---

## 7. Post-Launch Operational Maintenance & Future Roadmap

### 7.1 Monitoring & Continuous Integration

* **Continuous Deployment:** Git commits pushed to `main` trigger automated builds on Vercel's edge network with instantaneous rollout upon build passage.
* **Database Health Monitoring:** MongoDB Atlas cluster telemetry monitors connection counts, query execution times, and document indexing metrics.
* **Error Tracking:** Client-side error boundaries prevent cascading UI failures and guide users to fallback routes if unexpected exceptions occur.

### 7.2 Post-Launch Feature Roadmap

* **Phase 2.1: SMS Gateway Integration:** Implement two-way SMS dispatch for urgent blood donor mobilizations in areas with limited mobile data coverage.
* **Phase 2.2: Offline Progressive Web App (PWA):** Enable service-worker caching for venue QR scanning and attendance logging in remote rural relief zones.
* **Phase 2.3: Institutional API Connectors:** Provide automated transcript verification webhooks allowing universities to ingest verified community service hours directly into student academic records.

---

```text
========================================================================================
                             END OF PROJECT EXECUTION PLAN
                              KINDCONNECT ENGINEERING TEAM
                      Department of Computer Science & Engineering
                            Metropolitan University, Sylhet
========================================================================================
```
