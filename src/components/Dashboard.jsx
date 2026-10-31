import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Stat from "./Stat";

const API = "http://localhost:5000/api";

function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("hirehub_token");

    axios
      .get(`${API}/applications/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setApplications(response.data.applications || []);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Applications load nahi hui."
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <section className="section">Loading dashboard...</section>;
  }

  const selected = applications.filter(
    (application) => application.status === "Selected"
  ).length;

  const interviews = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const rejected = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">CANDIDATE</p>
        <h2>My Dashboard</h2>
        <p>Track your applications and hiring progress.</p>
      </div>

      {error && <p className="form-message error">{error}</p>}

      <div className="dashboard-grid">
        <Stat title="Applications" value={applications.length} />
        <Stat title="Interviews" value={interviews} />
        <Stat title="Selected" value={selected} />
        <Stat title="Rejected" value={rejected} />
      </div>
      <div className="listing-list">
  {applications.map((a) => (
    <div className="listing-card" key={a.id}>
      <div>
        <h3>{a.jobTitle}</h3>
        <p>
          Applied on{" "}
          {new Date(a.createdAt).toLocaleDateString()}
        </p>
        <p>Application status: <strong>{a.status}</strong></p>
      </div>

      <span className={`status status-${String(a.status).toLowerCase()}`}>
        {a.status}
      </span>
    </div>
  ))}

  {!applications.length && (
    <div className="empty">
      No applications yet. <Link to="/jobs">Explore jobs</Link>
    </div>
  )}
</div>

      <h3>My Applications</h3>

      {applications.map((application) => {
        const job = application.jobId &&
          typeof application.jobId === "object"
          ? application.jobId
          : null;

        const id = application._id || application.id;

        return (
          <article className="job-card" key={id}>
            <h3>{job?.title || application.jobTitle || "Job Application"}</h3>
            <p>{job?.company || application.company || ""}</p>

            <p>
              Applied on:{" "}
              {application.createdAt
                ? new Date(application.createdAt).toLocaleDateString()
                : application.appliedAt
                ? new Date(application.appliedAt).toLocaleDateString()
                : "Date unavailable"}
            </p>

            <p>
              Application status: <strong>{application.status}</strong>
            </p>
          </article>
        );
      })}

      {!applications.length && (
        <div className="empty">
          You have not applied to any jobs yet.
          <p><Link to="/jobs">Explore Jobs →</Link></p>
        </div>
      )}
    </section>
    
  );
}

export default Dashboard;