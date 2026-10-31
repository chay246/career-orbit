import { Link } from "react-router-dom";

function JobCard({ job }) {
  const jobId = job._id || job.id;
  const skills = job.skills || [];

  return (
    <article className="job-card">
      <div className="job-head">
        <div className="company-logo">
          {job.company?.[0] || "H"}
        </div>

        <div>
          <h3>{job.title}</h3>
          <p>
            {job.company} · {job.location}
          </p>

          <div className="posted-info">
            <span>Posted by</span>
            <strong>
              {job.postedBy || job.recruiterId?.name || job.company}
            </strong>
            <span>·</span>
            <span>
              {job.postedDate ||
                (job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString()
                  : "Recently")}
            </span>
          </div>
        </div>
      </div>

      <div className="tags">
        {skills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>

      <div className="job-bottom">
        <div>
          <small>Skill match</small>
          <strong>{job.match ?? 0}%</strong>
        </div>

        <div className="job-salary">
          <small>Salary</small>
          <strong>{job.salary || "Not disclosed"}</strong>
        </div>

        <Link className="primary small" to={`/jobs/${jobId}`}>
          View Job
        </Link>
      </div>
    </article>
  );
}

export default JobCard;