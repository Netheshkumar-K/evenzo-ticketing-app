import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Toast from './components/ui/Toast';
import ProtectedRoute from './components/ui/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import EventDetailPage from './pages/public/EventDetailPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import WorkerLoginPage from './pages/auth/WorkerLoginPage';

// Booking
import TicketPage from './pages/booking/TicketPage';

// User Dashboard
import UserDashboard from './pages/dashboard/user/UserDashboard';
import MyTicketsPage from './pages/dashboard/user/MyTicketsPage';
import ProfilePage from './pages/dashboard/user/ProfilePage';

// Organizer Dashboard
import OrganizerDashboard from './pages/dashboard/organizer/OrganizerDashboard';
import CreateEventPage from './pages/dashboard/organizer/CreateEventPage';
import EventLiveDashboard from './pages/dashboard/organizer/EventLiveDashboard';
import BankLinkingPage from './pages/dashboard/organizer/BankLinkingPage';
import PostEventReport from './pages/dashboard/organizer/PostEventReport';

// Worker
import WorkerDashboard from './pages/dashboard/worker/WorkerDashboard';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Toast />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/worker-login" element={<WorkerLoginPage />} />
          </Route>

          {/* Ticket View (standalone) */}
          <Route path="/booking/ticket/:id" element={
            <ProtectedRoute>
              <TicketPage />
            </ProtectedRoute>
          } />

          {/* Dashboard Routes */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            {/* User */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/dashboard/tickets" element={<MyTicketsPage />} />
            <Route path="/dashboard/history" element={<MyTicketsPage />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />

            {/* Organizer */}
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/organizer/create" element={<CreateEventPage />} />
            <Route path="/organizer/event/:id" element={<EventLiveDashboard />} />
            <Route path="/organizer/bank" element={<BankLinkingPage />} />
            <Route path="/organizer/report/:id" element={<PostEventReport />} />

            {/* Worker */}
            <Route path="/worker" element={<WorkerDashboard />} />
            <Route path="/worker/search" element={<WorkerDashboard />} />
            <Route path="/worker/list" element={<WorkerDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;