import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const Home             = lazy(() => import('./pages/Home'));
const Login            = lazy(() => import('./pages/Auth/Login'));
const Signup           = lazy(() => import('./pages/Auth/Signup'));
const Dashboard        = lazy(() => import('./pages/Dashboard'));
const MapPage          = lazy(() => import('./pages/MapPage'));
const BookingPage      = lazy(() => import('./pages/BookingPage'));
const PaymentPage      = lazy(() => import('./pages/PaymentPage'));
const ReceiptPage      = lazy(() => import('./pages/ReceiptPage'));
const ValetTrackingPage = lazy(() => import('./pages/ValetTrackingPage'));
const AdminPage        = lazy(() => import('./pages/AdminPage'));
const ManagementPage   = lazy(() => import('./pages/ManagementPage'));
const AnalyticsPage    = lazy(() => import('./pages/AnalyticsPage'));
const Settings         = lazy(() => import('./pages/Settings'));


// ─── Suspense fallback ────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-sm font-semibold text-slate-400 tracking-wide">Loading…</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Global Settings (accessible by all logged-in roles) */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'guest', 'admin']} />}>
               <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Protected Routes for Admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/management" element={<ManagementPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
            </Route>

            {/* Protected Routes for User */}
            <Route element={<ProtectedRoute allowedRoles={['user', 'guest']} />}>
              <Route path="/map" element={<MapPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/receipt" element={<ReceiptPage />} />
              <Route path="/valet" element={<ValetTrackingPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}

export default App;

