# SmartPark — Smart Parking & Valet Visibility System

### 🔗 Important Links
*   **Figma Design:** [View Design](https://www.figma.com/design/tcbq1AsxRmYeQGcp6CEE2r/Untitled?node-id=0-1&t=RP9LcpLjsphaQRCm-0)
*   **Live Project:** [SmartPark Web App](https://smartpark-ten.vercel.app/)
*   **Postman Documentation:** [API Reference](https://documenter.getpostman.com/view/50840636/2sBXqKnzC8)
*   **Backend Deployed API:** [Render API Instance](https://smartpark-backend-tqx2.onrender.com/)
*   **YouTube Demo:** [Watch Demo Video](https://www.youtube.com/watch?v=NelM-xkh-AA)

---

## 🚩 Problem Statement
In urban environments, drivers face two major challenges:
1.  **Inefficiency:** Drivers waste significant time and fuel searching for available parking spots in crowded areas.
2.  **Lack of Transparency:** Valet service users often have no visibility into where their vehicle is parked or its current status after handing over the keys.

## 💡 Solution
SmartPark is a full-stack smart mobility solution that provides:
*   **Real-time Map Interface:** Visualizes parking availability with dynamic status updates.
*   **Valet Tracking System:** A live tracking simulation that allows users to monitor their vehicle's location and status (Parked, Retrieving, Arriving).
*   **Seamless Booking:** An intuitive multi-step booking flow for reserving parking spots in advance.

## 🚀 Features
*   **Interactive Parking Map:** Integrated with Google Maps Platform featuring color-coded markers for availability.
*   **Live Valet Visibility:** Real-time simulation of vehicle movement and status updates.
*   **Secure Authentication:** Role-based access control using Firebase Authentication.
*   **Smart Booking System:** Comprehensive booking management with history tracking.
*   **SEO Optimized:** Fully implemented meta tags, Open Graph protocols, and semantic HTML for better search engine visibility.
*   **Modern UI/UX:** Responsive design with support for Dark/Light modes, glassmorphism effects, and smooth transitions.
*   **Toast Notifications:** Real-time feedback for user actions using `react-hot-toast`.

## 🛠️ Tech Stack
*   **Frontend:** React (Vite), Redux Toolkit, Tailwind CSS, Material UI.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Atlas).
*   **Authentication:** Firebase Auth.
*   **Maps:** Google Maps API.
*   **Documentation:** Postman.
*   **Deployment:** Vercel (Frontend), Render (Backend).

## 📂 Project Structure
```text
smartpark/
├── backend/                # Express.js Server
│   ├── src/
│   │   ├── config/         # Database & Firebase config
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth & Error middlewares
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helper functions
│   │   ├── app.js          # App configuration
│   │   └── server.js       # Entry point
├── frontend/               # React Application
│   ├── src/
│   │   ├── assets/         # Images and icons
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context providers
│   │   ├── features/       # Feature-specific logic (Parking/Valet)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # API service layers (Axios)
│   │   ├── store/          # Redux store & slices
│   │   ├── utils/          # Form validation & helpers
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # App entry point
└── README.md
```

## 📸 Screenshots
<div align="center">
  <img src="./frontend/src/assets/landing_page.png" width="400" alt="Landing Page">
  <img src="./frontend/src/assets/auth_page.png" width="400" alt="Authentication Page">
</div>

---

## 🛠️ Setup & Installation

### Backend
1. `cd backend`
2. `npm install`
3. Create `.env` with `MONGODB_URI` and `PORT`.
4. `npm start`

### Frontend
1. `cd frontend`
2. `npm install`
3. Create `.env.local` with `VITE_GOOGLE_MAPS_API_KEY` and Firebase config.
4. `npm run dev`

---

## 📈 SEO Implementation
The project includes a comprehensive SEO strategy:
*   **Semantic HTML:** Proper use of `<header>`, `<main>`, `<footer>`, and heading hierarchies.
*   **Meta Tags:** Optimized titles and descriptions for search engines.
*   **Open Graph (OG):** Enhanced social media sharing with OG tags for title, description, and images.
*   **Performance:** Optimized asset loading and code splitting for faster PageSpeed scores.
