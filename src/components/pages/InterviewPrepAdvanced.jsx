import { useEffect, useState } from "react";
import axios from "axios";
import PaymentModal from "../PaymentModal";
import { courseNotesData } from "../../data/courseNotesData";

const API = "http://localhost:5000/api";

const advancedCourses = [
  {
    id: "nodejs",
    title: "Node.js Complete Guide",
    subtitle: "Backend and API Engineering",
    price: 1, // Testing mode: ₹1
    icon: "🟩",
    level: "Intermediate to Advanced",
    duration: "4 Video Lectures • 4 In-Depth Modules",
    notes: [
      "Node.js fundamentals, V8 & Event Loop",
      "Express.js and custom middleware pipeline",
      "REST APIs, validation & error handling",
      "MongoDB database integration & indexes",
      "JWT authentication and security practices",
      "Production deployment and real-world project",
    ],
    strategy:
      "Watch the video lectures first, code along with the modules, build a production API after each topic, and finish with a secure authentication system.",
  },
  {
    id: "react",
    title: "React.js Masterclass",
    subtitle: "Frontend Development Strategy",
    price: 1, // Testing mode: ₹1
    icon: "⚛️",
    level: "Beginner to Advanced",
    duration: "4 Video Lectures • 4 In-Depth Modules",
    notes: [
      "Components, props and JSX internals",
      "Virtual DOM diffing & Fiber reconciler",
      "Advanced hooks (useMemo, useCallback, useRef)",
      "Global state: Redux Toolkit & Context API",
      "Code splitting, lazy loading & performance",
      "Building a production SaaS dashboard",
    ],
    strategy:
      "Master component composition, understand why re-renders occur, and build modular stateful dashboards.",
  },
  {
    id: "javascript",
    title: "JavaScript Advanced",
    subtitle: "Master Modern JavaScript",
    price: 1, // Testing mode: ₹1
    icon: "🟨",
    level: "Intermediate",
    duration: "4 Video Lectures • 3 In-Depth Modules",
    notes: [
      "Execution contexts, call stack & hoisting",
      "Lexical scoping, closures & currying",
      "Promises, async/await, and event loop microtasks",
      "Prototypal inheritance & 'this' keyword rules",
      "DOM events, debouncing & throttling",
      "Top product company output questions",
    ],
    strategy:
      "Practise output-based questions daily, explain the reason behind each output, and write examples without looking at notes.",
  },
  {
    id: "system-design",
    title: "System Design",
    subtitle: "Architecture and Scalability",
    price: 1, // Testing mode: ₹1
    icon: "🏗️",
    level: "Advanced",
    duration: "4 Video Lectures • 3 In-Depth Modules",
    notes: [
      "Horizontal vs vertical scaling & reverse proxies",
      "Load balancing algorithms & consistent hashing",
      "Caching strategies (Redis) & eviction policies",
      "Database sharding, replication & CAP theorem",
      "Message queues & asynchronous job processing",
      "TinyURL & real-time chat architecture case studies",
    ],
    strategy:
      "Start with requirements, estimate traffic, draw the architecture, identify bottlenecks, and explain trade-offs.",
  },
  {
    id: "dsa",
    title: "DSA Interview Strategy",
    subtitle: "Problem Solving and Placement Prep",
    price: 1, // Testing mode: ₹1
    icon: "🧠",
    level: "All Levels",
    duration: "4 Video Lectures • 2 In-Depth Modules",
    notes: [
      "Time & space complexity analysis (Big-O)",
      "Two pointers & sliding window patterns",
      "Binary trees, BST & tree traversals (BFS/DFS)",
      "Dynamic programming patterns & memoization",
      "Graph algorithms (Dijkstra, topological sort)",
      "FAANG coding interview problem breakdowns",
    ],
    strategy:
      "Solve problems from brute force to optimized solutions, dry-run with examples, and revise mistakes every week.",
  },
];

export default function InterviewPrepAdvanced() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [paymentCourse, setPaymentCourse] = useState(null);
  const [unlockedCourses, setUnlockedCourses] = useState([]);
  const [unlockedViewTab, setUnlockedViewTab] = useState("videos"); // videos | notes | interview | strategy
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load purchased courses from backend + localStorage
  useEffect(() => {
    const loadAccess = async () => {
      try {
        const token = localStorage.getItem("hirehub_token");
        const storedUser = localStorage.getItem("hirehub_user");
        let userEmail = "";
        if (storedUser) {
          try {
            const u = JSON.parse(storedUser);
            userEmail = u.contact || u.email || "";
          } catch {
            // ignore
          }
        }

        let loadedIds = [];

        // 1. JWT Endpoint
        if (token) {
          try {
            const res = await axios.get(`${API}/courses/my-access`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (Array.isArray(res.data.courseIds)) {
              loadedIds = [...loadedIds, ...res.data.courseIds];
            }
          } catch {
            // ignore
          }
        }

        // 2. Email Query
        if (userEmail && userEmail.includes("@")) {
          try {
            const emailRes = await axios.get(
              `${API}/courses/check-by-email?email=${encodeURIComponent(
                userEmail.toLowerCase().trim()
              )}`
            );
            if (Array.isArray(emailRes.data.courseIds)) {
              loadedIds = [...loadedIds, ...emailRes.data.courseIds];
            }
          } catch {
            // ignore
          }
        }

        // 3. LocalStorage Backup
        try {
          const cached = JSON.parse(
            localStorage.getItem("hirehub_unlocked_courses") || "[]"
          );
          if (Array.isArray(cached)) {
            loadedIds = [...loadedIds, ...cached];
          }
        } catch {
          // ignore
        }

        const unique = [...new Set(loadedIds)];
        setUnlockedCourses(unique);
      } catch (error) {
        console.error("Course access could not be loaded.", error);
      } finally {
        setLoading(false);
      }
    };

    loadAccess();
  }, []);

  return (
    <section className="advanced-courses">
      <div className="courses-hero">
        <span className="courses-tag">PAID COURSE PLATFORM</span>
        <h1>Crack Tech Interviews with Confidence</h1>
        <p>
          Master full stack web development, system architecture, and algorithmic problem
          solving with high-definition video lectures, detailed notes, complete code
          implementations, and top company interview questions.
        </p>

        <div className="courses-badge-row">
          <span>⚡ ₹1 Testing Fee Active</span>
          <span>🎥 Video Lectures + Notes Included</span>
          <span>🔒 Lifetime Access Tied to Your Email</span>
        </div>
      </div>

      {message && (
        <div className="courses-message-banner">
          {message}
        </div>
      )}

      {/* Course Grid */}
      <div className="premium-course-grid">
        {advancedCourses.map((course) => {
          const unlocked = unlockedCourses.includes(course.id);

          return (
            <article
              key={course.id}
              className={`course-card ${unlocked ? "unlocked" : "locked"}`}
            >
              <div className="course-card-top">
                <span className="course-icon">{course.icon}</span>
                <span className={`status-pill ${unlocked ? "unlocked" : "locked"}`}>
                  {unlocked ? "✓ Unlocked" : "🔒 Premium (₹1)"}
                </span>
              </div>

              <h3>{course.title}</h3>
              <p className="course-subtitle">{course.subtitle}</p>

              <div className="course-meta">
                <span>📊 {course.level}</span>
                <span>⏱️ {course.duration}</span>
              </div>

              <div className="course-price-row">
                <span className="price-tag">₹{course.price}</span>
                <span className="price-info">
                  {unlocked ? "Lifetime Access Active" : "Testing Special: Only ₹1"}
                </span>
              </div>

              {unlocked ? (
                <button
                  className="course-action unlocked-action"
                  onClick={() => {
                    setSelectedCourse(course);
                    setUnlockedViewTab("videos");
                    setActiveVideoIndex(0);
                    setMessage("");
                  }}
                >
                  🎥 Open Course (Videos & Notes) →
                </button>
              ) : (
                <div className="course-card-actions">
                  <button
                    className="course-preview-btn"
                    onClick={() => {
                      setSelectedCourse(course);
                      setMessage("");
                    }}
                  >
                    Preview
                  </button>
                  <button
                    className="course-action unlock-now-btn"
                    onClick={() => {
                      setSelectedCourse(null);
                      setPaymentCourse(course);
                      setMessage("");
                    }}
                  >
                    ⚡ Unlock Now (₹{course.price})
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* COURSE DETAILS / UNLOCKED LEARNING DASHBOARD MODAL */}
      {selectedCourse && (
        <div
          className="course-modal-backdrop"
          onClick={() => setSelectedCourse(null)}
        >
          <section
            className="course-modal course-player-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="course-modal-close"
              onClick={() => setSelectedCourse(null)}
              aria-label="Close course details"
            >
              ×
            </button>

            <span className="courses-eyebrow">
              {unlockedCourses.includes(selectedCourse.id)
                ? "YOUR UNLOCKED PREMIUM COURSE"
                : "PREMIUM COURSE PREVIEW"}
            </span>

            <h2 id="course-modal-title">{selectedCourse.title}</h2>
            <p className="course-modal-subtitle">
              {selectedCourse.subtitle} • {selectedCourse.level}
            </p>

            {unlockedCourses.includes(selectedCourse.id) ? (
              /* UNLOCKED: FULL LEARNING DASHBOARD (VIDEOS + NOTES + Q&A) */
              <div className="course-unlocked-container">
                <div className="unlocked-hero-banner">
                  <div className="unlocked-hero-left">
                    <span className="unlocked-pill-badge">✓ FULL COURSE UNLOCKED</span>
                    <h3>Complete Learning Platform: Videos, In-Depth Notes & Interview Q&A</h3>
                    <p>All video lectures, architecture diagrams, source code snippets, and top interview questions are available below.</p>
                  </div>
                  <button
                    type="button"
                    className="unlocked-print-btn"
                    onClick={() => window.print()}
                  >
                    🖨️ Print / Save Notes
                  </button>
                </div>

                {/* Unlocked Navigation Tabs */}
                <div className="unlocked-tab-switcher">
                  <button
                    type="button"
                    className={`unlocked-switch-btn ${unlockedViewTab === "videos" ? "active" : ""}`}
                    onClick={() => setUnlockedViewTab("videos")}
                  >
                    🎥 Video Lectures
                  </button>
                  <button
                    type="button"
                    className={`unlocked-switch-btn ${unlockedViewTab === "notes" ? "active" : ""}`}
                    onClick={() => setUnlockedViewTab("notes")}
                  >
                    📚 In-Depth Modules & Notes
                  </button>
                  <button
                    type="button"
                    className={`unlocked-switch-btn ${unlockedViewTab === "interview" ? "active" : ""}`}
                    onClick={() => setUnlockedViewTab("interview")}
                  >
                    🎯 Top Interview Q&A
                  </button>
                  <button
                    type="button"
                    className={`unlocked-switch-btn ${unlockedViewTab === "strategy" ? "active" : ""}`}
                    onClick={() => setUnlockedViewTab("strategy")}
                  >
                    🚀 Learning Strategy
                  </button>
                </div>

                {/* TAB 1: VIDEO LECTURES WITH INTERACTIVE PLAYER */}
                {unlockedViewTab === "videos" && (
                  <div className="unlocked-tab-content video-tab-layout">
                    {courseNotesData[selectedCourse.id]?.videos ? (
                      <div className="course-video-player-container">
                        {/* Main Video Screen */}
                        <div className="main-video-player-box">
                          {(() => {
                            const currentVid =
                              courseNotesData[selectedCourse.id].videos[activeVideoIndex] ||
                              courseNotesData[selectedCourse.id].videos[0];
                            return (
                              <>
                                <div className="video-iframe-responsive">
                                  <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${currentVid.embedId}?rel=0&modestbranding=1`}
                                    title={currentVid.title}
                                    className="course-video-iframe"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                                <div className="video-player-meta">
                                  <div className="video-title-row">
                                    <h4>{currentVid.title}</h4>
                                    <span className="video-duration-pill">⏱️ {currentVid.duration}</span>
                                  </div>
                                  <p className="video-summary-desc">{currentVid.summary}</p>
                                  <div className="video-instructor-tag">
                                    👨‍🏫 Instructor: <strong>{currentVid.instructor}</strong>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </div>

                        {/* Video Lecture Playlist */}
                        <div className="course-video-playlist-box">
                          <div className="playlist-header">
                            <h5>Course Curriculum ({courseNotesData[selectedCourse.id].videos.length} Lectures)</h5>
                            <span>✓ All Unlocked</span>
                          </div>
                          <div className="playlist-items-list">
                            {courseNotesData[selectedCourse.id].videos.map((vid, vIdx) => (
                              <div
                                key={vid.id}
                                className={`playlist-item-card ${activeVideoIndex === vIdx ? "active" : ""}`}
                                onClick={() => setActiveVideoIndex(vIdx)}
                              >
                                <span className="playlist-play-icon">
                                  {activeVideoIndex === vIdx ? "▶️" : "🎬"}
                                </span>
                                <div className="playlist-item-info">
                                  <strong>{vid.title}</strong>
                                  <span>{vid.duration}</span>
                                </div>
                                {activeVideoIndex === vIdx && (
                                  <span className="now-playing-badge">Playing</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p>No video lectures available for this course yet.</p>
                    )}
                  </div>
                )}

                {/* TAB 2: IN-DEPTH MODULES WITH CODE */}
                {unlockedViewTab === "notes" && (
                  <div className="unlocked-tab-content">
                    {courseNotesData[selectedCourse.id]?.modules ? (
                      courseNotesData[selectedCourse.id].modules.map((mod, index) => (
                        <div key={index} className="full-module-card">
                          <div className="module-card-header">
                            <span className="module-num-badge">Module {index + 1}</span>
                            <h4>{mod.title}</h4>
                          </div>
                          <p className="module-summary-tagline">{mod.summary}</p>
                          <div className="module-text-body">
                            <pre className="module-pre-text">{mod.content}</pre>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="course-modal-content">
                        <h3>📒 Course Outline</h3>
                        <ul>
                          {selectedCourse.notes.map((note) => (
                            <li key={note}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: INTERVIEW QUESTIONS & ANSWERS */}
                {unlockedViewTab === "interview" && (
                  <div className="unlocked-tab-content">
                    {courseNotesData[selectedCourse.id]?.interviewQA?.map((item, index) => (
                      <div key={index} className="qa-card-box">
                        <div className="qa-question-row">
                          <span className="qa-badge">Q{index + 1}</span>
                          <strong>{item.q}</strong>
                        </div>
                        <div className="qa-answer-row">
                          <span className="ans-label">Model Answer:</span>
                          <p>{item.a}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 4: LEARNING STRATEGY */}
                {unlockedViewTab === "strategy" && (
                  <div className="unlocked-tab-content">
                    <div className="strategy-detailed-card">
                      <h4>🎯 Recommended Interview Prep Strategy</h4>
                      <p>{selectedCourse.strategy}</p>
                      <div className="strategy-milestones">
                        <div>📅 Week 1: Master Core Fundamentals & Syntax</div>
                        <div>📅 Week 2: Build Real-World Project & Practice Middleware/State</div>
                        <div>📅 Week 3: Mock Interviews & Output-Based Questions</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* LOCKED: PREVIEW & "PLEASE PAYMENT FIRST" NOTICE */
              <>
                <div className="course-locked-notice-card">
                  <div className="locked-notice-icon">🔒</div>
                  <div>
                    <h4>Please complete payment first to unlock full access</h4>
                    <p>
                      This premium course is currently locked. To view the complete <strong>Video Lectures</strong>, detailed module notes, code implementations, and interview solutions, please complete the ₹1 test payment.
                    </p>
                  </div>
                </div>

                <div className="course-modal-content">
                  <h3>📒 Course Syllabus Preview</h3>
                  <ul>
                    {selectedCourse.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>

                  <h3>🚀 Learning Strategy</h3>
                  <p>{selectedCourse.strategy}</p>
                </div>

                <div className="course-purchase-box">
                  <div>
                    <div>
                      <span>Unlock Complete Course</span>
                      <p className="payment-methods-subtext">
                        🎥 Includes 4 Video Lectures + In-Depth Notes + Interview Q&A
                      </p>
                    </div>
                    <strong>₹{selectedCourse.price}</strong>
                  </div>

                  <button
                    className="course-action"
                    onClick={() => {
                      const c = selectedCourse;
                      setSelectedCourse(null);
                      setPaymentCourse(c);
                    }}
                  >
                    ⚡ Pay ₹{selectedCourse.price} & Unlock Course Now
                  </button>

                  <small>
                    Testing Mode Active: Only ₹{selectedCourse.price} required to unlock and test payment gateway. Access will be tied to your email permanently.
                  </small>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* MULTI-METHOD PAYMENT CHECKOUT MODAL */}
      {paymentCourse && (
        <PaymentModal
          course={paymentCourse}
          onClose={() => setPaymentCourse(null)}
          onSuccess={(unlockedCourseId) => {
            setUnlockedCourses((prev) =>
              prev.includes(unlockedCourseId)
                ? prev
                : [...prev, unlockedCourseId]
            );
            setMessage(
              `🎉 ${paymentCourse.title} unlocked successfully! Lifetime access is now active.`
            );
            // Open the course dashboard immediately with videos active!
            setSelectedCourse(paymentCourse);
            setUnlockedViewTab("videos");
            setActiveVideoIndex(0);
          }}
        />
      )}
    </section>
  );
}
