
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import JobCard from "./Jobcard";

const API = "http://localhost:5000/api";

function Jobs() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const [localJobs, setLocalJobs] = useState([]);
  const [externalJobs, setExternalJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [externalLoading, setExternalLoading] = useState(false);
  const [error, setError] = useState("");
  const [externalError, setExternalError] = useState("");

  const firstSearch = useRef(true);

  // Local aur external jobs ko fetch karna
  async function loadJobs() {
    setLoading(true);
    setError("");
    setExternalError("");

    const results = await Promise.allSettled([
      axios.get(`${API}/jobs`),
      axios.get(`${API}/external-jobs`, {
        params: search.trim()
          ? { search: search.trim() }
          : {},
      }),
    ]);

    const localResult = results[0];
    const externalResult = results[1];

    if (localResult.status === "fulfilled") {
      const data = localResult.value.data;
      setLocalJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } else {
      console.error("Local jobs error:", localResult.reason);
      setError("Local jobs load nahi hui.");
    }

    if (externalResult.status === "fulfilled") {
      const data = externalResult.value.data;
      setExternalJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } else {
      console.error(
        "External jobs error:",
        externalResult.reason?.message
      );
      setExternalError("External jobs abhi load nahi ho paayi.");
    }

    if (
      localResult.status === "rejected" &&
      externalResult.status === "rejected"
    ) {
      setError("Jobs load nahi hui. Backend check karo.");
    }

    setLoading(false);
  }

  // Page open hone par local jobs load karo
  useEffect(() => {
    let cancelled = false;

    async function loadInitialJobs() {
      setLoading(true);

      const results = await Promise.allSettled([
        axios.get(`${API}/jobs`),
        axios.get(`${API}/external-jobs`),
      ]);

      if (cancelled) return;

      const localResult = results[0];
      const externalResult = results[1];

      if (localResult.status === "fulfilled") {
        const data = localResult.value.data;
        setLocalJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } else {
        setError("Local jobs load nahi hui.");
      }

      if (externalResult.status === "fulfilled") {
        const data = externalResult.value.data;
        setExternalJobs(Array.isArray(data.jobs) ? data.jobs : []);
      } else {
        setExternalError("External jobs abhi load nahi ho paayi.");
      }

      if (
        localResult.status === "rejected" &&
        externalResult.status === "rejected"
      ) {
        setError("Jobs load nahi hui. Backend check karo.");
      }

      setLoading(false);
    }

    loadInitialJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  // Search change hone par external API ko keyword bhejo
  useEffect(() => {
    // Initial jobs pehle hi load ho chuki hain
    if (firstSearch.current) {
      firstSearch.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      setExternalLoading(true);
      setExternalError("");

      try {
        const response = await axios.get(
          `${API}/external-jobs`,
          {
            params: search.trim()
              ? { search: search.trim() }
              : {},
          }
        );

        setExternalJobs(
          Array.isArray(response.data.jobs)
            ? response.data.jobs
            : []
        );
      } catch (err) {
        console.error(
          "External search error:",
          err.response?.data || err.message
        );

        setExternalError(
          "External search fail hui. Dobara try karo."
        );
      } finally {
        setExternalLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Local aur external jobs ko combine karo
  const jobs = useMemo(() => {
    const combined = [...localJobs, ...externalJobs];

    // Same source ki duplicate jobs remove karo
    const seen = new Set();

    return combined.filter((job) => {
      const key = `${job.source || "local"}-${job.id || job._id}`;

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  }, [localJobs, externalJobs]);

  // Search aur job type ke according filtering
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return jobs.filter((job) => {
      const text = [
        job.title,
        job.company,
        job.location,
        job.description,
        ...(Array.isArray(job.skills) ? job.skills : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || text.includes(q);

      const jobType = String(job.type || "")
        .toLowerCase()
        .replace(/[-_\s]/g, "");

      let matchesType = true;

      if (type === "Full Time") {
        matchesType = jobType === "fulltime";
      } else if (type === "Part Time") {
        matchesType = jobType === "parttime";
      } else if (type === "Internship") {
        matchesType =
          jobType === "internship" || jobType === "intern";
      } else if (type === "Remote") {
        matchesType =
          jobType === "remote" || job.source === "external";
      }

      return matchesSearch && matchesType;
    });
  }, [jobs, search, type]);

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">OPPORTUNITIES</p>
        <h2>Explore Jobs</h2>
        <p>
          Find local and remote opportunities that match your skills.
        </p>
      </div>

      <div className="filters">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search React, developer, company..."
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="All">All Job Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Part Time">Part Time</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>

        <button
          type="button"
          className="primary button"
          onClick={loadJobs}
          disabled={loading || externalLoading}
        >
          {loading || externalLoading
            ? "Loading..."
            : "Refresh Jobs"}
        </button>
      </div>

      <p>
        Showing {filtered.length} of {jobs.length} jobs
      </p>

      {externalLoading && (
        <p>Searching external jobs...</p>
      )}

      {error && (
        <p role="alert">{error}</p>
      )}

      {externalError && (
        <p role="status">{externalError}</p>
      )}

      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <>
          <div className="job-grid">
            {filtered.map((job) => (
              <div key={`${job.source || "local"}-${job.id || job._id}`}>
                <JobCard job={job} />

                {job.source === "external" &&
                  job.applicationUrl && (
                    <a
                      href={job.applicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="primary button"
                    >
                      Apply on {job.publisher || "Job Site"}
                    </a>
                  )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              No jobs found. Try another keyword or refresh jobs.
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Jobs;
