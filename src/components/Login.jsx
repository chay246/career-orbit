import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function Login() {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const { data } = await axios.post(`${API}/auth/login`, {
        contact,
        password,
      });

      localStorage.setItem("hirehub_token", data.token);
      localStorage.setItem("hirehub_user", JSON.stringify(data.user));

      if (data.user.role === "recruiter") {
        nav("/recruiter");
      } else {
        nav("/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth">
      <div className="auth-card">
        <p className="eyebrow">WELCOME BACK</p>
        <h2>Sign in to HireHub</h2>

        <form onSubmit={login}>
          <label>
            Email or phone
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="you@example.com or +91..."
              required
            />
          </label>

          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>

          <button className="primary button" disabled={busy}>
            {busy ? "Signing in..." : "Sign In"}
          </button>

          {message && (
            <p className="form-message error">{message}</p>
          )}
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;