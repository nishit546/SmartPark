# SmartPark — Parking & Valet Visibility System

## Overview

SmartPark is a frontend-based smart mobility prototype designed to solve two common urban problems:

* Drivers wasting time searching for parking in crowded areas
* Valet users lacking visibility of where their car is parked

This project provides a **map-based interface with simulated real-time updates** to visualize parking availability and valet vehicle tracking.

---

## Problem Statements

1. **Parking Discovery Problem**
   Drivers circle busy markets for long periods due to a lack of real-time parking availability.

2. **Valet Visibility Problem**
   Users have no transparency after handing over their car to valet services.

---

## Solution

SmartPark provides:

* Real-time (simulated) parking availability on a map
* Valet tracking system with moving vehicle simulation
* Interactive UI for booking and monitoring parking

---

## Features

### Smart Parking Map

* Integrated with Google Maps Platform
* Color-coded parking markers:

  * Available
  * Occupied
  * Limited

---

### Booking System (Frontend Simulation)

* Click parking spot → view details
* Book parking via modal
* Multi-step booking UI

---

### Valet Tracking (Core Feature)

* Use valet option
* Track car on map
* Simulated real-time movement
* Status updates:

  * Parked
  * Retrieving
  * Arriving

---

### Real-Time Simulation

* Dynamic parking availability updates
* Car movement using timed coordinate changes

---

### UI/UX Features

* Responsive dashboard layout
* Navbar + sidebar navigation
* Modals, cards, and panels
* Skeleton loaders, empty & error states
* Toast notifications

---

### Theme System

* Light / Dark mode
* Stored using localStorage

---

### State Management

* Redux Toolkit for global state
* Parking and valet state handling

---

### Full-Stack API Integration

* Connected to a custom Node.js/Express backend
* Data persistence using MongoDB
* Secure communication using Axios and Firebase Auth Tokens

---

### Additional Features

* Search & filter parking spots
* Booking history (UI)
* Notifications system
* Heatmap (optional visualization)

---

## Tech Stack

* **Frontend:** React (Vite)
* **Backend:** Node.js, Express
* **Database:** MongoDB
* **Styling:** Tailwind CSS, MUI
* **State Management:** Redux Toolkit
* **Maps:** Google Maps API
* **Forms:** Formik + Yup

---

## Project Structure

```
src/
 ├── components/
 ├── pages/
 ├── features/
 │    ├── parking/
 │    ├── valet/
 ├── hooks/
 ├── services/
 ├── utils/
```

---

## How It Works

* Parking data is fetched from the MongoDB backend and managed via Redux Toolkit
* API calls are handled via Axios with request interceptors for authentication
* Real-time UI behavior is mimicked using `setInterval` hooks
* Car movement is simulated on the map using progressively updating coordinates

---

## Screenshots / Demo

> [Figma Design Link](https://www.figma.com/design/tcbq1AsxRmYeQGcp6CEE2r/Untitled?node-id=0-1&p=f&t=6yKjmX8wIo0pptUS-0)

> [Figma Prototype Link](https://www.figma.com/proto/tcbq1AsxRmYeQGcp6CEE2r/Untitled?node-id=0-1&t=nc3U0ZOmgrp3w2eI-1)
### Application Views

![View 1](./frontend/src/assets/Screenshot%202026-04-22%20231850.png)
![View 2](./frontend/src/assets/Screenshot%202026-04-22%20231909.png)
![View 3](./frontend/src/assets/Screenshot%202026-04-22%20231925.png)
![View 4](./frontend/src/assets/Screenshot%202026-04-22%20232103.png)

---

## Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-username/smartpark.git

# Navigate to project
cd smartpark

# Install dependencies
npm install

# Run the app
npm run dev
```

---

## Future Improvements

* Real-time GPS hardware tracking
* Payment gateway integration (Stripe / Razorpay)
* AI-based parking availability prediction
* WebSockets for instant live map updates

---

## Learning Outcomes

* Built a scalable frontend architecture
* Implemented map-based UI with real-time simulation
* Applied industry practices (Redux, modular structure, UX states)

---

## Project Statement

> “SmartPark reduces parking search time and improves valet transparency using map-based visualization and simulated real-time tracking.”

---

## License

This project is for educational and demonstration purposes.
