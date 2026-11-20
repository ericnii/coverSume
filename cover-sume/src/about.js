import Layout from "./Layout";

function About() {
  return (
    <Layout>
      <article className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <div className="max-w-2xl">
          <p className="kicker">About</p>
          <h1 className="display mt-3 text-4xl leading-tight md:text-5xl">
            Written for technical hiring, not for a template gallery.
          </h1>
          <div className="mt-8 space-y-5 text-[16px] leading-7 text-[#3c3833]">
            <p>
              CoverSume makes resumes and cover letters for people in computer science and computer engineering. The pages are set in one format: the Jake&apos;s Resume structure, which is widely used because it is dense, scannable, and familiar to technical recruiters.
            </p>
            <p>
              There is no theme picker and no second layout. You enter the work you have done. The resume comes back in that single structure, and the cover letter is written from your resume and the job posting.
            </p>
          </div>
        </div>
      </article>
    </Layout>
  );
}

export default About;
