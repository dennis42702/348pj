import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobList from './JobList';

function ApplicantDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [sortBy, setSortBy] = useState(null); // Track sorting criteria
  const [order, setOrder] = useState('asc'); // Track order direction
  const [editMode, setEditMode] = useState(null); // Track the application being edited
  const [message, setMessage] = useState('');

  // Fetch available jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:3001/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Fetch user's applications
  const fetchApplications = async () => {
    try {
      const response = await axios.get('http://localhost:3001/applications');
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  // Sort jobs based on selected criteria and order
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'company') {
      const nameA = a.company?.name || '';
      const nameB = b.company?.name || '';
      return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    } else if (sortBy === 'postingDate') {
      return order === 'asc'
        ? new Date(a.postingDate) - new Date(b.postingDate)
        : new Date(b.postingDate) - new Date(a.postingDate);
    }
    return 0;
  });

  // Toggle sorting order and criteria
  const toggleSort = (criteria) => {
    if (sortBy === criteria) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setOrder('asc');
    }
  };

  // Handle application submission
  const submitApplication = async () => {
    try {
      await axios.post('http://localhost:3001/applications', {
        jobId: selectedJob._id,
        name: applicantName,
        email: applicantEmail,
        coverLetter,
      });
      setMessage(`Application submitted for ${selectedJob.title}`);
      setSelectedJob(null);
      setApplicantName('');
      setApplicantEmail('');
      setCoverLetter('');
      fetchApplications(); // Refresh applications list
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  // Delete an application
  const deleteApplication = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/applications/${id}`);
      setMessage("Application deleted");
      fetchApplications(); // Refresh applications list
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  // Edit an application
  const editApplication = async (id) => {
    try {
      await axios.put(`http://localhost:3001/applications/${id}`, { coverLetter });
      setMessage("Application updated");
      setEditMode(null);
      fetchApplications(); // Refresh applications list
    } catch (error) {
      console.error("Error editing application:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Applicant Dashboard</h2>
      <h3>Job Listings</h3>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ marginRight: '10px', fontWeight: 'bold' }}>Sort by:</span>
        <button onClick={() => toggleSort('company')} style={{ marginRight: '10px' }} className="btn btn-primary">
          Company Name
        </button>
        <button onClick={() => toggleSort('postingDate')} className="btn btn-primary">
          Date
        </button>
      </div>

      <JobList jobs={sortedJobs} onJobClick={setSelectedJob} />

      {/* Application Form for Selected Job */}
      {selectedJob && (
        <div className="application-form mt-4">
          <h4>Apply for {selectedJob.title} at {selectedJob.company?.name}</h4>
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="form-control" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" value={applicantEmail} onChange={(e) => setApplicantEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Cover Letter</label>
            <textarea className="form-control" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}></textarea>
          </div>
          <button onClick={submitApplication} className="btn btn-primary">Submit Application</button>
          {message && <div className="alert alert-success mt-3">{message}</div>}
        </div>
      )}

      <h3 className="mt-5">My Applications</h3>
      <div className="application-list">
        {applications.map((application) => (
          <div key={application._id} className="application-item p-3 mb-3 border rounded">
            <h5>{application.jobId.title}</h5>
            <p><strong>Company:</strong> {application.jobId.company?.name || '(No Company)'}</p>
            <p><strong>Cover Letter:</strong> {application.coverLetter}</p>
            {editMode === application._id ? (
              <div>
                <textarea
                  className="form-control mb-2"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                ></textarea>
                <button onClick={() => editApplication(application._id)} className="btn btn-primary btn-sm mr-2">Save</button>
                <button onClick={() => setEditMode(null)} className="btn btn-secondary btn-sm">Cancel</button>
              </div>
            ) : (
              <div>
                <button onClick={() => setEditMode(application._id)} className="btn btn-secondary btn-sm mr-2">Edit</button>
                <button onClick={() => deleteApplication(application._id)} className="btn btn-danger btn-sm">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplicantDashboard;
