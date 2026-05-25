import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Counselors from './pages/Counselors'
import CounselorProfile from './pages/CounselorProfile'
import Booking from './pages/Booking'
import Appointments from './pages/Appointments'
import Profile from './pages/Profile'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCounselors from './pages/admin/AdminCounselors'
import AdminAppointments from './pages/admin/AdminAppointments'
import AvailabilityEditor from './pages/admin/AvailabilityEditor'
import CreateCounselor from './pages/admin/CreateCounselor'
import EditCounselor from './pages/admin/EditCounselor'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="text-orange-400 text-lg">Cargando...</div>
    </div>
  )
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/counselors" element={<Counselors />} />
        <Route path="/counselors/:id" element={<CounselorProfile />} />

        {/* Protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/availability" element={<ProtectedRoute><AvailabilityEditor /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/counselors" element={<AdminRoute><AdminCounselors /></AdminRoute>} />
        <Route path="/admin/appointments" element={<AdminRoute><AdminAppointments /></AdminRoute>} />
        <Route path="/admin/counselors/:counselorId/availability" element={<AdminRoute><AvailabilityEditor /></AdminRoute>} />
        <Route path="/admin/counselors/new" element={<AdminRoute><CreateCounselor /></AdminRoute>} />
        <Route path="/admin/counselors/:id/edit" element={<AdminRoute><EditCounselor /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App