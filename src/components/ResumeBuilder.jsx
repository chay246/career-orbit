
import { useState } from "react";
import jsPDF from "jspdf";

const initialResume = {
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  summary: "",
  skills: "",
  tenthSchool: "",
  tenthBoard: "",
  tenthYear: "",
  tenthPercentage: "",
  twelfthSchool: "",
  twelfthBoard: "",
  twelfthYear: "",
  twelfthPercentage: "",
  college: "",
  degree: "",
  graduationYear: "",
  graduationPercentage: "",
  experience: "",
  projects: "",
  certificates: "",
  hobbies: "",
  languages: "",
};

export default function ResumeBuilder() {
  const [resume, setResume] = useState(initialResume);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setResume((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const sections = [
    {
      title: "Personal Details",
      fields: [
        ["fullName", "Full Name", "text"],
        ["title", "Professional Title", "text"],
        ["email", "Email Address", "email"],
        ["phone", "Phone Number", "tel"],
        ["location", "City / Location", "text"],
        ["linkedin", "LinkedIn Profile URL", "url"],
        ["github", "GitHub / Portfolio URL", "url"],
      ],
    },
    {
      title: "Professional Summary",
      fields: [
        ["summary", "Career Summary", "textarea"],
      ],
    },
    {
      title: "Education - Class 10th",
      fields: [
        ["tenthSchool", "School Name", "text"],
        ["tenthBoard", "Board Name", "text"],
        ["tenthYear", "Passing Year", "number"],
        ["tenthPercentage", "Percentage / CGPA", "text"],
      ],
    },
    {
      title: "Education - Class 12th",
      fields: [
        ["twelfthSchool", "School / College Name", "text"],
        ["twelfthBoard", "Board Name", "text"],
        ["twelfthYear", "Passing Year", "number"],
        ["twelfthPercentage", "Percentage / CGPA", "text"],
      ],
    },
    {
      title: "Graduation / Higher Education",
      fields: [
        ["college", "College / University", "text"],
        ["degree", "Degree / Course", "text"],
        ["graduationYear", "Passing Year / Expected Year", "number"],
        ["graduationPercentage", "Percentage / CGPA", "text"],
      ],
    },
    {
      title: "Skills",
      fields: [
        ["skills", "Technical & Other Skills", "textarea"],
      ],
    },
    {
      title: "Work Experience / Internship",
      fields: [
        ["experience", "Company, Role, Duration & Responsibilities", "textarea"],
      ],
    },
    {
      title: "Projects",
      fields: [
        ["projects", "Project Name, Technologies & Description", "textarea"],
      ],
    },
    {
      title: "Certificates",
      fields: [
        ["certificates", "Certificate Name, Issuer & Year", "textarea"],
      ],
    },
    {
      title: "Additional Information",
      fields: [
        ["hobbies", "Hobbies & Interests", "textarea"],
        ["languages", "Languages Known", "text"],
      ],
    },
  ];

  const requiredFields = [
    "fullName",
    "title",
    "email",
    "phone",
    "location",
    "summary",
    "skills",
    "tenthSchool",
    "tenthBoard",
    "tenthYear",
    "tenthPercentage",
    "twelfthSchool",
    "twelfthBoard",
    "twelfthYear",
    "twelfthPercentage",
    "college",
    "degree",
    "graduationYear",
    "graduationPercentage",
    "experience",
    "projects",
    "certificates",
    "hobbies",
    "languages",
  ];

  const fieldLabels = {
    fullName: "Full Name",
    title: "Professional Title",
    email: "Email",
    phone: "Phone Number",
    location: "Location",
    summary: "Career Summary",
    skills: "Skills",
    tenthSchool: "10th School",
    tenthBoard: "10th Board",
    tenthYear: "10th Passing Year",
    tenthPercentage: "10th Percentage / CGPA",
    twelfthSchool: "12th School",
    twelfthBoard: "12th Board",
    twelfthYear: "12th Passing Year",
    twelfthPercentage: "12th Percentage / CGPA",
    college: "College / University",
    degree: "Degree / Course",
    graduationYear: "Graduation Year",
    graduationPercentage: "Graduation Percentage / CGPA",
    experience: "Work Experience / Internship",
    projects: "Projects",
    certificates: "Certificates",
    hobbies: "Hobbies",
    languages: "Languages",
  };

  const handleDownload = async (e) => {
    e.preventDefault();

    const missing = requiredFields.filter(
      (field) => !String(resume[field] ?? "").trim()
    );

    if (missing.length > 0) {
      setError(
        "Please fill all required fields: " +
          missing.map((field) => fieldLabels[field]).join(", ")
      );

      const element = document.querySelector(
        `[name="${missing[0]}"]`
      );

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      element?.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setDownloading(true);
    setError("");

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      let y = 18;

      const addPageIfNeeded = (height = 10) => {
        if (y + height > pageHeight - 15) {
          pdf.addPage();
          y = 18;
        }
      };

      const addText = (
        text,
        { size = 10, bold = false, color = [45, 55, 72] } = {}
      ) => {
        pdf.setFont("helvetica", bold ? "bold" : "normal");
        pdf.setFontSize(size);
        pdf.setTextColor(...color);

        const lines = pdf.splitTextToSize(
          String(text),
          contentWidth
        );

        addPageIfNeeded(lines.length * (size * 0.45) + 3);

        pdf.text(lines, margin, y);
        y += lines.length * (size * 0.45) + 3;
      };

      const addSection = (title, content) => {
        addPageIfNeeded(14);

        y += 2;
        pdf.setFillColor(37, 99, 235);
        pdf.rect(margin, y - 4, 2, 7, "F");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(30, 41, 59);
        pdf.text(title, margin + 5, y + 1);

        y += 8;

        addText(content);
      };

      // Name and professional title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(21);
      pdf.setTextColor(30, 41, 59);

      const nameLines = pdf.splitTextToSize(
        resume.fullName,
        contentWidth
      );

      pdf.text(nameLines, margin, y);
      y += nameLines.length * 9 + 1;

      addText(resume.title, {
        size: 12,
        bold: true,
        color: [37, 99, 235],
      });

      addText(
        [
          resume.email,
          resume.phone,
          resume.location,
        ].join(" | "),
        { size: 9 }
      );

      const links = [resume.linkedin, resume.github]
        .filter(Boolean)
        .join(" | ");

      if (links) {
        addText(links, { size: 9 });
      }

      pdf.setDrawColor(203, 213, 225);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 5;

      addSection("PROFESSIONAL SUMMARY", resume.summary);

      addSection(
        "EDUCATION",
        [
          `Class 10th: ${resume.tenthSchool}`,
          `Board: ${resume.tenthBoard} | Year: ${resume.tenthYear} | Score: ${resume.tenthPercentage}`,
          "",
          `Class 12th: ${resume.twelfthSchool}`,
          `Board: ${resume.twelfthBoard} | Year: ${resume.twelfthYear} | Score: ${resume.twelfthPercentage}`,
          "",
          `${resume.degree} - ${resume.college}`,
          `Year: ${resume.graduationYear} | Score: ${resume.graduationPercentage}`,
        ].join("\n")
      );

      addSection("TECHNICAL & OTHER SKILLS", resume.skills);
      addSection("WORK EXPERIENCE & INTERNSHIPS", resume.experience);
      addSection("PROJECTS", resume.projects);
      addSection("CERTIFICATIONS", resume.certificates);
      addSection("HOBBIES & INTERESTS", resume.hobbies);
      addSection("LANGUAGES", resume.languages);

      // Add page numbers
      const pageCount = pdf.internal.getNumberOfPages();

      for (let page = 1; page <= pageCount; page++) {
        pdf.setPage(page);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);

        pdf.text(
          `Page ${page} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 7,
          { align: "center" }
        );
      }

      const safeName = resume.fullName
        .trim()
        .replace(/[^a-z0-9]/gi, "_")
        .replace(/^_+|_+$/g, "");

      pdf.save(`${safeName || "My"}_Resume.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setError("PDF could not be generated. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section className="section resume-builder">
      <div className="section-heading">
        <p className="eyebrow">CAREER TOOLKIT</p>
        <h2>Professional Resume Builder</h2>
        <p>
          Complete your details, education, experience and projects
          to generate your resume as a PDF.
        </p>
      </div>

      <div className="resume-layout">
        <form
          className="onboarding-card resume-form"
          onSubmit={handleDownload}
          noValidate
        >
          {sections.map((section) => (
            <div className="resume-form-section" key={section.title}>
              <h3>{section.title}</h3>

              <div className="resume-fields">
                {section.fields.map(([name, label, type]) => (
                  <label
                    className="resume-field"
                    key={name}
                    htmlFor={name}
                  >
                    <span>
                      {label}
                      {name !== "linkedin" && name !== "github" && (
                        <span className="required-mark"> *</span>
                      )}
                    </span>

                    {type === "textarea" ? (
                      <textarea
                        id={name}
                        name={name}
                        value={resume[name]}
                        onChange={handleChange}
                        rows={4}
                        required={
                          requiredFields.includes(name)
                        }
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    ) : (
                      <input
                        id={name}
                        name={name}
                        type={type}
                        value={resume[name]}
                        onChange={handleChange}
                        required={
                          requiredFields.includes(name)
                        }
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {error && (
            <div className="resume-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="primary button resume-download"
            type="submit"
            disabled={downloading}
          >
            {downloading
              ? "Generating PDF..."
              : "Download Resume PDF"}
          </button>
        </form>

        <aside className="resume-preview">
          <div className="resume-preview-toolbar">
            <h3>Live Resume Preview</h3>
            <span>Preview</span>
          </div>

          <article className="resume-paper">
            <header className="resume-paper-header">
              <h1>{resume.fullName || "Your Full Name"}</h1>
              <h2>{resume.title || "Professional Title"}</h2>

              <p>
                {[resume.email, resume.phone, resume.location]
                  .filter(Boolean)
                  .join(" | ") || "Email | Phone | Location"}
              </p>

              {[resume.linkedin, resume.github]
                .filter(Boolean)
                .map((link) => (
                  <p key={link}>{link}</p>
                ))}
            </header>

            {[
              ["Professional Summary", resume.summary],
              [
                "Education",
                [
                  resume.tenthSchool &&
                    `10th: ${resume.tenthSchool} | ${resume.tenthBoard} | ${resume.tenthYear} | ${resume.tenthPercentage}`,
                  resume.twelfthSchool &&
                    `12th: ${resume.twelfthSchool} | ${resume.twelfthBoard} | ${resume.twelfthYear} | ${resume.twelfthPercentage}`,
                  resume.college &&
                    `${resume.degree} - ${resume.college} | ${resume.graduationYear} | ${resume.graduationPercentage}`,
                ]
                  .filter(Boolean)
                  .join("\n"),
              ],
              ["Skills", resume.skills],
              ["Experience", resume.experience],
              ["Projects", resume.projects],
              ["Certificates", resume.certificates],
              ["Hobbies", resume.hobbies],
              ["Languages", resume.languages],
            ].map(([title, content]) => (
              <section className="resume-paper-section" key={title}>
                <h3>{title}</h3>
                <p>{content || `Your ${title.toLowerCase()} will appear here.`}</p>
              </section>
            ))}
          </article>
        </aside>
      </div>
    </section>
  );
}
