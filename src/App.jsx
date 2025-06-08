import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';

import './App.css';
import Nav from './component/Nav.jsx';
import Home from './component/Home.jsx';
import About from './component/About.jsx';
import Footer from './component/Footer.jsx';
import Contact from './component/Contact.jsx';
import ScrollToTop from './Scrolltotop.jsx';
import Login from './component/Login.jsx';
import Dashboard from './component/Dashboard.jsx';

function App() {
  const navigate = useNavigate();
  const { isSignedIn } = useClerk();

  useEffect(() => {
    const checkAuthAndNavigate = () => {
      if (isSignedIn) {
        // If signed in, always go to /dashboard, no matter what the user tries to access
        if (window.location.pathname !== '/dashboard') {
          navigate('/dashboard');
        }
      } else {
        // If signed out, allow access to public routes, and redirect from dashboard
        if (window.location.pathname === '/dashboard') {
          navigate('/login'); // Or any other page you want the user to go
        }
      }
    };

    checkAuthAndNavigate();
  }, [isSignedIn, navigate]);

  return (
    <>
      <Nav />
      <ScrollToTop />

      <Routes>
        {/* Public Routes (only accessible when signed out) */}
        <Route
          path='/login'
          element={
            <SignedOut>
              <Login />
            </SignedOut>
          }
        />
        <Route
          path='/'
          element={
            <SignedOut>
              <Home />
            </SignedOut>
          }
        />
        <Route
          path='/about'
          element={
            <SignedOut>
              <About />
            </SignedOut>
          }
        />
        <Route
          path='/contact'
          element={
             <SignedOut>
              <Contact />
            </SignedOut>
          }
        />

        {/* Protected Dashboard Route (only accessible when signed in) */}
        <Route
          path='/dashboard'
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />

        {/* Redirect all other routes to login when signed out */}
        <Route
          path='/*'
          element={
            <SignedOut>
              <Navigate to='/login' />
            </SignedOut>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
