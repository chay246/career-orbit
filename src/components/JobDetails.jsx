import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function JobDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const token = localStorage.getItem("hirehub_token");

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API}/jobs/${id}`);
        setJob(response.data.job);
      } catch (err) {
        setError("Job nahi mili.");
      } finally {
        setLoading(false);
      }
    }

    loadJob();
  }, [id]);

  if (loading) {
    return <section className="section">Loading job...</section>;
  }

  if (error || !job) {
    return (
      <section className="section">
        <p>{error || "Job not found."}</p>
        <Link className="back" to="/jobs">← Back to jobs</Link>
      </section>
    );
  }

  const jobId = job._id || job.id;
  const skills = job.skills || [];

  const apply = () => {
    if (token) {
      nav(`/jobs/${jobId}/apply`);
    } else {
      nav("/login");
    }
  };

  return (
    <section className="section details">
      <Link className="back" to="/jobs">← Back to jobs</Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="company-logo large">
            {job.company?.[0] || "H"}
          </div>

          <div>
            <p className="eyebrow">{job.company}</p>
            <h2>{job.title}</h2>
            <p>{job.location} · {job.type}</p>

            <div className="detail-posted">
              <span>Posted by</span>
              <strong>
                {job.postedBy || job.recruiterId?.name || job.company}
              </strong>
              <span>·</span>
              <span>
                {job.postedDate ||
                  (job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Recently")}
              </span>
            </div>
          </div>

          <div className="score">
            <b>{job.match ?? 0}%</b>
            <span>Skill Match</span>
          </div>
        </div>

        <div className="job-detail-salary">
          <div>
            <small>SALARY</small>
            <strong>{job.salary || "Not disclosed"}</strong>
          </div>
          <div>
            <small>JOB TYPE</small>
            <strong>{job.type}</strong>
          </div>
          <div>
            <small>LOCATION</small>
            <strong>{job.location}</strong>
          </div>
        </div>

        <hr />

        <h3>About the role</h3>
        <p>
          {job.description ||
            "Join the team and review the requirements before applying."}
        </p>

        <h3>Required skills</h3>
        <div className="tags">
          {skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>

        <button className="primary button" onClick={apply}>
          {token ? "Continue to Application" : "Log In to Apply"}
        </button>
      </div>
    </section>
  );
}

export default JobDetails;