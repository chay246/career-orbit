import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Onboarding() {
  const nav = useNavigate();
  const token = localStorage.getItem("hirehub_token");

  const [form, setForm] = useState({
    college: "",
    degree: "",
    subject: "",
    cgpa: "",
    graduationYear: "",
    skills: "",
    experience: "",
    projects: "",
  });

  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!token) {
      nav("/login");
      return;
    }

    if (!cv) {
      setMessage("Please upload your CV / Resume.");
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const data = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        data.append(key, value);
      });

      data.append("cv", cv);

      const res = await axios.post(`${API}/profile`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.setItem(
        "hirehub_profile",
        JSON.stringify(res.data.profile)
      );

      setMessage("Profile saved successfully.");
      nav("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save your profile.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">STEP 2 · YOUR PROFILE</p>
        <h2>Build your career signal</h2>
        <p>
          Complete your education, skills and CV so HireHub can calculate
          your best job matches.
        </p>
      </div>

      <div className="onboarding-card">
        <form onSubmit={submit}>
          <h3>Educational Background</h3>

          <div className="form-grid">
            {["college", "degree", "subject", "cgpa", "graduationYear"].map(
              (name) => (
                <label key={name}>
                  {name === "college"
                    ? "College / University"
                    : name === "degree"
                    ? "Degree"
                    : name === "subject"
                    ? "Subject / Major"
                    : name === "cgpa"
                    ? "CGPA"
                    : "Graduation Year"}

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

          <h3>Professional Profile</h3>

          <label>
            Skills
            <input
              name="skills"
              value={form.skills}
              onChange={update}
              placeholder="React, Node.js, MongoDB"
              required
            />
          </label>

          <label>
            Experience / Internships
            <textarea
              name="experience"
              value={form.experience}
              onChange={update}
            />
          </label>

          <label>
            Projects
            <textarea
              name="projects"
              value={form.projects}
              onChange={update}
            />
          </label>

          <label className="file-label">
            CV / Resume
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setCv(e.target.files[0])}
              required
            />
            <small>{cv ? cv.name : "PDF, DOC or DOCX · Required"}</small>
          </label>

          {message && <p className="form-message">{message}</p>}

          <button className="primary button" disabled={busy}>
            {busy ? "Saving..." : "Save Profile & Calculate Match"}
          </button>
        </form>
      </div>
    </section>
  );

}


export default Onboarding;