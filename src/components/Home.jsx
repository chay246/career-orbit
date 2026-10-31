import { Link } from "react-router-dom";

function Home() {
  const companies = ["NovaTech", "CodeCraft", "PixelWorks", "DataLoop"];

  return (
    <>
      <section className="unique-hero">
        <div className="hero-left">
          <div className="availability">
            <span></span> 2,400+ fresh opportunities this week
          </div>

          <h1>
            Turn your <em>skills</em>
            <br />
            into your next move.
          </h1>

          <p>
            CareerOrbit helps students and developers discover roles that
            actually fit what they know — not just what a keyword filter finds.
          </p>

          <div className="hero-actions">
            <Link className="primary hero-primary" to="/jobs">
              Find My Next Role <span>↗</span>
            </Link>

            <Link className="hero-text-link" to="/register">
              Build my profile →
            </Link>
          </div>

          <div className="hero-proof">
            <div>
              <b>91%</b>
              <span>average profile match</span>
            </div>
            <i></i>
            <div>
              <b>10K+</b>
              <span>active opportunities</span>
            </div>
            <i></i>
            <div>
              <b>500+</b>
              <span>hiring companies</span>
            </div>
          </div>
        </div>

        <div className="orbit-board">
          <div className="board-main">
            <div className="board-top">
              <span>YOUR CAREER SIGNAL</span>
              <b>LIVE</b>
            </div>

            <div className="signal-ring">
              <div className="signal-core">
                92<small>%</small>
                <label>FIT</label>
              </div>
              <div className="ring-dot dot-one"></div>
              <div className="ring-dot dot-two"></div>
            </div>

            <div className="signal-caption">
              <b>Full Stack Developer</b>
              <span>NovaTech · Bengaluru</span>
            </div>

            <div className="skill-pills">
              <span>React ✓</span>
              <span>Node.js ✓</span>
              <span>MongoDB ✓</span>
              <span>Express +</span>
            </div>
          </div>

          <div className="float-card float-one">
            <span className="float-icon">↗</span>
            <div>
              <b>12</b>
              <small>new matches</small>
            </div>
          </div>

          <div className="float-card float-two">
            <span className="float-icon">★</span>
            <div>
              <b>8.7</b>
              <small>profile strength</small>
            </div>
          </div>
        </div>
      </section>

      <section className="intent-bar">
        <div>
          <span className="intent-icon">⌕</span>
          <div>
            <small>LOOKING FOR</small>
            <b>Internships & full-time roles</b>
          </div>
        </div>

        <div>
          <span className="intent-icon">⌖</span>
          <div>
            <small>WHERE</small>
            <b>Remote · India · Anywhere</b>
          </div>
        </div>

        <Link className="primary intent-btn" to="/jobs">
          Explore opportunities
        </Link>
      </section>

      <section className="unique-section">
        <div className="section-heading">
          <p className="eyebrow">ONE PROFILE. BETTER MATCHES.</p>
          <h2>CareerOrbit understands the person behind the resume.</h2>
          <p>
            Your education, projects, skills and CV come together to create
            a profile recruiters can actually use.
          </p>
        </div>

        <div className="journey">
          <div className="journey-card">
            <span>01</span>
            <div className="journey-line"></div>
            <h3>Build your signal</h3>
            <p>Add your education, skills, projects and CV once.</p>
          </div>

          <div className="journey-card featured">
            <span>02</span>
            <div className="journey-line"></div>
            <h3>See your fit</h3>
            <p>
              Compare your profile against real job requirements and see
              why you match.
            </p>
            <div className="mini-match">
              <b>87%</b>
              <span>skill match</span>
            </div>
          </div>

          <div className="journey-card">
            <span>03</span>
            <div className="journey-line"></div>
            <h3>Apply with confidence</h3>
            <p>
              Know your strengths and missing skills before you send
              an application.
            </p>
          </div>
        </div>
      </section>

      <section className="companies-section">
        <div>
          <p className="eyebrow">HIRING ECOSYSTEM</p>
          <h2>
            Opportunities from teams
            <br />
            building what's next.
          </h2>
        </div>

        <div className="company-stack">
          {companies.map((company, index) => (
            <div key={company} className="company-tile">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{company}</b>
              <small>
                {["Technology", "Software", "Product", "Data"][index]}
              </small>
              <strong>↗</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="unique-cta">
        <div className="cta-shape"></div>
        <div>
          <p className="eyebrow">YOUR NEXT MOVE</p>
          <h2>Stop applying blindly.</h2>
          <p>Build your profile. Understand your fit. Apply smarter.</p>
        </div>
        <Link className="primary cta-button" to="/register">
          Start with Careerorbit ↗
        </Link>
      </section>
      <section className="interview-banner">
      <div className="interview-banner-content">
        <span className="interview-banner-tag">
          CAREERORBIT ACADEMY
        </span>

        <h2>Ready for Your Next Interview?</h2>

        <p>
          Practice technical interview questions, test your skills
          with MCQs, and prepare for your dream job.
        </p>

        <Link to="/interview-prep" className="interview-banner-btn">
          Start Interview Preparation →
        </Link>
      </div>

      <div className="interview-banner-icon">
        🎯
      </div>
    </section>
    
  
    </>
  );
 




}

export default Home;