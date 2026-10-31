
import { useState } from "react";
import axios from "axios";


const API = "http://localhost:5000/api";
const RECRUITER_CODE = "HIREHUB2026";

const initialForm = {
  title: "",
  company: "",
  location: "",
  type: "Full Time",
  salary: "",
  skills: "",
  requirements: "",
  description: "",
};

function PostJob() {
  const [accessCode, setAccessCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState(initialForm);

  function verifyCode(e) {
    e.preventDefault();

    if (accessCode.trim() === RECRUITER_CODE) {
      setIsAuthorized(true);
      setMessage("");
    } else {
      setMessage("Incorrect access code. Please try again.");
      setAccessCode("");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const token = localStorage.getItem("hirehub_token");

      if (!token) {
        throw new Error("Please log in with your recruiter account first.");
      }

      const response = await axios.post(
        `${API}/jobs`,
        {
          ...form,
          skills: form.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setMessage(
        response.data?.message ||
          "Job published successfully!"
      );
      setForm(initialForm);
    } catch (error) {
      setSuccess(false);
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Job post nahi hui. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthorized) {
    return (
      <section className="postjob-page">
        <div className="access-card">
          <div className="postjob-icon">🔐</div>
          <p className="postjob-eyebrow">RECRUITER PORTAL</p>
          <h1>Welcome, Recruiter</h1>
          <p className="postjob-subtitle">
            Enter your access code to create and publish a job.
          </p>

          {message && (
            <div className="postjob-message postjob-error">
              {message}
            </div>
          )}

          <form className="postjob-form" onSubmit={verifyCode}>
            <div className="postjob-field">
              <label htmlFor="accessCode">
                Recruiter Access Code
              </label>
              <input
                id="accessCode"
                type="password"
                placeholder="Enter your access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <button className="postjob-button" type="submit">
              Verify Code <span>→</span>
            </button>
          </form>
        </div>
      </section>
    );
  }

  return (
    <section className="postjob-page">
      <div className="postjob-container">
        <header className="postjob-header">
          <div>
            <p className="postjob-eyebrow">
              HIREHUB · RECRUITER WORKSPACE
            </p>
            <h1>Post a New Job</h1>
            <p className="postjob-subtitle">
              Find the right talent. Share your opportunity with students
              and job seekers.
            </p>
          </div>

          <div className="postjob-header-icon">💼</div>
        </header>

        {message && (
          <div
            className={`postjob-message ${
              success ? "postjob-success" : "postjob-error"
            }`}
          >
            <span>{success ? "✓" : "!"}</span>
            {message}
          </div>
        )}

        <form className="postjob-form postjob-card" onSubmit={handleSubmit}>
          <div className="postjob-section-title">
            <span className="postjob-step">01</span>
            <div>
              <h2>Basic Information</h2>
              <p>Enter the role and company details.</p>
            </div>
          </div>

          <div className="postjob-grid">
            <div className="postjob-field">
              <label htmlFor="title">Job Title *</label>
              <input
                id="title"
                name="title"
                placeholder="e.g. Frontend Developer"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="postjob-field">
              <label htmlFor="company">Company Name *</label>
              <input
                id="company"
                name="company"
                placeholder="e.g. Tech Solutions"
                value={form.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="postjob-field">
              <label htmlFor="location">Job Location *</label>
              <input
                id="location"
                name="location"
                placeholder="e.g. Delhi / Remote"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="postjob-field">
              <label htmlFor="type">Employment Type *</label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                required
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="postjob-field">
              <label htmlFor="salary">Salary / Stipend *</label>
              <input
                id="salary"
                name="salary"
                placeholder="e.g. ₹4–6 LPA or ₹15,000/month"
                value={form.salary}
                onChange={handleChange}
                required
              />
            </div>

            <div className="postjob-field">
              <label htmlFor="skills">Required Skills</label>
              <input
                id="skills"
                name="skills"
                placeholder="React, JavaScript, Node.js"
                value={form.skills}
                onChange={handleChange}
              />
              <small>Separate each skill with a comma.</small>
            </div>
          </div>

          <div className="postjob-divider" />

          <div className="postjob-section-title">
            <span className="postjob-step">02</span>
            <div>
              <h2>Job Description</h2>
              <p>Help candidates understand the opportunity.</p>
            </div>
          </div>

          <div className="postjob-field">
            <label htmlFor="description">About This Role *</label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the role, daily responsibilities and what the candidate will work on..."
              value={form.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <div className="postjob-field postjob-requirements">
            <label htmlFor="requirements">
              Candidate Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              placeholder="Mention qualifications, experience, education or other requirements..."
              value={form.requirements}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="postjob-footer">
            <p>
              <span>ℹ</span> Required fields are marked with *
            </p>

            <button
              className="postjob-button postjob-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Job"}
              {!loading && <span>→</span>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default PostJob;
