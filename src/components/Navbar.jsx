
import { Link, NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("hirehub_token");

  let user = null;

  try {
    user = JSON.parse(
      localStorage.getItem("hirehub_user") || "null"
    );
  } catch {
    user = null;
  }

  const role = user?.role?.toLowerCase();
  const isRecruiter = Boolean(token) && role === "recruiter";
  const isCandidate = Boolean(token) && role === "candidate";

  function logout() {
    localStorage.removeItem("hirehub_token");
    localStorage.removeItem("hirehub_user");
    localStorage.removeItem("hirehub_profile");

    navigate("/");
    window.location.reload();
  }

  return (
    <nav className="nav">
      <Link className="brand" to="/">
        Career<span>Orbit</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>

        <NavLink to="/jobs">Jobs</NavLink>

        <NavLink to="/premium-jobs">
          ⭐ Premium Jobs
        </NavLink>

        <NavLink to="/interview-prep">
          Interview Prep
        </NavLink>

        <NavLink to="/interview-prep-advanced">
          🚀 Advanced Prep
        </NavLink>

        <NavLink to="/resume-builder">
          📄 Resume Builder
        </NavLink>

        {/* Recruiter link: Resume Builder ke baad */}
        <NavLink to="/recruiter">
          Recruiter
        </NavLink>

        {isCandidate && (
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>
        )}
      </div>

      <div className="nav-actions">
        {token ? (
          <>
            <span>
              Hi,{" "}
              {user?.name ||
                user?.fullName ||
                user?.contact ||
                "User"}
            </span>

            <button
              className="nav-logout"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link className="login" to="/login">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
