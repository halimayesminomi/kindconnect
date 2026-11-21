# KindConnect: System Changelog & Version Release History

All notable changes to the **KindConnect** platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning (SemVer 2.0.0)](https://semver.org/spec/v2.0.0.html).

---

## Document Metadata

| Field | Description |
| :--- | :--- |
| **System Document** | Formal Version Release Log, Feature Additions & Bug Fix History (`changelog.md`) |
| **Project Title** | KindConnect: A Modern Full-Stack Community Engagement & Grassroots Volunteer Management Platform |
| **Academic Course** | Web Programming Lab (Course Code: CSE 323) |
| **Academic Institution** | Department of Computer Science & Engineering, Metropolitan University, Sylhet |
| **Course Instructor** | Mr. Abu Jafar Md. Jakaria, Lecturer, Department of Computer Science & Engineering |
| **Lead Builder & Platform Admin** | Halima Yesmin Omi (Student ID: 251-112-001) — Platform Admin & Full-Stack Architect |
| **Co-Developer & QA Specialist** | Shraboni Das (Student ID: 251-112-006) — Quality Assurance & Testing Specialist |
| **AI Agent Ecosystem** | Google Antigravity Agent Framework (Multi-Agent Swarm) |
| **Academic Cohort** | 36th (Evening) Batch, Department of CSE |
| **Documentation Date** | November 2026 |
| **Current Stable Version** | Production Release v2.0.0 |
| **Source Repository** | [github.com/halimayesminomi/kindconnect](https://github.com/halimayesminomi/kindconnect.git) |
| **Live Production URL** | [kindconnect-7hc1.vercel.app](https://kindconnect-7hc1.vercel.app) |

---

## Table of Contents

- [1. Version Release Summary](#1-version-release-summary)
- [2. Detailed Release Changelogs](#2-detailed-release-changelogs)
  - [Version 2.0.0 — Production Hardening & Documentation (2026-11-21)](#version-200--production-hardening--documentation-2026-11-21)
  - [Version 1.5.0 — Chat Data Isolation & Security Hardening (2026-11-04)](#version-150--chat-data-isolation--security-hardening-2026-11-04)
  - [Version 1.2.0 — Serverless REST Gateway & Bilingual Engine (2026-11-03)](#version-120--serverless-rest-gateway--bilingual-engine-2026-11-03)
  - [Version 1.0.0 — Core Platform & Presentation Release (2026-11-01)](#version-100--core-platform--presentation-release-2026-11-01)
  - [Version 0.5.0 — Architectural Inception & Prototyping (2026-10-25)](#version-050--architectural-inception--prototyping-2026-10-25)
- [3. Historical Forensic Defect Resolution Register](#3-historical-forensic-defect-resolution-register)
- [4. Route & Subsystem Evolution Matrix](#4-route--subsystem-evolution-matrix)
- [5. Contributor Attribution & Academic Verification](#5-contributor-attribution--academic-verification)

---

## 1. Version Release Summary

```text
+-----------------------------------------------------------------------------------------+
|                              KINDCONNECT RELEASE TIMELINE                               |
|                                                                                         |
|  v0.5.0  [Oct 2026] --> Initial Prototype, Express Backend & Core Mongoose Schemas     |
|  v1.0.0  [Nov 2026] --> Core Full-Stack Launch, 1000-Pt Certificates & Admin Center     |
|  v1.2.0  [Nov 2026] --> Serverless Catch-All API, Bilingual Toggle & Map Explorer       |
|  v1.5.0  [Nov 2026] --> Chat Multi-Tenant Isolation, Google GIS Auth & High-Contrast    |
|  v2.0.0  [Nov 2026] --> Production Hardening, Zero-Hydration Fix, Clean Print & Docs   |
+-----------------------------------------------------------------------------------------+
```

| Version | Release Date | Target Environment | Key Milestone | Git Commit Range |
| :--- | :--- | :--- | :--- | :--- |
| **v2.0.0** | 2026-11-21 | Production (Vercel Edge) | Zero-defect production hardening, clean print CSS, dynamic welcome messages, and comprehensive documentation suite (`AI_WORKFLOW.md`, `plan.md`, `architecture.md`, `agent.md`, `tasks.md`, `changelog.md`). | `87d906f` -> `65a614f` |
| **v1.5.0** | 2026-11-04 | Staging / Pre-Release | Multi-tenant chat isolation, server-side Google GIS token validation, high-contrast dark/light typography, and mobile profile picture upload. | `a1e3f27` -> `a64f43c` |
| **v1.2.0** | 2026-11-03 | Staging | Serverless catch-all REST API (`api/[...route]`), client relative routing, nationwide Bangladesh map explorer, and bilingual English/Bangla switch. | `f6e8682` -> `43c6aab` |
| **v1.0.0** | 2026-11-01 | Lab Evaluation | Full volunteer lifecycle, 1,000-point honors gamification, dynamic QR attendance scanner, and administrative management console. | `c84449c` -> `0c8c18f` |
| **v0.5.0** | 2026-10-25 | Local Dev | Initial Next.js 15 App Router scaffolding, Express 5 server prototype, and MongoDB Atlas connection schema models. | Initial Scaffolding |

---

## 2. Detailed Release Changelogs

### Version 2.0.0 — Production Hardening & Documentation (2026-11-21)

#### Added
* **Dynamic Personalized User Greetings (`commit 87e1946`):** Implemented dynamic first-name interpolation for automated welcome messages across registration, Google OAuth onboarding, and admin direct chat.
* **Tamper-Evident QR Verification on Certificates (`commit 6124225`):** Embedded dynamic verification QR codes on institutional certificates with unique credential identifiers and live verification routes.
* **Event Certificates Modal (`commit 6124225`):** Added interactive modal allowing organizers and volunteers to inspect and review awarded event certificates.
* **Formal Documentation Suite (`commits 1509659, cd4cd5a, cad8aaa, ac06641, 65a614f`):** Added complete technical specifications:
  * `ai-workflow/AI_WORKFLOW.md`: AI-assisted engineering methodology, forensic case studies, and strict operating rules.
  * `plan/plan.md`: Software project plan, WBS, sprint schedules, and risk management strategies.
  * `architecture/architecture.md`: 4-tier client-server architecture, database schemas, and REST gateway specifications.
  * `agent/agent.md`: Multi-agent system architecture, subagent contracts, and tool capability matrices.
  * `tasks/tasks.md`: Comprehensive 48-task WBS, defect tracking matrix, and route compilation audit.

#### Changed
* **Client-Side Hydration Safety (`commit 87d906f`):** Wrapped `useSearchParams()` across all client pages in React `<Suspense>` boundaries; added `isMounted` state flags to defer browser-only rendering until client hydration completes.
* **Bilingual Terminology Polish (`commit 18bc356`):** Standardized institutional Bengali translations across emergency relief, certificate generation, and navigation components.

#### Fixed
* **Multi-Tenant Chat Data Isolation (`commit 316f321`):** Resolved chat cross-talk vulnerability where admin support messages leaked to other users. Enforced deterministic compound conversation keys `[senderId, recipientId].sort().join("_")` and gated group rooms to registered participants.
* **Polymorphic BSON Query Resolution (`commit 316f321`):** Introduced `toIdVariants()` helper resolving Mongoose query failures caused by string vs. BSON `ObjectId` mismatches.
* **Browser Print Watermark & Timestamp Elimination (`commit 57ffa5a`):** Engineered dedicated `@media print` CSS engine with `@page { margin: 0; }`, isolating `#printable-certificate` and suppressing browser URL headers, footers, and timestamps.
* **Legacy Database Greeting Migration:** Authored and executed an automated MongoDB Atlas migration script updating legacy seed data ("Sadia") to authentic user names.

#### Security
* **Strict Support Room Tenant Isolation (`commit 316f321`):** Enforced authorization checks on all direct chat query routes: non-admin users are strictly restricted to querying conversations matching their own ID.
* **Registration Gating on Event Chat:** Blocked non-registered users from viewing or dispatching messages to private event group discussion channels.

---

### Version 1.5.0 — Chat Data Isolation & Security Hardening (2026-11-04)

#### Added
* **Admin User Profile Inspector (`commit 69026bb`):** Added interactive modal in admin dashboard allowing platform administrators to inspect detailed volunteer bios, contact numbers, and participation histories.
* **Client-Side Profile Photo Upload (`commit 69026bb`):** Implemented client-side image file picker supporting gallery uploads on mobile and local file selection on laptops.
* **High-Resolution Architecture Diagrams (`commit a64f43c`):** Integrated updated vector SVG and PNG architecture and Data Flow Diagrams (DFD) illustrating 4-tier system interactions.

#### Changed
* **High-Contrast Dark & Light Mode Typography (`commit 5605cd4`):** Overhauled Tailwind typography classes across all cards and modal dialogs to ensure WCAG AAA compliant contrast ratios in both themes.
* **Admin Credential Hardening (`commit b134022`):** Removed demo shortcuts and automatic admin elevation; locked primary admin credentials to `omi` / `Omi@2026`.

#### Fixed
* **Chat Message Persistence (`commit be72712`):** Corrected Mongoose save pipelines to guarantee instant persistence of incoming messages and real-time counter updates.
* **Mobile Responsive Chat Viewport (`commit c7a2ae8`):** Fixed layout overflow issues on small screens, ensuring message composer remains pinned above mobile software keyboards.

#### Security
* **Anti-Fraud Google Identity Verification (`commit 42eabf7`):** Enforced server-side Google GIS token verification against Google UserInfo API, blocking fake Gmail inputs and unauthenticated registration attempts.
* **Disposable & Fake Email Rejection (`commit aa2f8e8`):** Implemented algorithmic regex filtering to reject disposable domain extensions (`mailinator.com`, `tempmail.com`, `10minutemail.com`) during registration.

---

### Version 1.2.0 — Serverless REST Gateway & Bilingual Engine (2026-11-03)

#### Added
* **Serverless Catch-All API Gateway (`commit d0d0669`):** Unified Express backend routes into Next.js 15 App Router serverless catch-all route at `src/app/api/[...route]/route.js`.
* **Mongoose Connection Pooling:** Implemented `global.mongoose` connection caching to prevent connection exhaustion on MongoDB Atlas during Vercel serverless container scaling.
* **Nationwide Bangladesh Map Explorer (`commit 834fb52`):** Built interactive map explorer featuring quick location presets for all 8 administrative divisions of Bangladesh, with specialized focus on Sylhet division.
* **Bilingual English ↔ বাংলা Language Toggle (`commit 18bc356`):** Introduced global site provider with instant, zero-reload language switching across all client pages.

#### Changed
* **Relative URL Client Routing (`commit 43c6aab`):** Replaced hardcoded localhost:5000 API calls with relative `/api/...` endpoints, eliminating cross-origin errors in production.
* **Streamlined Logged-In Navigation (`commit 6140948`):** Refactored top navigation bar into a clean user avatar dropdown menu displaying user role, points badge, and profile shortcuts.

#### Fixed
* **React Render-Phase State Update Exception (`commit 1be6b0b`):** Relocated `router.push()` calls in Login and Register components into `useEffect()` hooks to eliminate render-phase update warnings.
* **Theme Synchronization Glitch (`commit 16355ff`):** Resolved flash-of-unstyled-theme bug on initial page load by storing theme preference in `localStorage` and synchronizing on mount.

---

### Version 1.0.0 — Core Platform & Presentation Release (2026-11-01)

#### Added
* **1,000-Point Honor Gamification Engine (`commit 0c8c18f`):** Automated point accumulation (+100 pts per verified attendance, +50 pts per relief action) with Bronze, Silver, Gold, and Platinum Honor Guard tiers.
* **Auto-Generated Certificates (`commit 0c8c18f`):** Automated generation of institutional Certificates of Service upon reaching volunteer milestones.
* **Venue QR Attendance Engine:** Integrated cryptographic QR code generation and mobile camera scanner for in-venue volunteer attendance verification.
* **Two-Tier Real-Time Chat Engine (`commit 3823098`):** Built event group chat rooms and 1-on-1 direct admin support messaging with HTML5 Web Audio API chime notifications.
* **Administrative Governance Center (`commit 69e0988`):** Comprehensive admin console for user role moderation, event lifecycle approvals, and citizen relief dispatch.
* **Google OAuth 2.0 Select Account Chooser (`commit 0405065, 97c0c3f`):** Integrated Google Identity Services SDK allowing volunteers to authenticate using genuine Google accounts.
* **Event Capacity Waiting List (`commit 9ae6469`):** Implemented automated waitlist queue with automated spot promotion upon registration cancellation.

#### Changed
* **Academic Branding Update (`commit 69e73b2`):** Configured institutional branding for the Department of CSE, Metropolitan University, Sylhet (36th Evening Batch), crediting Halima Yesmin Omi as Lead Builder.

---

### Version 0.5.0 — Architectural Inception & Prototyping (2026-10-25)

#### Added
* Initial Next.js 15 App Router project scaffolding with Tailwind CSS.
* Core Mongoose schema definitions: `User`, `Event`, `Registration`, `Attendance`, `Message`, and `EmergencyRequest`.
* Express.js 5 REST backend prototype with Bcrypt password encryption.
* Basic public landing page, event catalog, and registration views.

---

## 3. Historical Forensic Defect Resolution Register

| Defect Identifier | Severity | Discovery Phase | Trigger Condition | Forensic Correction | Verification Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`DEF-01: Hydration Mismatch`** | Critical | Sprint 8 | React Error #418/#423 on Vercel Edge. | Wrapped `useSearchParams()` in `<Suspense>`; added `isMounted` state guards. | Zero console hydration warnings across all 22 routes. |
| **`DEF-02: Chat Data Cross-Talk`** | Critical | Sprint 8 | Admin direct messages displayed in unauthorized sessions. | Implemented `toIdVariants()` and compound conversation keys `[u1, u2].sort().join("_")`. | 100% tenant isolation verified across concurrent sessions. |
| **`DEF-03: Hardcoded Greeting`** | High | Sprint 7 | Registered users received static greeting ("Hello Sadia!"). | Executed automated MongoDB Atlas data migration; implemented dynamic user name interpolation. | Authentic name dynamically interpolated across all channels. |
| **`DEF-04: Print CSS Distortion`** | High | Sprint 7 | PDF certificates included browser URL headers and timestamps. | Injected `@media print` rules with `@page { margin: 0; }` isolating `#printable-certificate`. | Clean, vector-sharp PDF export without browser watermarks. |
| **`DEF-05: Serverless Socket Exhaustion`**| Medium | Sprint 6 | Rapid concurrent API calls caused Atlas connection timeouts. | Integrated Mongoose connection caching (`global.mongoose`) reusing warm sockets. | Connection pool stabilized at $\le 10$ sockets on edge instances. |

---

## 4. Route & Subsystem Evolution Matrix

| Route Path | Subsystem | Inception Version | Stable Release | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Presentation & Interaction | v0.5.0 | v2.0.0 | **Production Live** |
| `/about` | Institutional Information | v0.5.0 | v2.0.0 | **Production Live** |
| `/admin` | Administrative Governance | v1.0.0 | v2.0.0 | **Production Live** |
| `/api/[...route]` | Serverless REST Gateway | v1.2.0 | v2.0.0 | **Production Live** |
| `/dashboard` | Volunteer Dashboard | v0.5.0 | v2.0.0 | **Production Live** |
| `/dashboard/attendance` | QR Attendance Engine | v1.0.0 | v2.0.0 | **Production Live** |
| `/dashboard/certificates` | 1000-Point QR Certification | v1.0.0 | v2.0.0 | **Production Live** |
| `/dashboard/chat` | Two-Tier Real-Time Chat | v1.0.0 | v2.0.0 | **Production Live** |
| `/dashboard/create-event` | Event Lifecycle Management | v0.5.0 | v2.0.0 | **Production Live** |
| `/dashboard/events` | Organizer Console | v0.5.0 | v2.0.0 | **Production Live** |
| `/dashboard/joined` | Volunteer Participation History | v1.0.0 | v2.0.0 | **Production Live** |
| `/dashboard/profile` | Volunteer Profile Management | v1.0.0 | v2.0.0 | **Production Live** |
| `/dashboard/update-event/[id]` | Event Lifecycle Management | v0.5.0 | v2.0.0 | **Production Live** |
| `/emergency` | Citizen Relief & Image Compression | v1.0.0 | v2.0.0 | **Production Live** |
| `/events` | Event Discovery & Geo-Search | v0.5.0 | v2.0.0 | **Production Live** |
| `/events/[id]` | Event Details & Registration | v0.5.0 | v2.0.0 | **Production Live** |
| `/impact` | Community Analytics Hub | v1.0.0 | v2.0.0 | **Production Live** |
| `/leaderboard` | Gamification Rankings | v1.0.0 | v2.0.0 | **Production Live** |
| `/login` | Authentication & Google GIS | v0.5.0 | v2.0.0 | **Production Live** |
| `/organizer` | Organizer Operations Hub | v1.0.0 | v2.0.0 | **Production Live** |
| `/profile` | Public User Profile | v1.0.0 | v2.0.0 | **Production Live** |
| `/register` | Registration & Role Onboarding | v0.5.0 | v2.0.0 | **Production Live** |

---

## 5. Contributor Attribution & Academic Verification

* **Halima Yesmin Omi (Student ID: 251-112-001):**
  * Lead Full-Stack Architect & Platform Administrator.
  * System architecture design, database schema modeling, serverless catch-all gateway implementation, admin governance center, and final deployment approval.
* **Shraboni Das (Student ID: 251-112-006):**
  * Co-Developer & Quality Assurance Specialist.
  * Frontend component development, cross-browser QA, client-side hydration guard validation, clean print CSS testing, and accessibility verification.
* **Google Antigravity AI Agent Ecosystem:**
  * Autonomous full-stack pair engineering partner.
  * AST indexing, route gateway synthesis, forensic bug tracing, data migration script generation, and comprehensive technical documentation.
* **Academic Submission:**
  * Course: Web Programming Lab (CSE 323).
  * Academic Supervisor: Mr. Abu Jafar Md. Jakaria, Lecturer, Department of Computer Science & Engineering, Metropolitan University, Sylhet.

---

```text
========================================================================================
                          END OF CHANGELOG SPECIFICATION
                            KINDCONNECT ENGINEERING TEAM
                    Department of Computer Science & Engineering
                          Metropolitan University, Sylhet
========================================================================================
```
