// src/context/AppContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getRoleFromURL } from '../utils/roleUtils';

// Import mock data
import mockTutors from '../data/tutors.json';
import mockStudents from '../data/students.json';
import mockSessions from '../data/sessions.json';
import mockApplications from '../data/applications.json';
import mockAnalytics from '../data/analytics.json';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const location = useLocation();

  // User state
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(() => getRoleFromURL()); // Initialize from URL
  
  // Data state
  const [tutors, setTutors] = useState(mockTutors);
  const [students, setStudents] = useState(mockStudents);
  const [sessions, setSessions] = useState(mockSessions);
  const [applications, setApplications] = useState(mockApplications);
  const [analytics, setAnalytics] = useState(mockAnalytics);
  
  // Filter states for student view
  const [tutorFilters, setTutorFilters] = useState({
    subject: '',
    gender: '',
    yearOfStudy: '',
    availability: ''
  });

  // Update role when URL changes
  useEffect(() => {
    const roleFromURL = getRoleFromURL();
    setUserRole(roleFromURL);
  }, [location.pathname]);

  // Initialize currentUser from localStorage on load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Default to first student for demo purposes
      setCurrentUser(mockStudents[0]);
      localStorage.setItem('currentUser', JSON.stringify(mockStudents[0]));
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Function to switch user role (now also navigates)
  const switchRole = (role) => {
    if (['student', 'tutor', 'admin'].includes(role)) {
      // Navigate to the corresponding URL
      window.location.href = `/${role}`;
    }
  };

  // Function to get current user's sessions (as student or tutor)
  const getUserSessions = () => {
    if (!currentUser) return [];
    
    if (userRole === 'student') {
      return sessions.filter(session => session.studentId === currentUser.id);
    } else if (userRole === 'tutor') {
      return sessions.filter(session => session.tutorId === currentUser.id);
    }
    return sessions; // Return all sessions for admin
  };
  
  // Function to handle tutor application
  const applyForTutor = (application) => {
    const newApplication = {
      id: applications.length + 1,
      studentId: currentUser.id,
      status: 'Pending',
      dateApplied: new Date().toISOString().split('T')[0],
      ...application
    };
    
    setApplications([...applications, newApplication]);
    return newApplication;
  };
  
  // Function to book a session
  const bookSession = (tutorId, subject, date, startTime) => {
    const newSession = {
      id: sessions.length + 1,
      studentId: currentUser.id,
      tutorId,
      subject,
      date,
      startTime,
      duration: 60, // Default to 60 minutes
      status: 'Upcoming',
      amount: tutors.find(tutor => tutor.id === tutorId).hourlyRate,
      location: 'Online', // Default to online
    };
    
    setSessions([...sessions, newSession]);
    return newSession;
  };
  
  // Function to filter tutors
  const getFilteredTutors = () => {
    return tutors.filter(tutor => {
      // Filter by subject
      if (tutorFilters.subject && !tutor.subjects.includes(tutorFilters.subject)) {
        return false;
      }
      
      // Filter by gender
      if (tutorFilters.gender && tutor.gender !== tutorFilters.gender) {
        return false;
      }
      
      // Filter by year of study
      if (tutorFilters.yearOfStudy && tutor.yearOfStudy !== parseInt(tutorFilters.yearOfStudy)) {
        return false;
      }
      
      // Filter by availability (if needed)
      // This would need more complex logic based on how we implement availability
      
      return true;
    });
  };
  
  // Function to add tutor to favorites
  const toggleFavoriteTutor = (tutorId) => {
    if (!currentUser) return;
    
    const updatedUser = {...currentUser};
    
    if (!updatedUser.favoriteTutors) {
      updatedUser.favoriteTutors = [];
    }
    
    const index = updatedUser.favoriteTutors.indexOf(tutorId);
    
    if (index > -1) {
      // Remove from favorites
      updatedUser.favoriteTutors.splice(index, 1);
    } else {
      // Add to favorites
      updatedUser.favoriteTutors.push(tutorId);
    }
    
    setCurrentUser(updatedUser);
    
    // Update in students array as well
    const updatedStudents = students.map(student => 
      student.id === currentUser.id ? updatedUser : student
    );
    
    setStudents(updatedStudents);
  };
  
  // Function to handle tutor application approval/rejection by admin
  const updateApplicationStatus = (applicationId, status) => {
    const updatedApplications = applications.map(app => {
      if (app.id === applicationId) {
        return {...app, status};
      }
      return app;
    });
    
    setApplications(updatedApplications);
    
    // If approved, make the student a tutor as well
    if (status === 'Approved') {
      const application = applications.find(app => app.id === applicationId);
      const student = students.find(student => student.id === application.studentId);
      
      if (student) {
        // Update student to be tutor
        const updatedStudents = students.map(s => {
          if (s.id === student.id) {
            return {...s, isTutor: true};
          }
          return s;
        });
        
        setStudents(updatedStudents);
        
        // Create new tutor
        const newTutor = {
          id: tutors.length + 1,
          firstName: student.firstName,
          lastName: student.lastName,
          gender: student.gender,
          email: student.email,
          subjects: application.subjects,
          availability: [],
          rating: 0,
          hourlyRate: application.proposedRate,
          bio: application.coverLetter,
          yearOfStudy: student.yearOfStudy,
          totalSessions: 0,
          reviews: 0,
          avatar: student.avatar,
          status: 'Approved'
        };
        
        setTutors([...tutors, newTutor]);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userRole,
        switchRole,
        tutors,
        students,
        sessions,
        applications,
        analytics,
        getUserSessions,
        getFilteredTutors,
        tutorFilters,
        setTutorFilters,
        toggleFavoriteTutor,
        applyForTutor,
        bookSession,
        updateApplicationStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;