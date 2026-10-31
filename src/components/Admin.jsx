import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Admin() {
  const [mode, setMode] = useState(null);

  const [form, setForm] = useState({
    type: "Full Time",
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    education: "B.Tech",
    subject: "",
    cgpa: "",
    skills: "",
    requirements: "",
    description: "",
    deadline: "",
  });

  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const choose = (type) => {
    setMode(type);
    setForm({ ...form, type });
    setMessage("");
  };

  const publish = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("hirehub_token");
    const user = JSON.parse(
      localStorage.getItem("hirehub_user") || "null"
    );

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    if (user?.role !== "recruiter") {
      setMessage("Only recruiters can publish jobs.");
      return;
    }

    setBusy(true);

    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      };

      const response = await axios.post(`${API}/jobs`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message || "Job published successfully.");

      setForm({
        type: form.type,
        title: "",
        company: "",
        location: "",
        salary: "",
        experience: "",
        education: "B.Tech",
        subject: "",
        cgpa: "",
        skills: "",
        requirements: "",
        description: "",
        deadline: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Job publish nahi hui.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">ADMIN CONSOLE</p>
        <h2>Post an Opportunity</h2>
        <p>
          Publish verified job and internship requirements for HireHub
          candidates.
        </p>
      </div>

      {!mode ? (
        <div className="post-options">
          <button
            className="post-option admin-choice"
            onClick={() => choose("Full Time")}
          >
            <span className="admin-choice-icon">💼</span>
            <h3>Post a Job</h3>
            <p>
              Permanent roles with salary, skills, education and hiring
              requirements.
            </p>
            <strong>Continue →</strong>
          </button>

          <button
            className="post-option admin-choice"
            onClick={() => choose("Internship")}
          >
            <span className="admin-choice-icon">🎓</span>
            <h3>Post an Internship</h3>
            <p>
              Student internships with stipend, skills, eligibility and
              deadlines.
            </p>
            <strong>Continue →</strong>
          </button>
        </div>
      ) : (
        <div className="post-form-card">
          <button
            className="back admin-back"
            onClick={() => setMode(null)}
          >
            ← Choose another
          </button>

          <h3>
            {form.type === "Internship" ? "Post an Internship" : "Post a Job"}
          </h3>

          <form onSubmit={publish}>
            <div className="form-grid">
              <label>
                Title
                <input
                  name="title"
                  value={form.title}
                  onChange={update}
                  placeholder={
                    form.type === "Internship"
                      ? "Software Engineering Intern"
                      : "Software Engineer"
                  }
                  required
                />
              </label>

              <label>
                Company
                <input
                  name="company"
                  value={form.company}
                  onChange={update}
                  placeholder="Company name"
                  required
                />
              </label>

              <label>
                Location
                <input
                  name="location"
                  value={form.location}
                  onChange={update}
                  placeholder="Kolkata / Remote"
                  required
                />
              </label>

              <label>
                {form.type === "Internship" ? "Stipend" : "Salary"}
                <input
                  name="salary"
                  value={form.salary}
                  onChange={update}
                  placeholder={
                    form.type === "Internship"
                      ? "₹20,000/month"
                      : "₹8–12 LPA"
                  }
                  required
                />
              </label>

              <label>
                Experience
                <input
                  name="experience"
                  value={form.experience}
                  onChange={update}
                  placeholder="0–2 years"
                />
              </label>

              <label>
                Minimum Education
                <select
                  name="education"
                  value={form.education}
                  onChange={update}
                >
                  <option>B.Tech</option>
                  <option>B.E.</option>
                  <option>M.Tech</option>
                  <option>MCA</option>
                  <option>Any Graduate</option>
                </select>
              </label>

              <label>
                Subject / Branch
                <input
                  name="subject"
                  value={form.subject}
                  onChange={update}
                  placeholder="CSE / IT / Any"
                />
              </label>

              <label>
                Minimum CGPA
                <input
                  name="cgpa"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={form.cgpa}
                  onChange={update}
                  placeholder="7.0"
                />
              </label>

              <label>
                Application Deadline
                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={update}
                />
              </label>
            </div>

            <label>
              Required Skills
              <input
                name="skills"
                value={form.skills}
                onChange={update}
                placeholder="React, Node.js, MongoDB"
                required
              />
            </label>

            <label>
              Job Requirements
              <textarea
                name="requirements"
                value={form.requirements}
                onChange={update}
                placeholder="Eligibility and hiring requirements..."
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={update}
                placeholder="Describe the opportunity..."
                required
              />
            </label>

            {message && <p className="form-message">{message}</p>}

            <button className="primary button" disabled={busy}>
              {busy
                ? "Publishing..."
                : `Publish ${form.type === "Internship" ? "Internship" : "Job"} →`}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}

export default Admin;