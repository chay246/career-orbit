import { useMemo, useState, useEffect } from "react";

const questions = [
  {
    id: 1,
    category: "HTML",
    level: "Beginner",
    question: "What is the difference between div and span?",
    answer: "div is a block-level element and normally starts on a new line. span is an inline element and is used to style or group small parts of text.",
  },
  {
    id: 2,
    category: "HTML",
    level: "Beginner",
    question: "What is semantic HTML?",
    answer: "Semantic HTML uses meaningful elements such as header, nav, main, section, article and footer to describe the structure of a page.",
  },
  {
    id: 3,
    category: "CSS",
    level: "Beginner",
    question: "What is the CSS box model?",
    answer: "The box model consists of content, padding, border and margin. box-sizing: border-box includes padding and border in the declared width and height.",
  },
  {
    id: 4,
    category: "JavaScript",
    level: "Beginner",
    question: "What is the difference between var, let and const?",
    answer: "var is function-scoped. let and const are block-scoped. let can be reassigned, while const cannot be reassigned after initialization.",
  },
  {
    id: 5,
    category: "React",
    level: "Intermediate",
    question: "What is the useState hook?",
    answer: "useState is a React hook that lets a function component store state and update the UI when that state changes.",
  }
];

const mcqs = [
  {
    question: "Which keyword declares a block-scoped variable?",
    options: ["var", "let", "global", "define"],
    answer: 1,
    explanation: "let is block-scoped. const is also block-scoped.",
  },
  {
    question: "Which React hook stores component state?",
    options: ["useState", "useRoute", "useFetch", "useClass"],
    answer: 0,
    explanation: "useState stores state in function components.",
  }
];

const categories = ["All", "HTML", "CSS", "JavaScript", "React"];

export default function InterviewPrep() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [opened, setOpened] = useState([]);
  const [tab, setTab] = useState("questions");
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("hirehub_interview_progress")
      ) || {
        viewedQuestions: [],
        attempts: [],
      };
    } catch {
      return {
        viewedQuestions: [],
        attempts: [],
      };
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "hirehub_interview_progress",
      JSON.stringify(progress)
    );
  }, [progress]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      const matchesCategory =
        category === "All" || item.category === category;
      const matchesLevel =
        level === "All" || item.level === level;
      const text = `${item.question} ${item.answer} ${item.category}`.toLowerCase();

      return matchesCategory &&
        matchesLevel &&
        text.includes(search.toLowerCase());
    });
  }, [category, level, search]);

  function toggleAnswer(id) {
    const isOpening = !opened.includes(id);

    setOpened((previous) =>
      isOpening
        ? [...previous, id]
        : previous.filter((item) => item !== id)
    );

    if (isOpening) {
      setProgress((previous) => ({
        ...previous,
        viewedQuestions: previous.viewedQuestions.includes(id)
          ? previous.viewedQuestions
          : [...previous.viewedQuestions, id],
      }));
    }
  }

  function startQuiz() {
    setQuizIndex(0);
    setSelected({});
    setSubmitted(false);
    setTab("quiz");
  }

  const score = mcqs.reduce(
    (total, item, index) =>
      total + (selected[index] === item.answer ? 1 : 0),
    0
  );

  return (
    <div className="prep-page">
      <section className="prep-hero">
        <div className="prep-hero-content">
          <span className="prep-eyebrow">
            CAREERORBIT ACADEMY
          </span>

          <h1>
            Prepare smarter.
            <br />
            <span>Interview with confidence.</span>
          </h1>

          <p>
            Practice frequently asked technical questions,
            improve your fundamentals and test your knowledge.
          </p>

          <div className="prep-hero-actions">
            <button onClick={() => setTab("questions")}>
              Explore Questions
            </button>
            <button
              className="prep-secondary-btn"
              onClick={startQuiz}
            >
              Start MCQ Practice
            </button>
          </div>
        </div>
      </section>

      <div className="prep-tabs">
        <button
          className={tab === "questions" ? "active" : ""}
          onClick={() => setTab("questions")}
        >
          Most Asked Questions
        </button>

        <button
          className={tab === "quiz" ? "active" : ""}
          onClick={() => setTab("quiz")}
        >
          MCQ Practice
        </button>
      </div>

      {tab === "questions" && (
        <section className="prep-content">
          <div className="prep-section-heading">
            <div>
              <h2>Technical Interview Questions</h2>
              <p>Prepare topic-wise for placements and interviews.</p>
            </div>
            <span>{filteredQuestions.length} results</span>
          </div>

          <input
            className="prep-search"
            type="search"
            placeholder="Search questions or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="prep-question-list" style={{ marginTop: "20px" }}>
            {filteredQuestions.map((item, index) => (
              <article className="prep-question" key={item.id}>
                <button
                  className="prep-question-title"
                  onClick={() => toggleAnswer(item.id)}
                  aria-expanded={opened.includes(item.id)}
                >
                  <span>
                    {index + 1}. {item.question}
                  </span>
                  <span>{opened.includes(item.id) ? "−" : "+"}</span>
                </button>

                {opened.includes(item.id) && (
                  <p className="prep-answer">{item.answer}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "quiz" && (
        <section className="prep-content">
          {!submitted ? (
            <div className="prep-quiz-card">
              <h3>{mcqs[quizIndex].question}</h3>

              <div className="prep-options">
                {mcqs[quizIndex].options.map((option, index) => (
                  <button
                    key={option}
                    className={
                      selected[quizIndex] === index
                        ? "selected"
                        : ""
                    }
                    onClick={() =>
                      setSelected((previous) => ({
                        ...previous,
                        [quizIndex]: index,
                      }))
                    }
                  >
                    <span>{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </button>
                ))}
              </div>

              <button
                className="primary button"
                disabled={selected[quizIndex] === undefined}
                onClick={() => {
                  if (quizIndex < mcqs.length - 1) {
                    setQuizIndex(quizIndex + 1);
                  } else {
                    setSubmitted(true);
                  }
                }}
              >
                {quizIndex < mcqs.length - 1 ? "Next Question" : "Submit Test"}
              </button>
            </div>
          ) : (
            <div className="prep-results">
              <h2>Your Score: {score} / {mcqs.length}</h2>
              <button onClick={startQuiz} className="primary button">Try Again</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}