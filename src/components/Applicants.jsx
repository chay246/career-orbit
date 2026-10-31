
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Applicants() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("hirehub_token")}`,
    },
  });

  const loadApplicants = async () => {
    try {
      const response = await axios.get(
        `${API}/applications`,
        getConfig()
      );

      setApplications(
        Array.isArray(response.data)
          ? response.data
          : response.data.applications || []
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Applicants load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API}/applications/${id}/status`,
        { status },
        getConfig()
      );

      setMessage("Application status updated.");
      await loadApplicants();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Status update nahi hua."
      );
    }
  };

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">RECRUITER WORKSPACE</p>
        <h2>Applicants</h2>
        <p>Review candidates and update their application status.</p>
      </div>

      {message && <p className="form-message">{message}</p>}

      {loading ? (
        <p>Loading applicants...</p>
      ) : (
        <div className="listing-list">
          {applications.map((app) => (
            <div className="listing-card listing-flex" key={app.id}>
              <div>
                <h3>{app.candidateName || "Candidate"}</h3>
                <p>{app.jobTitle || "Job application"}</p>
                <p>Contact: {app.contact || "—"}</p>
                <p>Education: {app.degree || "—"}</p>
                <p>CGPA: {app.cgpa || "—"}</p>
              </div>

              <div className="application-status">
                <strong>{app.status || "Applied"}</strong>

                <select
                  value={app.status || "Applied"}
                  onChange={(e) =>
                    updateStatus(app.id, e.target.value)
                  }
                  aria-label="Application status"
                >
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="empty">No applicants found.</div>
          )}
        </div>
      )}
    </section>
  );
}

export default Applicants;
