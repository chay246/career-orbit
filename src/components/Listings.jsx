import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Listings() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("hirehub_token");

    axios
      .get(`${API}/recruiter/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setJobs(response.data.jobs || []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Listings load nahi hui.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <section className="section">Loading listings...</section>;
  }

  return (
    <section className="section">
      <Link className="back" to="/recruiter">
        ← Back
      </Link>

      <div className="section-heading">
        <p className="eyebrow">RECRUITER</p>
        <h2>My Listings</h2>
      </div>

      {error && <p className="form-message error">{error}</p>}

      {jobs.map((job) => (
        <article className="listing-card" key={job._id || job.id}>
          <h3>{job.title}</h3>
          <p>{job.company} · {job.location}</p>
          <strong>{job.salary || "Not disclosed"}</strong>

          <p>
            Applicants: <strong>{job.applicantsCount ?? 0}</strong>
          </p>

          <Link to="/recruiter/applicants">
            View Applicants →
          </Link>
        </article>
      ))}

      {!jobs.length && !error && (
        <div className="empty">You have not posted any jobs yet.</div>
      )}
    </section>
  );
}

export default Listings;