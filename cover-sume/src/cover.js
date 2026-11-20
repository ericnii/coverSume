import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Layout from "./Layout";
import { PageIntro, Section, Field, TextInput, TextArea } from "./ui";

function CoverLetterGenerator() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { getAccessTokenSilently, user } = useAuth0();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    companyName: "",
    companyAddress: "",
    jobPosting: "",
    hiringManager: "",
  });

  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const generateCL = async () => {
    setLoading(true);
    setError("");

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    if (resumeFile) {
      formDataToSend.append("resume", resumeFile);
    }
    formDataToSend.append("userId", user?.sub);
    try {
      const token = await getAccessTokenSilently();
      console.log("Token obtained:", token.substring(0, 20) + "...");
      const response = await fetch("https://coversume-backend.onrender.com/cover-letter", {
      //const response = await fetch("http://localhost:3001/cover-letter", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
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
      setLoading(false);
    } catch (err) {
      console.error("Error generating cover letter:", err);
      setError(err.message || "Failed to generate cover letter. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-5 py-12 md:py-16">
        <PageIntro kicker="Cover letter" title="Write the letter">
          Your details, the role, and a picture of your resume. The letter is written from those three things.
        </PageIntro>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateCL();
          }}
        >
          <Section index="01" title="You">
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
              <Field label="Where you live">
                <TextInput
                  name="location"
                  placeholder="Toronto, ON"
                  required
                  value={formData.location}
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

          <Section index="02" title="The role">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Company">
                <TextInput
                  name="companyName"
                  placeholder="Northwind"
                  required
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Company address">
                <TextInput
                  name="companyAddress"
                  placeholder="100 King Street West, Toronto"
                  required
                  value={formData.companyAddress}
                  onChange={handleChange}
                />
              </Field>
              <Field label="Hiring manager" hint="Optional. Leave blank if the posting does not name one.">
                <TextInput
                  name="hiringManager"
                  placeholder="Priya Shah"
                  value={formData.hiringManager}
                  onChange={handleChange}
                />
              </Field>
              <Field className="sm:col-span-2" label="Job posting">
                <TextArea
                  name="jobPosting"
                  placeholder="Paste the posting here."
                  required
                  className="input min-h-[180px]"
                  value={formData.jobPosting}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </Section>

          <Section index="03" title="Resume">
            <Field
              label="Resume image"
              hint="PNG or JPG. A screenshot of the resume is fine. PDF is not accepted."
            >
              <input
                type="file"
                name="resume"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                required
                onChange={(e) => setResumeFile(e.target.files[0])}
                className="input"
              />
            </Field>
          </Section>

          <div className="border-t border-[#ddd6cb] pt-8">
            <p className="max-w-xxxl text-sm leading-relaxed text-[#5e574f]">
              If a run fails, submit again. Each pass is slightly different, so regenerate when a sentence is off.
            </p>
            {error && <div className="note mt-4 max-w-xl">{error}</div>}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="submit" disabled={loading} className="btn">
                {loading ? "Generating…" : "Generate cover letter"}
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
}

export default CoverLetterGenerator;
