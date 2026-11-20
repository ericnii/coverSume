import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "./Layout";
import { PageIntro, Section, Field, TextInput, TextArea, Entry } from "./ui";

const ResumeViewer = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAccessTokenSilently, user } = useAuth0();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    phone: "",
    linkedin: "",
    github: "",
    skills: "",
  });

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      jobTitle: "",
      company: "",
      duration: "",
      jobSkills: "",
      jobDescription: "",
    },
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: "",
      projectSkills: "",
      projectDescription: "",
    },
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      education: "",
      degree: "",
      points: "",
    },
  ]);

  const generateResume = async () => {
    setLoading(true);
    setError("");

    const dataToSend = {
      ...formData,
      education: education,
      experiences: experiences,
      project: projects,
      userId: user?.sub,
    };

    console.log("Sending data:", dataToSend);

    try {
      const token = await getAccessTokenSilently();
      console.log("Token obtained:", token.substring(0, 20) + "...");
      const response = await fetch("https://coversume-backend.onrender.com/generate-resume", {
      //const response = await fetch("http://localhost:3001/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: "Unknown error",
          message: `Server error: ${response.status}`,
        }));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setPdfUrl(data.url);
    } catch (err) {
      console.error("Error generating resume:", err);
      setError("Failed to generate resume. Please try again.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleExperienceChange = (id, field, value) => {
    setExperiences(experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: experiences.length + 1,
        jobTitle: "",
        company: "",
        duration: "",
        jobSkills: "",
        jobDescription: "",
      },
    ]);
  };

  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const handleProjectChange = (id, field, value) => {
    setProjects(projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)));
  };

  const addProjects = () => {
    setProjects([
      ...projects,
      {
        id: projects.length + 1,
        projectName: "",
        projectSkills: "",
        projectDescription: "",
      },
    ]);
  };

  const removeProjects = (id) => {
    if (projects.length > 1) {
      setProjects(projects.filter((proj) => proj.id !== id));
    }
  };

  const handleEducationChange = (id, field, value) => {
    setEducation(education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  };

  const addEducations = () => {
    setEducation([
      ...education,
      {
        id: education.length + 1,
        education: "",
        degree: "",
        points: "",
      },
    ]);
  };

  const removeEducations = (id) => {
    if (education.length > 1) {
      setEducation(education.filter((edu) => edu.id !== id));
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <PageIntro kicker="Resume" title="Build your resume">
          Enter the facts. CoverSume sets them in the Jake&apos;s Resume layout and returns a PDF.
        </PageIntro>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateResume();
          }}
        >
          <Section index="01" title="Personal">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name">
                <TextInput
                  name="name"
                  placeholder="Jordan Lee"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Email">
                <TextInput
                  name="email"
                  type="email"
                  placeholder="jordan@email.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </Field>
              <Field label="City">
                <TextInput
                  name="city"
                  placeholder="Toronto, ON"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Phone">
                <TextInput
                  name="phone"
                  placeholder="416-555-0199"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Field>
              <Field label="LinkedIn" hint="Optional.">
                <TextInput
                  name="linkedin"
                  placeholder="linkedin.com/in/jordanlee"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </Field>
              <Field label="GitHub" hint="Optional.">
                <TextInput
                  name="github"
                  placeholder="github.com/jordanlee"
                  value={formData.github}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </Section>

          <Section
            index="02"
            title="Education"
            action={
              <button type="button" onClick={addEducations} className="btn btn-line">
                Add education
              </button>
            }
          >
            {education.map((edu, index) => (
              <Entry
                key={edu.id}
                title={`Education ${index + 1}`}
                onRemove={education.length > 1 ? () => removeEducations(edu.id) : null}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Institution">
                    <TextInput
                      placeholder="University of Toronto"
                      required
                      value={edu.education}
                      onChange={(e) => handleEducationChange(edu.id, "education", e.target.value)}
                    />
                  </Field>
                  <Field label="Degree and graduation">
                    <TextInput
                      placeholder="B.Sc. Computer Science, May 2028"
                      required
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)}
                    />
                  </Field>
                  <Field
                    className="sm:col-span-2"
                    label="Details"
                    hint="Two or three points is enough. Coursework, awards, GPA."
                  >
                    <TextArea
                      placeholder="Dean's List, 2024. Coursework: data structures, operating systems."
                      required
                      value={edu.points}
                      onChange={(e) => handleEducationChange(edu.id, "points", e.target.value)}
                    />
                  </Field>
                </div>
              </Entry>
            ))}
          </Section>

          <Section index="03" title="Skills">
            <Field label="Technical skills" hint="Two or three categories reads better than a long list.">
              <TextArea
                name="skills"
                placeholder="Languages: JavaScript, Python. Frameworks: React, Node.js."
                required
                value={formData.skills}
                onChange={handleChange}
              />
            </Field>
          </Section>

          <Section
            index="04"
            title="Experience"
            action={
              <button type="button" onClick={addExperience} className="btn btn-line">
                Add experience
              </button>
            }
          >
            {experiences.map((experience, index) => (
              <Entry
                key={experience.id}
                title={`Experience ${index + 1}`}
                onRemove={experiences.length > 1 ? () => removeExperience(experience.id) : null}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Job title">
                    <TextInput
                      placeholder="Software engineering intern"
                      required
                      value={experience.jobTitle}
                      onChange={(e) => handleExperienceChange(experience.id, "jobTitle", e.target.value)}
                    />
                  </Field>
                  <Field label="Company and location">
                    <TextInput
                      placeholder="Northwind, Toronto, ON"
                      required
                      value={experience.company}
                      onChange={(e) => handleExperienceChange(experience.id, "company", e.target.value)}
                    />
                  </Field>
                  <Field label="Dates" className="sm:col-span-2">
                    <TextInput
                      placeholder="June 2023 – August 2023"
                      required
                      value={experience.duration}
                      onChange={(e) => handleExperienceChange(experience.id, "duration", e.target.value)}
                    />
                  </Field>
                  <Field className="sm:col-span-2" label="Tools used" hint="Optional.">
                    <TextArea
                      placeholder="React, SQL, Excel"
                      value={experience.jobSkills}
                      onChange={(e) => handleExperienceChange(experience.id, "jobSkills", e.target.value)}
                    />
                  </Field>
                  <Field
                    className="sm:col-span-2"
                    label="What you did"
                    hint="Two or three points. Lead with the result."
                  >
                    <TextArea
                      placeholder="Built and tested features for a cloud app in Node.js and AWS. Cut a slow query path enough to improve response time by 15%."
                      required
                      value={experience.jobDescription}
                      onChange={(e) =>
                        handleExperienceChange(experience.id, "jobDescription", e.target.value)
                      }
                    />
                  </Field>
                </div>
              </Entry>
            ))}
          </Section>

          <Section
            index="05"
            title="Projects"
            action={
              <button type="button" onClick={addProjects} className="btn btn-line">
                Add project
              </button>
            }
          >
            {projects.map((project, index) => (
              <Entry
                key={project.id}
                title={`Project ${index + 1}`}
                onRemove={projects.length > 1 ? () => removeProjects(project.id) : null}
              >
                <div className="grid gap-5">
                  <Field label="Project name">
                    <TextInput
                      placeholder="Ledger"
                      required
                      value={project.projectName}
                      onChange={(e) => handleProjectChange(project.id, "projectName", e.target.value)}
                    />
                  </Field>
                  <Field label="Tools used" hint="Optional.">
                    <TextArea
                      placeholder="React, Node.js, PostgreSQL"
                      value={project.projectSkills}
                      onChange={(e) => handleProjectChange(project.id, "projectSkills", e.target.value)}
                    />
                  </Field>
                  <Field label="What it does" hint="Two to four points.">
                    <TextArea
                      placeholder="Built a full-stack expense tracker. Added shared households and a CSV import. Kept the interface usable on a phone."
                      required
                      value={project.projectDescription}
                      onChange={(e) =>
                        handleProjectChange(project.id, "projectDescription", e.target.value)
                      }
                    />
                  </Field>
                </div>
              </Entry>
            ))}
          </Section>

          <div className="border-t border-[#ddd6cb] pt-8">
            <p className="max-w-xxxl text-sm leading-relaxed text-[#5e574f]">
              If a run fails, submit again. Each pass is slightly different, so regenerate when a sentence is off.
            </p>
            {error && <div className="note mt-4 max-w-xl">{error}</div>}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="submit" disabled={loading} className="btn">
                {loading ? "Generating…" : "Generate resume"}
              </button>
              {pdfUrl && (
                <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn btn-line">
                  Open PDF
                </a>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ResumeViewer;
