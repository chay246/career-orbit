
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Stat from "./Stat";

const API = "http://localhost:5000/api";

function Recruiter() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    applicants: 0,
    shortlisted: 0,
    interviews: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const token = localStorage.getItem("hirehub_token");

        if (!token) {
          setError("Please login to view the recruiter dashboard.");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const [applicantsResponse, jobsResponse] =
          await Promise.all([
            axios.get(`${API}/recruiter/applicants`, config),
            axios.get(`${API}/recruiter/jobs`, config),
          ]);

        // Backend applications return karta hai.
        const applicants = Array.isArray(
          applicantsResponse.data
        )
          ? applicantsResponse.data
          : applicantsResponse.data.applications || [];

        const jobs = Array.isArray(jobsResponse.data)
          ? jobsResponse.data
          : jobsResponse.data.jobs || [];

        setStats({
          activeJobs: jobs.filter(
            (job) => job.status?.toLowerCase() !== "closed"
          ).length,

          applicants: applicants.length,

          shortlisted: applicants.filter((applicant) =>
            ["shortlisted", "selected"].includes(
              applicant.status?.toLowerCase()
            )
          ).length,

          interviews: applicants.filter(
            (applicant) =>
              applicant.status?.toLowerCase() === "interview"
          ).length,
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Dashboard statistics load nahi ho paaye."
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">RECRUITER</p>
        <h2>Recruiter Dashboard</h2>
        <p>Manage your jobs, candidates and interviews.</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="dashboard-grid">
        <Stat
          title="Active Jobs"
          value={loading ? "..." : stats.activeJobs}
        />

        <Stat
          title="Applicants"
          value={loading ? "..." : stats.applicants}
        />

        <Stat
          title="Shortlisted"
          value={loading ? "..." : stats.shortlisted}
        />

        <Stat
          title="Interviews"
          value={loading ? "..." : stats.interviews}
        />
      </div>

      <div className="post-options">
        <Link className="post-option" to="/recruiter/post-job">
          <h3>Post a Job</h3>
          <p>Hire experienced professionals.</p>
        </Link>

        <Link
          className="post-option"
          to="/recruiter/post-internship"
        >
          <h3>Post an Internship</h3>
          <p>Find students and emerging talent.</p>
        </Link>

        <Link className="post-option" to="/recruiter/listings">
          <h3>Manage My Listings</h3>
          <p>Edit and manage your opportunities.</p>
        </Link>

        <Link className="post-option" to="/recruiter/applicants">
          <h3>View Applicants</h3>
          <p>Review candidates and update their status.</p>
        </Link>
      </div>
    </section>
  );
}

export default Recruiter;
