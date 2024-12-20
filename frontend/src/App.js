import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Import pages and components
import LoginPage from './pages/common/all/LoginPage';
import RequestTourPage from './pages/Schools/RequestTourPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdvisorDashboard from './components/Advisor/AdvisorDashboard';
import CoordinatorDashboard from './components/Coordinator/CoordinatorDashboard';
import GuideDashboard from './components/Guide/GuideDashboard';
import PrivateRoute from './components/PrivateRoute';
import InitialPage from './pages/common/all/InitialPage';
import RequestFairPage from './pages/Schools/RequestFairPage';
import ForgotPasswordPage from './pages/common/all/ForgotPasswordPage';
import NotFoundPage from './pages/common/all/404Page';
import CancelTourRequestPage from './pages/Schools/CancelTourRequestPage';
import GivePointsFeedbackPage from './pages/Schools/GivePointsFeedbackPage';
import ForgotPasswordMailPage from './pages/common/all/ForgotPasswordMailPage';


function App() {
  useEffect(() => {
    // Check if the current page is the initial page, and load the chatbot only then
    if (window.location.pathname === "/initial_page") {
      // Add the API key and provider ID script
      const apiScript = document.createElement('script');
      apiScript.textContent = `
        window.aichatbotApiKey="7382c891-382a-4cfb-b01c-05ff0d1be979";
        window.aichatbotProviderId="f9e9c5e4-6d1a-4b8c-8d3f-3f9e9c5e46d1";
      `;
      document.body.appendChild(apiScript);

      // Add the chatbot script
      const chatbotScript = document.createElement('script');
      chatbotScript.src="https://script.chatlab.com/aichatbot.js";
      chatbotScript.id="7382c891-382a-4cfb-b01c-05ff0d1be979";
      chatbotScript.defer = true;
      document.body.appendChild(chatbotScript);

      // Cleanup on component unmount
      return () => {
        document.body.removeChild(apiScript);
        document.body.removeChild(chatbotScript);
      };
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/initial_page" element={<InitialPage />} />
        <Route path="/request-tour" element={<RequestTourPage />} />
        <Route path="/request-fair" element={<RequestFairPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgot-password-mail" element={<ForgotPasswordMailPage />} />
        <Route path="/404-page" element={<NotFoundPage />} />
        <Route path="/cancel-tour-request-page" element={<CancelTourRequestPage />} />
        <Route path="/give-points-feedback-page" element={<GivePointsFeedbackPage />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute userType="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        {/* Advisor Routes */}
        <Route
          path="/advisor/*"
          element={
            <PrivateRoute userType="advisor">
              <AdvisorDashboard />
            </PrivateRoute>
          }
        />

        {/* Coordinator Routes */}
        <Route
          path="/coordinator/*"
          element={
            <PrivateRoute userType="coordinator">
              <CoordinatorDashboard />
            </PrivateRoute>
          }
        />

        {/* Guide Routes */}
        <Route
          path="/guide/*"
          element={
            <PrivateRoute userType="guide">
              <GuideDashboard />
            </PrivateRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/initial_page" />} />
      </Routes>
    </Router>
  );
}

export default App;
