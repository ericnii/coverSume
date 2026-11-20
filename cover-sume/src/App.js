import About from "./about.js";
import Resume from "./resume.js";
import Cover from "./cover.js";
import Documents from "./documents.js";
import Layout from "./Layout.js";
import { useNavigate } from "react-router-dom";
import { HashRouter, Routes, Route } from "react-router-dom";

function SampleResume() {
  return (
    <figure className="border border-[#ddd6cb] bg-[#fffdf9] px-7 py-8 text-[11px] leading-snug text-[#1b1916] ">
      <figcaption className="kicker mb-5">Sample</figcaption>
      <div className="text-center">
        <div className="display text-[22px] tracking-normal">Alex Chen</div>
        <p className="mt-1 text-[10px] text-[#5e574f]">
          Toronto, ON · alex@email.com · linkedin.com/in/alexchen · github.com/achen
        </p>
      </div>

      <div className="mt-4 border-b border-[#1b1916] pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
        Education
      </div>
      <div className="mt-1.5 flex justify-between gap-4 font-medium">
        <span>University of Toronto</span>
        <span>May 2026</span>
      </div>
      <p className="italic text-[#5e574f]">Bachelor of Science in Computer Science</p>

      <div className="mt-3 border-b border-[#1b1916] pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
        Experience
      </div>
      <div className="mt-1.5 flex justify-between gap-4 font-medium">
        <span>Software Engineering Intern, Northwind</span>
        <span>May 2025 – Aug 2025</span>
      </div>
      <ul className="mt-1 list-disc pl-4 text-[#3c3833]">
        <li>Shipped a billing export that cut month-end close from two days to an afternoon.</li>
        <li>Rewrote the search index path and dropped p95 latency from 840ms to 190ms.</li>
      </ul>

      <div className="mt-3 border-b border-[#1b1916] pb-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]">
        Projects
      </div>
      <div className="mt-1.5 font-medium">Ledger — React, Node.js</div>
      <p className="mt-0.5 text-[#3c3833]">
        Personal expense tracker with shared households and a CSV import.
      </p>
    </figure>
  );
}

function AppContent() {
  const navigate = useNavigate();

  return (
    <Layout>
         <div className="mx-auto grid min-h-[calc(100vh-8.5rem)] max-w-5xl items-center gap-12 px-5 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">        <div>
          <p className="kicker">Resumes and cover letters</p>
          <h1 className="display mt-3 text-4xl leading-[1.08] md:text-6xl">
            <span className="text-[#3b76f6]">Cover</span>
            <span className="text-[#eab308]">Sume</span>
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[#5e574f]">
          Want a resume that stands out just like the legendary Jake&apos;s Resume? Struggling to craft a clean, effective cover letter or resume? Start building yours in seconds!
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => navigate("/resume")} className="btn">
              Build a resume
            </button>
            <button type="button" onClick={() => navigate("/cover")} className="btn btn-line">
              Write a cover letter
            </button>
          </div>
          <p className="mt-8 text-sm text-[#6f675e]">Professional resumes and cover letters, all free to use.</p>
        </div>
        <SampleResume />
      </div>
    </Layout>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/about" element={<About />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/cover" element={<Cover />} />
        <Route path="/documents" element={<Documents />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
