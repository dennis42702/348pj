
import React from 'react';

function JobList({ jobs, onJobClick }) {
  return (
    <div className="job-list mt-3">
      {jobs.length > 0 ? (
        jobs.map((job) => (
          <div key={job._id} className="job-item p-3 mb-3 border rounded" onClick={() => onJobClick(job)} style={{ cursor: 'pointer' }}>
            <h4 className="text-primary">{job.title}</h4>
            <p><strong>Company:</strong> {job.company ? job.company.name : '(No Company)'}</p>
            <p><strong>Company ID:</strong> {job.company ? job.company.companyId : ''}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Requirements:</strong> {job.requirements}</p>
            <p><strong>Posting Date:</strong> {new Date(job.postingDate).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>No jobs available.</p>
      )}
    </div>
  );
}

export default JobList;
