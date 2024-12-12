import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CompanyDashboard from './components/CompanyDashboard';
import ApplicantDashboard from './components/ApplicantDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Job Application</h1>
        <nav>
          <Link to="/company">Company Dashboard</Link>
          <Link to="/applicant">Applicant Dashboard</Link>
        </nav>
        <Routes>
          <Route path="/company" element={<CompanyDashboard />} />
          <Route path="/applicant" element={<ApplicantDashboard />} />
          {/* Redirect root path to /company or /applicant */}
          <Route path="/" element={<Navigate to="/company" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
