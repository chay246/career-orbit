import { Link, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Jobs from "./components/Jobs";
import JobDetails from "./components/JobDetails";
import Login from "./components/Login";
import Register from "./components/Register";
import Onboarding from "./components/Onboarding";
import Apply from "./components/Apply";
import Dashboard from "./components/Dashboard";
import Recruiter from "./components/Recruiter";
import Admin from "./components/Admin";
import Listings from "./components/Listings";
import Applicants from "./components/Applicants";
import PostJob from "./components/PostJob";
import PostInternship from "./components/PostInternship";
import InterviewPrep from "./components/pages/InterviewPrep";
import InterviewPrepAdvanced from "./components/pages/InterviewPrepAdvanced";
import PremiumJobs from "./components/PremiumJobs";
import ResumeBuilder from "./components/ResumeBuilder";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/:id/apply" element={<Apply />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/recruiter" element={<Recruiter />} />
        <Route path="/recruiter/post-job" element={<PostJob />} />
        <Route path="/recruiter/post-internship" element={<PostInternship />} />
        <Route path="/recruiter/listings" element={<Listings />} />
        <Route path="/recruiter/applicants" element={<Applicants />} />

        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/interview-prep-advanced" element={<InterviewPrepAdvanced />} />
        <Route path="/premium-jobs" element={<PremiumJobs />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />

        <Route path="/admin" element={<Admin />} />

        <Route
          path="*"
          element={
            <section className="section">
              <h2>Page not found</h2>
              <Link to="/">Go Home</Link>
            </section>
          }
        />
      </Routes>
    </>
  );
}

export default App;