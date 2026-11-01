# KindConnect — Social Development & Volunteer Management Platform
> **Connect People, Create Impact.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.3-green?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-9.11-brightgreen?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

KindConnect is a full-stack, community-driven web platform designed to connect people with local social service activities across Bangladesh — including winter clothes distribution, neighborhood clean-ups, tree plantation drives, blood donation campaigns, and emergency relief.

---

## 🎓 Academic Project Assessment Details

- **Course**: Web Programming Lab (CSE 35+36)
- **Course Instructor**: Mr. Abu Jafar Md. Jakaria
- **Submission Date**: 06 November 2026
- **Team Members**:
  1. **Halima Yesmin Omi** — ID: `251-112-001`
  2. **Shraboni Das** — ID: `251-112-006`

---

## 🌟 Key Features

### 1. Authentication & Security
- **Email & Password Authentication**: Passwords hashed with `bcryptjs` (salt rounds: 10).
- **JWT Protection**: Secure API endpoints validated with JSON Web Tokens (`Authorization: Bearer <token>`).
- **Server-Side Ownership Enforcement**: Only event creators can modify or delete their events.
- **Conditional Navigation**: Dynamic navbar displaying login/register for visitors and profile avatar, name, and logout for authenticated users.

### 2. Event Management (Full CRUD)
- **Browse & Filter**: Real-time keyword search and category filtering (Environment, Education, Community, Health, Animals, Emergency). Past events excluded dynamically.
- **Event Details & Capacity**: Real-time progress bar showing volunteer spots filled versus total capacity. Prevents overcapacity registrations.
- **Create Event**: Authenticated users can organize events with title, description, category, thumbnail image URL, location, future date validation, time, and volunteer capacity.
- **Manage Events**: Creator dashboard table to view, edit, and delete events with SweetAlert2 confirmation dialogs.

### 3. Volunteer Participation & History
- **One-Click Event Joining**: Instant join with duplicate-registration prevention via compound MongoDB indexing `(eventId, userId)`.
- **Cancel Registration**: Easy cancelation of upcoming event registrations.
- **Joined Events History**: Chronological view of all past and upcoming registered community moments.

### 4. Advanced Modules
- **QR Code Attendance Station**:
  - Event organizers can display or project an official check-in QR code and unique code.
  - Volunteers check in via code or QR to verify physical attendance and earn **50 Impact Points**.
  - Duplicate check-in prevention and real-time attendee list for organizers.
- **Digital Verifiable Certificates & Badges**:
  - Unlocks milestone badges (First Event, Verified Volunteer, Impact Champion) based on live participation.
  - Generates official, formatted, and printable **Certificate of Community Service** with verification ID and blockchain/DB validation tag.
- **Community Impact Analytics (Recharts)**:
  - Monthly cumulative volunteer hours contributed (AreaChart with gradient fill).
  - Volunteers by cause distribution (BarChart).
  - Verified tangible outcome counters (4,250+ Trees Planted, 1,840+ Blankets Distributed, 6,700+ Meals Served, 3,120+ Books Shared).
- **Interactive OpenStreetMap Explorer**:
  - Grid View / Map Explorer toggle on the events catalog.
  - Interactive map embed with quick-filter pills for Dhaka hubs (Uttara, Mirpur, Banani, Dhanmondi, Bashundhara, Hatirjheel).
- **In-App Notification Center**:
  - Notification popover on topbar bell icon with real-time unread count.
  - Automated triggers on event registration confirmation and verified attendance points award.
- **Emergency Help & Community Relief Hub (`/emergency`)**:
  - Dedicated portal for urgent community needs (blood donation, blankets, flood relief, food rations).
  - Urgency indicators (Critical, High, Moderate) and direct coordinator contact information.
  - "Respond & Help" action for volunteers to join rapid response teams.
- **Multilingual Support (English & Bengali / বাংলা)**:
  - Topbar language toggle (`EN` / `বাং`) with dynamic dictionary translations.
- **Light & Dark Theme Toggle**:
  - System-wide CSS-based theme switcher.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | Next.js 15 (App Router) | React Server & Client Components, route-based pages |
| **Styling & UI** | Tailwind CSS 4, Custom CSS | Modern dark/light theme styling, responsive layouts |
| **Backend Framework** | Node.js, Express.js 5 | REST API server, business logic, auth middleware |
| **Database** | MongoDB Atlas, Mongoose 9 | Cloud database storage for users, events, attendance, etc. |
| **Authentication** | JWT, bcryptjs | Secure password hashing and token-based API access |
| **QR Code Engine** | `qrcode`, `qrcode.react` | Server & client QR generation for attendance check-ins |
| **Visual Charts** | Recharts 2 | Responsive area and bar charts for impact analytics |
| **Interactive Maps** | OpenStreetMap | Geolocation discovery and neighborhood filtering |
| **Feedback & Alerts** | react-hot-toast, SweetAlert2 | Polished in-app toast alerts and confirmation modals |

---

## 📁 Project Structure

```
kindconnect-ui/
├── public/                 # Static assets
├── server/                 # Express.js REST API Backend
│   ├── middleware/
│   │   └── auth.js         # JWT verification & admin role check
│   ├── models/
│   │   ├── User.js         # User schema with bcrypt
│   │   ├── Event.js        # Event schema with future date validation
│   │   ├── Registration.js # Compound unique index (eventId, userId)
│   │   ├── Attendance.js   # QR check-in & points tracking
│   │   ├── Notification.js # In-app notification schema
│   │   └── EmergencyRequest.js # Community relief requests
│   ├── routes/
│   │   ├── auth.js         # Register, login, user profile
│   │   ├── events.js       # CRUD with ownership security
│   │   ├── registrations.js# Join, cancel, attendees
│   │   ├── attendance.js   # QR code generation & check-in
│   │   ├── notifications.js# Notification retrieval & read state
│   │   └── emergency.js    # Relief requests & volunteer response
│   ├── .env                # Server environment variables
│   ├── package.json        # Server dependencies
│   └── server.js           # Server entry point
├── src/
│   ├── app/                # Next.js 15 App Router (19 Routes)
│   │   ├── page.js         # Homepage (hero, 6 dynamic events, gallery, newsletter)
│   │   ├── layout.js       # Root layout with providers
│   │   ├── globals.css     # Dark/light theme design system
│   │   ├── about/          # About story, values & course metadata
│   │   ├── events/         # Event catalog & OpenStreetMap explorer
│   │   │   └── [id]/       # Event details & participation triggers
│   │   ├── emergency/      # Emergency relief requests hub
│   │   ├── impact/         # Recharts visual analytics & outcomes
│   │   ├── leaderboard/    # Top champions & live user standing
│   │   ├── login/          # Authenticated sign-in form
│   │   ├── register/       # User registration form
│   │   ├── admin/          # Admin moderation (events, organizers, reports, relief)
│   │   ├── organizer/      # Organizer workspace & outcome submission
│   │   └── dashboard/      # Volunteer workspace
│   │       ├── attendance/ # QR check-in & organizer QR station
│   │       ├── certificates/# Milestone badges & printable certificate
│   │       ├── create-event/# Event creation form
│   │       ├── events/     # Manage my created events (CRUD)
│   │       ├── joined/     # My joined events & cancelation
│   │       └── update-event/[id]/ # Event edit form
│   ├── components/
│   │   ├── auth-provider.js# Global React AuthContext (JWT)
│   │   ├── site-provider.js# Theme, language dictionary (EN/বাংলা), Toaster
│   │   ├── site.js         # Navbar with language/theme toggle & Footer
│   │   ├── cards.js        # EventCard & StatCard components
│   │   └── dashboard.js    # Dashboard shell with live notification bell
│   └── lib/
│       ├── api.js          # API client with JWT bearer interceptor
│       └── utils.js        # Class name helper
├── .env.local              # Frontend environment variables
└── package.json            # Frontend dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js LTS (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Setup Backend Server
```bash
cd server
npm install
npm run dev
```
> Backend runs on **http://localhost:5000** and connects to MongoDB Atlas.

### 2. Setup Frontend Application
```bash
cd kindconnect-ui
npm install
npm run dev
```
> Frontend runs on **http://localhost:3002**.

---

## 🔑 Pre-Configured Test Accounts

| Account Name | Email | Password | Role | Features to Test |
|---|---|---|---|---|
| **Halima Yesmin Omi** | `halima@kindconnect.org` | `password123` | Organizer / Creator | Event creation, edit/delete, QR station, attendee view |
| **Shraboni Das** | `shraboni@kindconnect.org` | `password123` | Volunteer | Join events, QR check-in, certificates, emergency response |

---

## 📡 API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT
- `GET /api/auth/user` — Fetch current user profile *(Protected)*

### Events (`/api/events`)
- `GET /api/events` — All upcoming events with search & category filters
- `GET /api/events/recent` — 6 most recent upcoming events
- `GET /api/events/:id` — Single event details
- `POST /api/events` — Create new event *(Protected)*
- `PATCH /api/events/:id` — Update event *(Protected, Creator only)*
- `DELETE /api/events/:id` — Delete event *(Protected, Creator only)*
- `GET /api/events/user/my-events` — Events created by current user *(Protected)*

### Registrations (`/api/registrations`)
- `POST /api/registrations` — Join an event *(Protected)*
- `DELETE /api/registrations/:eventId` — Cancel event registration *(Protected)*
- `GET /api/registrations/my-registrations` — Current user's joined events *(Protected)*
- `GET /api/registrations/event/:eventId` — View registered volunteers for an event *(Protected, Creator only)*

### QR Attendance (`/api/attendance`)
- `GET /api/attendance/code/:eventId` — Get QR code data URL & check-in token *(Protected, Organizer only)*
- `POST /api/attendance/check-in` — Validate attendance & award 50 points *(Protected)*
- `GET /api/attendance/my-attendance` — Current user's verified attendances & total points *(Protected)*
- `GET /api/attendance/event/:eventId` — Live checked-in attendees *(Protected, Organizer only)*

### In-App Notifications (`/api/notifications`)
- `GET /api/notifications` — Current user's notifications & unread count *(Protected)*
- `PATCH /api/notifications/:id/read` — Mark notification as read *(Protected)*
- `POST /api/notifications/mark-all-read` — Mark all as read *(Protected)*

### Emergency Help (`/api/emergency`)
- `GET /api/emergency` — Public active verified relief requests
- `POST /api/emergency` — Submit an urgent relief request *(Protected)*
- `POST /api/emergency/:id/respond` — Volunteer responds to offer aid *(Protected)*
- `PATCH /api/emergency/:id/verify` — Admin moderation *(Protected)*

---

## 📄 License
This project is prepared and submitted for the **Web Programming Lab (CSE 35+36)** assessment. All rights reserved © 2026 KindConnect.
