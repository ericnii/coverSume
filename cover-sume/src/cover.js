import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CoverLetterGenerator() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Add state for form fields
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    companyName: '',
    companyAddress: '',
    jobPosting: '',
    hiringManager: '',
  });

  // Add state for file upload
  const [resumeFile, setResumeFile] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateCL = async () => {
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    if (resumeFile) {
      formDataToSend.append('resume', resumeFile);
    }
    try{   
      const response = await fetch("http://localhost:3001/cover-letter", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error', message: `Server error: ${response.status}` }));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setPdfUrl(`http://localhost:3001${data.url}`);
      setLoading(false);
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setError(err.message || 'Error, please press Generate Cover Letter again.');
      setLoading(false);
    }
  };

  return (
    <div className='p-3'>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
      >
        Go Back
      </button>
      <div className='flex flex-col items-center'>
        <form
          className="mb-8 p-8"
          onSubmit={e => {
            e.preventDefault();
            generateCL();
          }}
        >
          <h1 className="text-center text-3xl mb-14">Cover Letter Generator</h1>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Full Name</label>
              <input
                name="name"
                placeholder="Enter your name"
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Where do you live?</label>
              <input
                name="location"
                placeholder="Enter your city or address"
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Phone Number</label>
              <input
                name="phone"
                placeholder="Enter your phone number"
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Email Address</label>
              <input
                name="email"
                placeholder="Enter your email"
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-6 w-full">
              <div className="flex flex-col flex-1">
                <label className="mb-2 font-bold text-gray-700">LinkedIn (optional)</label>
                <input
                  name="linkedin"
                  placeholder="Enter your LinkedIn URL"
                  className="p-3 border-2 border-gray-300 rounded-md"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-2 font-bold text-gray-700">GitHub (optional)</label>
                <input
                  name="github"
                  placeholder="Enter your GitHub URL"
                  className="p-3 border-2 border-gray-300 rounded-md"
                  value={formData.github}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Company Name</label>
              <input
                name="companyName"
                placeholder="Enter the company name"
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Company Address</label>
              <input
                name="companyAddress"
                placeholder="Enter the company address"
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.companyAddress}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Hiring Manager (optional)</label>
              <input
                name="hiringManager"
                placeholder="Enter the hiring manager's name (optional)"
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.hiringManager}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Job Posting</label>
              <textarea
                name="jobPosting"
                placeholder="Paste the full job posting/description here..."
                className="p-3 border-2 border-gray-300 rounded-md min-h-[150px]"
                required
                value={formData.jobPosting}
                onChange={handleChange}
              />
            </div>
            {/* File upload input */}
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Upload Resume (PDF NOT ACCEPTED, please take a screenshot of the resume and attach it here to ensure PNG)</label>
              <input
                type="file"
                name="resume"
                required
                onChange={e => setResumeFile(e.target.files[0])}
                className="p-3 border-2 border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div className='mt-5 mb-5 font-semibold text-red-500'>If the generation fails, please simply press Generate Cover Letter again</div>
          <div className='mt-5 mb-5 font-semibold text-green-500'>Each generation may be slightly different, so if there is a part you don't like, try pressing Generate Cover Letter again</div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
              {error}
            </div>
          )}
        <div className="flex gap-6">
          <button 
            type="submit"
            disabled={loading}
            className={`px-5 py-3 rounded-md transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
            } text-white mb-10 mt-8`}
          >
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
          {pdfUrl && (
            <div>
              <h3 className="mb-2">Generated Cover Letter</h3>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-base inline-block"
              >
                Open PDF in New Tab
              </a>
            </div>
          )}       
        </div>
        </form>
       </div>
    </div>
  );
}

export default CoverLetterGenerator;
