import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Student Pages
import StudentHome from './pages/student/StudentHome';
import StudentCalendar from './pages/student/StudentCalendar';
import StudentSessions from './pages/student/StudentSessions';
import FavoriteTutors from './pages/student/FavoriteTutors';
import BookingPage from './pages/student/BookingPage';
import ApplyTutor from './pages/student/ApplyTutor';

// Tutor Pages
import TutorDashboard from './pages/tutor/TutorDashboard';
import TutorCalendar from './pages/tutor/TutorCalendar';
import TutorSessions from './pages/tutor/TutorSessions';
import TutorTransactions from './pages/tutor/TutorTransactions';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminTutors from './pages/admin/AdminTutors';
import AdminSessions from './pages/admin/AdminSessions';
import AdminAnalytics from './pages/admin/AdminAnalytics';

import BookSession from './pages/BookSession';
import AvailableTutors from './pages/AvailableTutors.jsx';
import SuggestedTutors from './pages/SuggestedTutors';
import BookWithTutor from './pages/BookWithTutor';
import BookingConfirmation from './pages/BookingConfirmation';
import SessionRoom from './pages/SessionRoom';
import SessionFeedback from './pages/SessionFeedback';

// Styling
import './App.css';

function App() {
  return (
    <Router>
      <AppProvider>
        <Routes>
          {/* Redirect root to student home */}
          <Route path="/" element={<Navigate to="/student" replace />} />

          {/* Booking Flow */}
          {/* Student Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route path="/book-session" element={<BookSession />} />
            <Route path="/available-tutors" element={<AvailableTutors />} />
            <Route path="/suggested-tutors" element={<SuggestedTutors />} />
            <Route path="/book-with-tutor" element={<BookWithTutor />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/session-room/:tutorId" element={<SessionRoom />} />
            <Route path="/session-feedback" element={<SessionFeedback />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<MainLayout />}>
            <Route index element={<StudentHome />} />
            <Route path="calendar" element={<StudentCalendar />} />
            <Route path="sessions" element={<StudentSessions />} />
            <Route path="favorites" element={<FavoriteTutors />} />
            <Route path="book/:tutorId" element={<BookingPage />} />
            <Route path="book" element={<StudentHome />} />
            <Route path="apply-tutor" element={<ApplyTutor />} />
          </Route>

          {/* Tutor Routes */}
          <Route path="/tutor" element={<MainLayout />}>
            <Route index element={<TutorDashboard />} />
            <Route path="calendar" element={<TutorCalendar />} />
            <Route path="sessions" element={<TutorSessions />} />
            <Route path="transactions" element={<TutorTransactions />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="tutors" element={<AdminTutors />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          {/* Catch all - redirect to student home */}
          <Route path="*" element={<Navigate to="/student" replace />} />
        </Routes>
      </AppProvider>
    </Router>
  );
}

export default App;