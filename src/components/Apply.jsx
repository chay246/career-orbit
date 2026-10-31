import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Apply() {
  const { id } = useParams();
  const nav = useNavigate();
  const token = localStorage.getItem("hirehub_token");

  const saved = JSON.parse(
    localStorage.getItem("hirehub_profile") || "null"
  );

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    college: saved?.education?.college || "",
    degree: saved?.education?.degree || "",
    subject: saved?.education?.subject || "",
    cgpa: saved?.education?.cgpa || "",
    graduationYear: saved?.education?.graduationYear || "",
  });

  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/jobs/${id}`)
      .then((response) => setJob(response.data.job))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!token) {
    return (
      <section className="auth">
        <div className="auth-card">
          <h2>Sign in required</h2>
          <Link className="primary button" to="/login">
            Log In
          </Link>
          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </div>
      </section>
    );
  }

  if (loading) {
    return <section className="section">Loading job...</section>;
  }

  if (!job) {
    return (
      <section className="section">
        <p>Job not found.</p>
        <Link to="/jobs">Back to jobs</Link>
      </section>
    );
  }

  const jobId = job._id || job.id;
  
async function submitApplication(jobId, resumeFile) {
  const token = localStorage.getItem("hirehub_token");

  if (!token) {
    alert("Please log in before applying.");
    return;
  }

  if (!resumeFile) {
    alert("Please select your CV / Resume.");
    return;
  }

  const formData = new FormData();

  formData.append("jobId", String(jobId));
  formData.append("cv", resumeFile);

  try {
    const response = await fetch(
      "http://localhost:5000/api/applications",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Application failed");
    }

    alert("Application submitted successfully!");
  } catch (error) {
    alert(error.message);
  }
}


  const submit = async (e) => {
    e.preventDefault();

    if (Object.values(form).some((value) => !value)) {
      setMessage("All educational background fields are required.");
      return;
    }

    if (!cv) {
      setMessage("CV / Resume is mandatory.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("jobId", jobId);
      data.append("jobTitle", job.title);
      data.append("cv", cv);

      const response = await axios.post(`${API}/applications`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message || "Application submitted.");
      nav("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Application failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <Link className="back" to={`/jobs/${jobId}`}>
        ← Back to job
      </Link>

      <div className="apply-card">
        <p className="eyebrow">APPLICATION</p>
        <h2>{job.title}</h2>
        <p>{job.company} · {job.location} · {job.type}</p>

        <h3>Educational Background</h3>

        <form onSubmit={submit}>
          <div className="form-grid">
            {["college", "degree", "subject", "cgpa", "graduationYear"].map(
              (name) => (
                <label key={name}>
                  {name}
                  <input
                    name={name}
                    value={form[name]}
                    onChange={update}
                    required
                  />
                </label>
              )
            )}
          </div>

          <h3>CV / Resume *</h3>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setCv(e.target.files[0])}
            required
          />

          {message && <p className="form-message">{message}</p>}

          <button className="primary button" disabled={busy}>
            {busy ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Apply;