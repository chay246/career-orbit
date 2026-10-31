import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Register() {
  const [step, setStep] = useState("details");
  const [method, setMethod] = useState("phone");

  const [form, setForm] = useState({
    name: "",
    contact: "",
    password: "",
    role: "candidate",
  });

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const update = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const { data } = await axios.post(`${API}/auth/send-otp`, {
        method,
        contact: form.contact,
      });

      setMessage(
        data.message +
          (data.devOtp ? ` Development OTP: ${data.devOtp}` : "")
      );

      setStep("otp");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not send OTP.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const { data } = await axios.post(`${API}/auth/register`, {
        ...form,
        method,
        otp,
      });

      localStorage.setItem("hirehub_token", data.token);
      localStorage.setItem("hirehub_user", JSON.stringify(data.user));

      if (data.user.role === "recruiter") {
        nav("/recruiter");
      } else {
        nav("/onboarding");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth">
      <div className="auth-card">
        <p className="eyebrow">JOIN HIREHUB</p>
        <h2>Create your account</h2>

        {step === "details" ? (
          <form onSubmit={sendOtp}>
            <div className="method-tabs">
              <button
                type="button"
                className={method === "email" ? "active" : ""}
                onClick={() => setMethod("email")}
              >
                Email OTP
              </button>

              <button
                type="button"
                className={method === "phone" ? "active" : ""}
                onClick={() => setMethod("phone")}
              >
                Phone OTP
              </button>
            </div>

            <label>
              Full name
              <input
                name="name"
                value={form.name}
                onChange={update}
                required
              />
            </label>

            <label>
              {method === "email" ? "Email address" : "Phone number"}
              <input
                name="contact"
                value={form.contact}
                onChange={update}
                required
                type={method === "phone" ? "tel" : "email"}
              />
            </label>

            <label>
              Password
              <input
                name="password"
                value={form.password}
                onChange={update}
                type="password"
                minLength="6"
                required
              />
            </label>

            <label>
              Role
              <select name="role" value={form.role} onChange={update}>
                <option value="candidate">Candidate</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </label>

            <button className="primary button" disabled={busy}>
              {busy ? "Sending..." : "Send OTP"}
            </button>

            {message && <p className="form-message">{message}</p>}

            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={verify}>
            <p>
              Enter the 6-digit code sent to <strong>{form.contact}</strong>.
            </p>

            <label>
              OTP
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength="6"
                required
              />
            </label>

            <button className="primary button" disabled={busy}>
              {busy ? "Creating account..." : "Verify & Create Account"}
            </button>

            {message && <p className="form-message">{message}</p>}

            <button
              type="button"
              className="text-button"
              onClick={() => {
                setStep("details");
                setMessage("");
              }}
            >
              Change email/phone
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default Register;