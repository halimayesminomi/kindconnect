# How This Team Uses AI (Google Antigravity) to Build KindConnect — Fast but Never Careless. AI Writes Code With Us; Humans Own What Ships.

---

## Document Metadata

| Field | Description |
| :--- | :--- |
| **Project Title** | **KindConnect**: A Modern Full-Stack Community Engagement & Grassroots Volunteer Management Platform |
| **Academic Course** | Web Programming Lab (Course Code: **CSE 323**) |
| **Academic Institution** | Department of Computer Science & Engineering, **Metropolitan University, Sylhet** |
| **Course Instructor** | **Mr. Abu Jafar Md. Jakaria**, Lecturer, Department of Computer Science & Engineering |
| **Lead Builder & Admin** | **Halima Yesmin Omi** (Student ID: `251-112-001`) — Platform Admin & Full-Stack Architect |
| **Co-Developer & QA** | **Shraboni Das** (Student ID: `251-112-006`) — Quality Assurance Specialist |
| **Academic Cohort** | 36th (Evening) Batch, Department of CSE |
| **Date of Documentation** | November 2026 |
| **Version** | Production Release v1.0.0 |
| **Source Repository** | [github.com/halimayesminomi/kindconnect](https://github.com/halimayesminomi/kindconnect.git) |
| **Live Production URL** | [kindconnect-7hc1.vercel.app](https://kindconnect-7hc1.vercel.app) |

---

## Table of Contents

- [1. Executive Summary & Core Engineering Philosophy](#1-executive-summary--core-engineering-philosophy)
  - [1.1 Guiding Principle: Fast but Never Careless](#11-guiding-principle-fast-but-never-careless)
  - [1.2 The Human-in-the-Loop Collaboration Paradigm](#12-the-human-in-the-loop-collaboration-paradigm)
- [2. System Architecture & Technical Stack Specification](#2-system-architecture--technical-stack-specification)
  - [2.1 4-Tier Client-Server Architectural Pattern](#21-4-tier-client-server-architectural-pattern)
  - [2.2 Comprehensive Technology Stack](#22-comprehensive-technology-stack)
- [3. End-to-End AI Engineering Lifecycle](#3-end-to-end-ai-engineering-lifecycle)
  - [Phase 1: Problem Formulation, Proposal & Architectural Modeling](#phase-1-problem-formulation-proposal--architectural-modeling)
  - [Phase 2: Tech Stack Selection & Project Scaffolding](#phase-2-tech-stack-selection--project-scaffolding)
  - [Phase 3: Anti-Fraud Authentication & Security Architecture](#phase-3-anti-fraud-authentication--security-architecture)
  - [Phase 4: Core Module Implementation & Real-Time Engine](#phase-4-core-module-implementation--real-time-engine)
  - [Phase 5: Forensic Case Study I — Real-Time Chat Privacy & Multi-Tenant Isolation](#phase-5-forensic-case-study-i--real-time-chat-privacy--multi-tenant-isolation)
  - [Phase 6: Forensic Case Study II — Dynamic Personalization & Database Cleansing](#phase-6-forensic-case-study-ii--dynamic-personalization--database-cleansing)
  - [Phase 7: Forensic Case Study III — Certificate Personalization & Clean PDF Export](#phase-7-forensic-case-study-iii--certificate-personalization--clean-pdf-export)
  - [Phase 8: Forensic Case Study IV — Cloud Incident Response & Hydration Debugging](#phase-8-forensic-case-study-iv--cloud-incident-response--hydration-debugging)
- [4. AI Tooling, Prompts & Multi-Agent Collaboration Matrix](#4-ai-tooling-prompts--multi-agent-collaboration-matrix)
  - [4.1 Tool-Calling Architecture](#41-tool-calling-architecture)
  - [4.2 The Scratch-File Isolation Pattern](#42-the-scratch-file-isolation-pattern)
- [5. Engineering Incident Log & Production Metrics](#5-engineering-incident-log--production-metrics)
  - [5.1 Incident & Resolution Summary Table](#51-incident--resolution-summary-table)
  - [5.2 Production Route Coverage](#52-production-route-coverage)
- [6. Ethical Considerations, Security Governance & Academic Ownership](#6-ethical-considerations-security-governance--academic-ownership)
  - [6.1 Academic Integrity & Human Ownership](#61-academic-integrity--human-ownership)
  - [6.2 Security Posture & Credential Handling](#62-security-posture--credential-handling)
  - [6.3 Pedagogical Value for Undergraduate Engineers](#63-pedagogical-value-for-undergraduate-engineers)

---

## 1. Executive Summary & Core Engineering Philosophy

### 1.1 Guiding Principle: Fast but Never Careless

> [!IMPORTANT]
> **"How This Team Uses AI (Google Antigravity) to Build KindConnect — Fast but Never Careless. AI Writes Code With Us; Humans Own What Ships."**

The development of **KindConnect** was driven by the recognition that modern AI assistance can dramatically accelerate the software development lifecycle (SDLC), but only when anchored by rigorous human engineering governance. Rather than using AI as an uninspected black box, the engineering team—led by **Halima Yesmin Omi** and **Shraboni Das**—utilized **Google Antigravity** as an active pair programmer, system architect, diagnostic investigator, and automated refactoring engine.

Every algorithm, database schema, route handler, and security constraint was conceived through human domain specifications, synthesized collaboratively with AI, and audited through local testing, database queries, and static compilation before deploying to production.

### 1.2 The Human-in-the-Loop Collaboration Paradigm

The engineering relationship between the student engineers and Google Antigravity maintained clear boundaries of ownership:

```
+-----------------------------------------------------------------------------------------+
|                                HUMAN-AI GOVERNANCE MODEL                                |
+-----------------------------------------------------------------------------------------+
|  HUMAN RESPONSIBILITIES (Omi & Shraboni)         AI RESPONSIBILITIES (Antigravity)      |
|  ---------------------------------------         ---------------------------------      |
|  - Real-world problem definition (Sylhet floods) - High-throughput code synthesis       |
|  - Domain rules & business constraints           - Multi-tier system architecture DFDs  |
|  - Security & privacy policy decisions           - Regex & burner-domain filter logic   |
|  - Final manual QA and code review approval      - Root-cause forensic trace analysis   |
|  - Production deployment gating to Vercel        - Database migration script execution  |
+-----------------------------------------------------------------------------------------+
```

---

## 2. System Architecture & Technical Stack Specification

### 2.1 4-Tier Client-Server Architectural Pattern

KindConnect follows an enterprise-grade **4-Tier Client-Server Architecture** designed for high throughput, serverless execution, and multi-tenant data isolation:

```
[ Tier 1: Presentation & Interaction ]
  - Next.js 15 App Router | React 19 Client Components
  - Tailwind CSS UI Framework | Lucide Vector Icons
  - HTML5 Web Audio API Harmonic Synthesizer (587 Hz -> 880 Hz)
  - HTML5 Canvas Client-Side Base64 Image Compression
         |
         v (HTTPS / REST JSON / OAuth 2.0 GIS Bearer)
[ Tier 2: External Security & Geo-Spatial Gateway ]
  - Google Identity Services (GIS) OAuth 2.0 UserInfo API
  - OpenStreetMap Nominatim Geo-Coding Tile Servers
         |
         v (Serverless Request Context / Bearer Verification)
[ Tier 3: Application Logic & REST API Gateway ]
  - Next.js Serverless Route Controller (/api/[...route]/route.js)
  - JWT Session Lifecycle & Role-Based Access Control (RBAC)
  - Bcrypt Key Derivation (Cost Factor: 10)
  - In-Memory Regex Engine (60+ Burner Domain Blocklist)
         |
         v (Mongoose 8.x ODM Connection Pool)
[ Tier 4: Cloud Data Persistence ]
  - MongoDB Atlas Cloud Cluster
  - Collections: users, events, registrations, attendance, messages, emergencyrequests
```

### 2.2 Comprehensive Technology Stack

| Architecture Layer | Technology / Library | Version | Engineering Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js (App Router) | `15.5.28` | Production server-side rendering (SSR), optimized bundle splitting, and integrated serverless routing. |
| **UI Library** | React | `19.0.0` | Latest concurrent rendering primitives, action hooks, and optimized component lifecycles. |
| **Styling & Icons** | Tailwind CSS / Lucide React | `3.4.x` / `0.4x` | Utility-first responsive design, WCAG AAA contrast compliance, and lightweight scalable vector icons. |
| **Persistence ODM** | Mongoose | `8.x` | Strongly typed object modeling, schema validation, middleware hooks, and compound index querying. |
| **Cloud Database** | MongoDB Atlas | AWS Cluster | High availability, scalable document storage, and multi-region JSON data persistence. |
| **Security & Hashing** | JSON Web Tokens / Bcrypt.js | `9.x` / `2.4.x` | Stateless, tamper-resistant authorization tokens and salted credential encryption. |
| **External Auth** | Google Identity Services (GIS) | OAuth 2.0 | Mandatory verification against Google servers to prevent disposable email registration. |
| **Audio Synthesizer** | HTML5 Web Audio API | Native Browser | In-browser sine-wave audio chimes without external MP3 dependencies or network latency. |
| **Hosting & CI/CD** | Vercel Cloud Platform | Edge Network | Automatic Git-driven CI/CD deployment with edge CDN caching and zero-downtime rollouts. |

---

## 3. End-to-End AI Engineering Lifecycle

### Phase 1: Problem Formulation, Proposal & Architectural Modeling

#### 1. Context & Motivation
Humanitarian volunteering and grassroots crisis response in Bangladesh (such as flood relief operations in Sylhet, emergency blood donation appeals, and winter blanket distributions) face severe coordination voids. Community organizations encounter:
* **Ghost registrations** from unverified social media links.
* **Attendance fraud** at physical relief sites due to paper-based logs.
* **Delayed citizen responses** during acute emergencies.
* **Absence of verifiable recognition** for student volunteers.

#### 2. Collaborative Engineering Steps
* **Formal Proposal Synthesis:** The team supplied the real-world operational criteria, and AI structured the formal project proposal matching Metropolitan University CSE 323 specifications.
* **Diagrammatic Architecture:** AI drafted comprehensive Mermaid code representing the system architecture, entity relationships, and dual Data Flow Diagrams (DFD Level 0 context diagram and DFD Level 1 functional decomposition).
* **Asset Vectorization:** The diagrams were programmatically rendered into high-resolution SVG and PNG formats, incorporated directly into both academic documentation and project deliverables.

---

### Phase 2: Tech Stack Selection & Project Scaffolding

#### 1. Trade-Off Evaluation
The team analyzed two architectural paradigms:
1. **Decoupled Architecture:** Separate Express.js server + standalone Next.js frontend.
2. **Unified Monorepo:** Next.js 15 App Router housing both React 19 UI and serverless route handlers.

> [!NOTE]
> **Engineering Decision:** The unified architecture was selected. Consolidating API routes inside `src/app/api/[...route]/route.js` eliminated cross-origin resource sharing (CORS) complications, streamlined environment variable management, and minimized cold-start penalties when deployed to Vercel's edge network.

#### 2. Scaffolding Highlights
* Scaffolded 22 distinct route segments covering public landing, authentication, event management, administrative governance, certificates, and live chat.
* Established an adaptive MongoDB Atlas connection handler ensuring persistent connection reuse across serverless function invocations without exhausting cloud database connection pools.

---

### Phase 3: Anti-Fraud Authentication & Security Architecture

#### 1. The Challenge of Disposable Accounts
Open volunteer platforms frequently suffer from automated bot spam, disposable burner email registrations, and troll accounts that corrupt operational logistics.

#### 2. Dual-Layer Security Defense Implemented

```javascript
// Layer 1: In-Memory Algorithmic Burner Domain Elimination
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com", "tempmail.com", "10minutemail.com", "guerrillamail.com",
  "trashmail.com", "sharklasers.com", "yopmail.com", "getairmail.com"
  // ... 60+ verified disposable domains
]);

function validateRealEmail(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain || DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return { isValid: false, error: "Disposable email addresses are strictly prohibited." };
  }
  return { isValid: true };
}
```

* **Layer 2: Mandatory Google GIS OAuth 2.0 Real-Time Verification:**
  During account creation, the client retrieves an authentic OAuth token from Google Identity Services. The backend validates this token directly against Google's UserInfo API (`https://www.googleapis.com/oauth2/v3/userinfo`).
  
> [!SECURITY]
> **Enforced Identity Invariant:** An account is rejected if the email supplied in the registration payload does not exactly match the authenticated Google email returned by Google's secure server.

* **Layer 3: Role-Based Access Control (RBAC):**
  Users are strictly partitioned into three roles:
  * `user`: Standard volunteer with access to discovery, QR check-in, certificates, and direct support.
  * `organizer`: Verified community leader authorized to publish and manage local events.
  * `admin`: Platform Administrator (**Halima Yesmin Omi**) possessing complete system oversight.

---

### Phase 4: Core Module Implementation & Real-Time Engine

1. **Event Lifecycle & Dynamic Discovery (`/events` & `/dashboard/events`):**
   * Real-time seat capacity counters decrementing automatically upon registration.
   * Multi-criteria category filtering (Disaster Relief, Education, Healthcare, Environment).
   * Visual indicators differentiating Upcoming, Ongoing, and Completed initiatives.
2. **Cryptographic Venue Attendance Engine (`/dashboard/attendance`):**
   * Organizers project a dynamic venue check-in token (`KC-XXXX-YYYYMMDD`).
   * Upon scanning or entry, the backend performs single-use verification, awarding +100 impact points and incrementing verified volunteer hours in the cloud collection.
3. **Citizen Emergency Relief Hub (`/emergency`):**
   * Rapid-response intake for urgent blood requests and disaster supplies.
   * Direct responder matching with one-click telephonic connection to coordinators.
4. **Administrative Governance Center (`/admin`):**
   * Secured explicitly for Lead Builder **Halima Yesmin Omi** (`omi` / `Omi@2026`).
   * Real-time user management modal facilitating deep profile inspection, event moderation, and role elevation.
5. **Acoustic Audio Notification Engine:**
   * Utilizes the HTML5 Web Audio API to synthesize a dual-frequency sine chime (587.33 Hz [D5] ramping to 880 Hz [A5]) on new message delivery, avoiding bulky audio file network downloads.

---

### Phase 5: Forensic Case Study I — Real-Time Chat Privacy & Multi-Tenant Isolation

#### 1. Incident Description
During multi-device integration testing across mobile and desktop browsers, testing revealed a critical data leak: 1-on-1 direct support messages between volunteers and Admin Omi leaked into conversations of other volunteers. Simultaneously, event group rooms allowed non-registered users to read private volunteer coordination messages.

#### 2. Forensic Investigation & Root-Cause Analysis
AI-assisted scratch diagnostics against MongoDB Atlas isolated three fundamental flaws:

```
Root Cause Analysis:
1. BSON Type Discrepancy: Database queries checked string IDs against fields stored
   as BSON ObjectId instances, resulting in erratic $or filter matching.
2. Unscoped Query Criteria: Messages were fetched via loose queries without compound
   conversation hash keys, allowing overlapping IDs to return unintended documents.
3. Missing Event Authorization: Group message endpoints lacked membership verification.
```

#### 3. Engineering Resolution

* **Deterministic Bidirectional Conversation Hashing:**
  ```javascript
  // Guarantees identical conversation ID regardless of whether sender or recipient initiates
  const conversationId = [senderId.toString(), recipientId.toString()].sort().join("_");
  ```
* **BSON Type-Safe Query Expander (`toIdVariants`):**
  Engineered a conversion utility that transforms any identifier into an array containing both its string representation and its valid `mongoose.Types.ObjectId` instance:
  ```javascript
  function toIdVariants(id) {
    if (!id) return [];
    const str = id.toString();
    const variants = [str];
    if (mongoose.Types.ObjectId.isValid(str)) {
      try { variants.push(new mongoose.Types.ObjectId(str)); } catch (_) {}
    }
    return variants;
  }
  ```
* **Event Group Access Guard:**
  Enforced database verification requiring the user to hold an approved `Registration` record for the specific `eventId` before granting read or write permissions to the channel.

---

### Phase 6: Forensic Case Study II — Dynamic Personalization & Database Cleansing

#### 1. Incident Description
When regular volunteers (e.g., user *Halima Tanima*) navigated to their direct support chat with Platform Admin Omi, they encountered a hardcoded automated message:
> `"Hello Sadia! Welcome to KindConnect. You are assigned to team A."`

This occurred because early integration test runs had inserted a message with the recipient name hardcoded as "Sadia". The platform required that every volunteer receive an onboarding greeting addressing them dynamically by their authentic registered name.

#### 2. Engineering Resolution

1. **Targeted Database Cleansing Script:**
   The team wrote a Node.js migration script (`scratch/update_sadia_messages.js`) connecting directly to MongoDB Atlas. It identified all message documents containing `"Sadia"`, queried the associated recipient record in the `users` collection, and dynamically updated the text to:
   > `"Hello Halima Tanima! Welcome to KindConnect. You are assigned to team A."`
   A subsequent verification scan confirmed that zero erroneous hardcoded references remained in the database.

2. **Automated Dynamic Welcome Pipeline:**
   Integrated dynamic greeting generation into `POST /api/auth/register`, `POST /api/auth/google`, and `GET /api/chat/direct/admin`:
   ```javascript
   // Automatically greet new volunteers dynamically using their authentic registered name
   const recipientDisplayName = newUser.name ? newUser.name.trim() : "Volunteer";
   const defaultConvId = [newUser._id.toString(), primaryAdmin._id.toString()].sort().join("_");
   
   await Message.create({
     type: "direct",
     conversationId: defaultConvId,
     sender: primaryAdmin._id,
     senderName: primaryAdmin.name || "Halima Yesmin Omi",
     senderUsername: primaryAdmin.username || "omi",
     senderRole: "admin",
     senderDesignation: "Platform Admin & Lead Builder",
     recipient: newUser._id,
     recipientName: recipientDisplayName,
     text: `Hello ${recipientDisplayName}! Welcome to KindConnect. You are assigned to team A.`,
     read: false,
     readBy: [primaryAdmin._id.toString()]
   });
   ```

---

### Phase 7: Forensic Case Study III — Certificate Personalization & Clean PDF Export

#### 1. Incident Description
Upon reaching the 1,000-Point Milestone, volunteers generated their Presidential Certificate of Social Excellence. However, two issues occurred:
1. The certificate failed to reflect the candidate's authentic database name.
2. Using the browser's "Print / Save as PDF" command captured ugly browser margins, page URLs, header timestamps, and navigation sidebars.

#### 2. Engineering Resolution

* **Dynamic Credential Binding:**
  Dynamic binding of the authentic `candidateName`, academic credential ID (`KC-HONOR-HALI-131CA5-2026`), and a dynamic QR code scannable via smartphone camera to verify authenticity online.
* **Vector-Sharp Print Stylesheet:**
  Engineered specialized print CSS rules that hide all layout containers and enforce exact document sizing:
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
  This ensures that whether printed on physical cardstock or saved via PDF print drivers, the output is free of browser header clutter.

---

### Phase 8: Forensic Case Study IV — Cloud Incident Response & Hydration Debugging

#### 1. Incident Description
Immediately following an initial deployment to Vercel, client browsers visiting `https://kindconnect-7hc1.vercel.app` displayed:
> `Application error: a client-side exception has occurred while loading kindconnect-7hc1.vercel.app (see the browser console for more information).`

#### 2. Forensic Investigation & Root-Cause Analysis
Analyzing Vercel runtime build logs and browser console stacks revealed two triggers:
1. **Hydration Mismatch:** Timestamps rendered via `toLocaleDateString()` produced different string outputs on Vercel's UTC runtime compared to the client's local Bangladesh Standard Time (BST, UTC+6).
2. **SSR LocalStorage Violation:** Code accessing `localStorage.getItem("token")` executed during initial server evaluation where `window` is undefined.

#### 3. Engineering Resolution
* Enforced safe hydration guards:
  ```javascript
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null; // Prevents SSR/CSR DOM structural mismatch
  ```
* Enclosed dynamic search parameter consumers (`useSearchParams()`) inside React `<Suspense>` boundaries as required by Next.js 15 production rules.
* Executed full local production compilation (`npm run build`), confirming that all 22 static and dynamic routes compiled with zero errors before redeploying.

---

## 4. AI Tooling, Prompts & Multi-Agent Collaboration Matrix

### 4.1 Tool-Calling Architecture

Google Antigravity operates through a deterministic tool-calling harness. The engineering team employed specific tools for distinct responsibilities:

| Tool Name | Operation Mode | Primary Engineering Responsibility |
| :--- | :--- | :--- |
| `read_file` | Read-only | Static code analysis, dependency verification, and schema inspection. |
| `edit_file` | Targeted rewrite | Precision contiguous code refactoring without introducing regressions. |
| `write_file` | File creation | Authoring isolated migration scripts, test harnesses, and documentation. |
| `run_command` | Sandboxed CLI | Executing `npm run build`, Git operations, and node diagnostics. |
| `manage_task` | Process control | Monitoring background compilation and managing long-running processes. |
| `invoke_subagent`| Specialized subagent | Delegating isolated codebase exploration and verification to subagents. |

### 4.2 The Scratch-File Isolation Pattern

When performing complex database operations, PowerShell terminal execution can inadvertently corrupt commands due to shell variable expansion (such as interpreting `$in` or `$or` as PowerShell variables).

> [!TIP]
> **Engineering Best Practice:** The team mandated the **Scratch-File Isolation Pattern**:
> 1. All diagnostic queries, database migrations, and one-off tests were written to temporary scripts inside the `scratch/` directory.
> 2. Scripts were executed directly using the Node.js runtime (`node scratch/script.js`).
> 3. Results were verified in structured JSON before committing permanent changes to application code.

---

## 5. Engineering Incident Log & Production Metrics

### 5.1 Incident & Resolution Summary Table

| Incident ID | Subsystem | Root Cause | AI-Assisted Resolution | Production Status |
| :--- | :--- | :--- | :--- | :--- |
| **INC-01** | Production Hosting | SSR Hydration mismatch and unwrapped `useSearchParams()` | Integrated `<Suspense>` boundaries and client mount guards | Resolved & Verified |
| **INC-02** | Real-Time Chat | Cross-account message leakage via loose BSON queries | Implemented `toIdVariants()` and bidirectional key hashing | Resolved & Verified |
| **INC-03** | Onboarding Chat | Hardcoded "Sadia" greeting in legacy database records | Executed MongoDB migration and added dynamic greeting pipeline | Resolved & Verified |
| **INC-04** | Certificate System | Browser timestamps and URL headers appearing on PDF export | Implemented CSS `@media print` rules suppressing browser chrome | Resolved & Verified |
| **INC-05** | Authentication | Vulnerability to disposable temporary burner emails | Integrated 60+ domain blocklist and mandatory Google GIS OAuth | Resolved & Verified |

### 5.2 Production Route Coverage

KindConnect provides complete test-verified coverage across **22 Production Routes**:

```
Route (Next.js 15 App Router)            Route Type    Authorization Level
---------------------------------------  ------------  ----------------------------------
/                                        Static        Public Access
/_not-found                              Static        Public Access
/about                                   Static        Public Access
/events                                  Static        Public Access
/events/[id]                             Dynamic       Public Access
/emergency                               Static        Public Access / Citizen Responders
/impact                                  Static        Public Access
/leaderboard                             Static        Public Access
/login                                   Static        Public (Unauthenticated)
/register                                Static        Public (Google GIS Verified)
/dashboard                               Static        Authenticated Volunteer
/dashboard/events                        Static        Authenticated Volunteer
/dashboard/joined                        Static        Authenticated Volunteer
/dashboard/attendance                    Static        Authenticated Volunteer
/dashboard/certificates                  Static        Authenticated Volunteer (1000 Pts)
/dashboard/chat                          Static        Authenticated Volunteer / Admin
/dashboard/profile                       Static        Authenticated Volunteer
/dashboard/create-event                  Static        Organizer / Admin Privileges
/dashboard/update-event/[id]             Dynamic       Organizer / Admin Privileges
/organizer                               Static        Organizer Role
/admin                                   Static        Platform Admin (Halima Yesmin Omi)
/api/[...route]                          Dynamic REST  Token-Verified Serverless Gateway
```

---

## 6. Ethical Considerations, Security Governance & Academic Ownership

### 6.1 Academic Integrity & Human Ownership

In strict compliance with the academic guidelines of **Metropolitan University, Sylhet**:
* **Intellectual Ownership:** All system requirements, user stories, architectural decisions, and visual aesthetics were conceived, evaluated, and verified by student engineers **Halima Yesmin Omi** and **Shraboni Das**.
* **Attribution of AI Tools:** The usage of Google Antigravity and Large Language Models has been transparently documented throughout this report, detailing the exact prompts, tools, and scripts used.
* **Independent Defense Readiness:** The development team maintains full mastery over the codebase and can independently explain, defend, and refactor any component of the application.

### 6.2 Security Posture & Credential Handling

* **Credential Encryption:** All passwords are salted and hashed using Bcrypt with a work factor of 10. Plaintext credentials are never persisted.
* **Ephemeral Token Handling:** Google OAuth tokens are verified ephemerally against Google's API and are never stored in plain text.
* **Role Verification:** Critical mutations (user role modifications, event deletions) require verified administrative JWT claims.

### 6.3 Pedagogical Value for Undergraduate Engineers

Engaging with AI in this structured, disciplined manner transformed the development of KindConnect into an advanced software engineering practicum. The team developed critical competencies in:
* Modern full-stack architecture design (Next.js 15, React 19, MongoDB Atlas).
* Complex asynchronous debugging and multi-tenant data isolation.
* Cloud-native deployment and real-time incident triage.
* Collaborative human-in-the-loop software engineering.

---

```
========================================================================================
                          END OF AI WORKFLOW SPECIFICATION
                           KINDCONNECT ENGINEERING TEAM
                   Department of Computer Science & Engineering
                         Metropolitan University, Sylhet
========================================================================================
```
