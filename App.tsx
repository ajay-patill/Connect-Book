import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthForm } from './components/auth/AuthForm';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { FAQ } from './pages/FAQ';
import { Home } from './pages/Home';
import { GradeMaster } from './pages/GradeMaster';
import { ParentDashboard } from './pages/ParentDashboard';
import { SmartAttendance } from './pages/SmartAttendance';
import CareerAdviser from './pages/CareerAdviser';
import { LectureNotes } from './pages/LectureNotes';
import { MentorConnect } from './pages/MentorConnect'; // Import Mentor Connect
import { useAuthStore } from './store/auth';

export function App() {
  const { isAuthenticated, initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="flex-1 container mx-auto py-10">
                  <AuthForm type="login" />
                </div>
              </div>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <div className="flex-1 container mx-auto py-10">
                  <AuthForm type="register" />
                </div>
              </div>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <DashboardLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Home />} />
          <Route path="grade-master" element={<GradeMaster />} />
          <Route path="parent-dashboard" element={<ParentDashboard />} />
          <Route path="attendance" element={<SmartAttendance />} />
          <Route path="/career" element={<CareerAdviser />} />
          <Route path="lectures" element={<LectureNotes />} />
          <Route path="mentor" element={<MentorConnect />} /> {/* Add Mentor Connect Route */}
          <Route path="faq" element={<FAQ />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
