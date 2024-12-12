
import React, { useState } from 'react';
import axios from 'axios';

function CompanyDashboard() {
  const [companyName, setCompanyName] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(null);

  const postJob = async () => {
    try {
      const response = await axios.post('http://localhost:3001/jobs', {
        title: jobTitle,
        description: jobDescription,
        requirements: jobRequirements,
        companyName,
        companyId,
      });
      setMessage(`Job posted successfully: ${response.data.title}`);
      setIsSuccess(true);
      setJobTitle('');
      setJobDescription('');
      setJobRequirements('');
      setCompanyName('');
      setCompanyId('');
    } catch (error) {
      setMessage('Error posting job');
      setIsSuccess(false);
      console.error("Error posting job:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Company Dashboard</h2>
      <h3>Post a Job</h3>
      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          className="form-control"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Company ID</label>
        <input
          type="text"
          className="form-control"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Job Title</label>
        <input
          type="text"
          className="form-control"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Job Description</label>
        <textarea
          className="form-control"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        ></textarea>
      </div>
      <div className="form-group">
        <label>Job Requirements</label>
        <textarea
          className="form-control"
          value={jobRequirements}
          onChange={(e) => setJobRequirements(e.target.value)}
        ></textarea>
      </div>
      <button onClick={postJob} className="btn btn-primary btn-block">Post Job</button>
      {message && (
        <div className={`mt-3 alert ${isSuccess ? 'alert-success' : 'alert-danger'}`} role="alert">
          {message}
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard;
