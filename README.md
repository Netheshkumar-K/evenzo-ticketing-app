<div align="center">

# 🎫 Evenzo — Event Ticketing Platform

### A modern, role-based event ticketing web application

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Evenzo-00b894?style=for-the-badge&logoColor=white)](https://evenzo-ticketing-app.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Netheshkumar-K/evenzo-ticketing-app)
[![Netlify Status](https://api.netlify.com/api/v1/badges/deploy-status/deploy-status)](https://evenzo-ticketing-app.netlify.app)

<br/>

**👉 [Click here to view the Live Website](https://evenzo-ticketing-app.netlify.app) 👈**

<br/>

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript_ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

</div>

---

## 🚀 Live Preview

> **🌐 https://evenzo-ticketing-app.netlify.app**
> 
> Click the link above to see the fully functional Evenzo platform in action!

---

## 📋 About

**Evenzo** is a comprehensive event ticketing web application that streamlines the entire event lifecycle — from event creation and discovery to ticket booking, on-spot verification, and post-event analytics.

The platform serves **four distinct user roles**, each with dedicated dashboards and functionality:

| Role | Features |
|------|----------|
| 👤 **User** | Browse events, book tickets, get QR codes, request refunds |
| 🎭 **Organizer** | Create events, manage bookings, view revenue reports, link bank accounts |
| 👷 **Worker/Staff** | On-spot OTP verification, guest check-in, attendance tracking |
| 🛡️ **Admin** | Platform management, event moderation |

---

## ✨ Key Features

- 🔍 **Event Discovery** — Search, filter by category, trending events
- 🎟️ **Ticket Booking** — Multi-category tickets (Individual/Couple/Group) with instant QR code generation
- 📱 **QR Code Tickets** — SVG-based QR codes with embedded booking data
- 🔐 **OTP Verification** — 6-digit OTP-based guest verification at venue
- 💰 **Smart Refunds** — Time-based refund policy (95% / 50% / 0%)
- 📊 **Live Dashboard** — Real-time event analytics and revenue tracking
- 🌙 **Modern UI** — Glassmorphism, gradients, animations, fully responsive
- 💾 **Persistent State** — All data saved to localStorage

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | Component-based UI with Hooks & Context API |
| **Vite 8** | Lightning-fast build tool with HMR |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **React Router v7** | Client-side routing with protected routes |
| **qrcode.react** | QR code generation for tickets |
| **Lucide React** | Modern icon library (1000+ icons) |

---

## 📁 Project Structure

```
src/
├── App.jsx              # Main router with all routes
├── main.jsx             # Entry point
├── context/
│   └── AppContext.jsx    # Global state management (Auth, Events, Bookings)
├── components/
│   ├── ui/              # Navbar, Sidebar, Modal, Toast, Spinner
│   ├── events/          # EventCard, EventGrid, CategoryFilter
│   └── booking/         # RefundModal
├── pages/
│   ├── public/          # HomePage, EventDetailPage
│   ├── auth/            # LoginPage, SignUpPage, WorkerLoginPage
│   ├── booking/         # TicketPage (QR Code view)
│   └── dashboard/
│       ├── user/        # UserDashboard, MyTickets, Profile
│       ├── organizer/   # CreateEvent, LiveDashboard, Reports, BankLinking
│       └── worker/      # WorkerDashboard (OTP Verification)
├── layouts/             # PublicLayout, DashboardLayout
├── utils/               # Helper functions (formatting, calculations)
└── data/                # Mock event data
```

---

## 🏃 Getting Started

```bash
# Clone the repository
git clone https://github.com/Netheshkumar-K/evenzo-ticketing-app.git

# Navigate to project
cd evenzo-ticketing-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| User | user@demo.com | password |
| Organizer | organizer@demo.com | password |

> **Worker Login:** Use the worker code provided when an organizer creates an event.

---

## 👨‍💻 Author

**Netheshkumar**

- GitHub: [@Netheshkumar-K](https://github.com/Netheshkumar-K)

---

<div align="center">

### ⭐ Star this repo if you like it!

**[🌐 Live Demo](https://evenzo-ticketing-app.netlify.app)** · **[📂 Source Code](https://github.com/Netheshkumar-K/evenzo-ticketing-app)**

</div>
