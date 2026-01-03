import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const ResumeViewer = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getAccessTokenSilently } = useAuth0();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    phone: '',
    linkedin: '',
    github: '',
    skills: ''
  });

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      jobTitle: '',
      company: '',
      duration: '',
      jobSkills:'',
      jobDescription: ''
    }
  ]);

  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: '',
      projectSkills: '',
      projectDescription: '' 
    }
  ])

  const [education, setEducation] = useState([
    {
      id: 1,
      education: '',
      degree: '',
      points: '',
    }
  ]);

  const generateResume = async () => {
    setLoading(true);
    setError('');
    
    const dataToSend = {
      ...formData,
      education: education,
      experiences: experiences,
      project: projects
    };
    
    console.log('Sending data:', dataToSend);
     
    try {
      const token = await getAccessTokenSilently();
      console.log('Token obtained:', token.substring(0, 20) + '...');
      const response = await fetch("https://coversume-backend.onrender.com/generate-resume", {
      method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error', message: `Server error: ${response.status}` }));
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      setPdfUrl(`https://coversume-backend.onrender.com${data.url}`);
    } catch (err) {
      console.error('Error generating resume:', err);
      setError(err.message || 'Failed to generate resume. Please try again.');
    }
    setLoading(false);
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleExperienceChange = (id, field, value) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  const addExperience = () => {
    setExperiences([...experiences, {
      id: experiences.length + 1,
      jobTitle: '',
      company: '',
      duration: '',
      jobSkills: '',
      jobDescription: ''
    }]);
  };

  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    }
  };

  const handleProjectChange = (id, field, value) => {
    setProjects(projects.map(proj => 
      proj.id === id ? { ...proj, [field]: value } : proj
    ));
  };

  const addProjects = () => {
    setProjects([...projects, {
      id: projects.length + 1,
      projectName: '',
      projectSkills: '',
      projectDescription: ''
    }]);
  };

  const removeProjects = (id) => {
    if (projects.length > 1) {
      setProjects(projects.filter(proj => proj.id !== id));
    }
  };

  const handleEducationChange = (id, field, value) => {
    setEducation(education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addEducations = () => {
    setEducation([...education, {
      id: education.length + 1,
      education: '',
      degree: '',
      points: ''
    }]);
  };

  const removeEducations = (id) => {
    if (education.length > 1) {
      setEducation(education.filter(edu => edu.id !== id));
    }
  };

  const navigate = useNavigate();

  return (
    <div className="p-3">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
      >
        Go Back
      </button>

      <h1 className="text-center text-3xl">Resume Generator</h1>

      <form
        onSubmit={e => {
          e.preventDefault();
          generateResume();
        }}
      >
        {/* Personal Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Full Name</label>
              <input 
                name='name' 
                placeholder='Enter your name' 
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Email Address</label>
              <input 
                name='email' 
                placeholder='Enter your email' 
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">City</label>
              <input 
                name='city' 
                placeholder='Enter your city' 
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="mb-2 font-bold text-gray-700">Phone Number</label>
              <input 
                name='phone' 
                placeholder='Enter your phone number' 
                required
                className="p-3 border-2 border-gray-300 rounded-md"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="flex gap-6 w-full">
              <div className="flex flex-col flex-1">
                <label className="mb-2 font-bold text-gray-700">LinkedIn (optional)</label>
                <input 
                  name='linkedin' 
                  placeholder='Enter your LinkedIn URL' 
                  className="p-3 border-2 border-gray-300 rounded-md"
                  value={formData.linkedin}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="mb-2 font-bold text-gray-700">GitHub (optional)</label>
                <input 
                  name='github' 
                  placeholder='Enter your GitHub URL' 
                  className="p-3 border-2 border-gray-300 rounded-md"
                  value={formData.github}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Education</h2>
            <button 
              type="button"
              onClick={addEducations}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              + Add Education
            </button>
          </div>
          {education.map((edu, index) => (
            <div key={edu.id} className="mb-6 p-4 border-2 border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Education {index + 1}</h3>
                {education.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeEducations(edu.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex flex-col flex-1 min-w-[250px]">
                  <label className="mb-2 font-bold">Institution</label>
                  <input 
                    placeholder='e.g., University of Toronto' 
                    required
                    className="p-3 border-2 border-gray-300 rounded-md"
                    value={edu.education}
                    onChange={(e) => handleEducationChange(edu.id, 'education', e.target.value)}
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-[250px]">
                  <label className="mb-2 font-bold">Degree & Graduation</label>
                  <input 
                    placeholder='e.g., Bachelor of Science, May 2028' 
                    required
                    className="p-3 border-2 border-gray-300 rounded-md"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <label className="mb-2 font-bold text-gray-700">Education Points (2-3 points is recommended)</label>
                <textarea 
                  placeholder="e.g., Dean's List Scholar 2024, Relevant Coursework: Data Structures, Algorithms" 
                  required
                  className="p-3 border-2 border-gray-300 rounded-md min-h-[100px]"
                  value={edu.points}
                  onChange={(e) => handleEducationChange(edu.id, 'points', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="mb-5">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="mb-4 flex flex-col">
            <label className="mb-2 font-bold">Technical Skills (2-3 categories is recommended) </label>
            <textarea 
              name='skills'
              placeholder='e.g., Languages: JavaScript, Python, Frameworks: ReactJS, NodeJS' 
              required
              className="w-full p-3 border-2 border-gray-300 rounded-md min-h-[100px]"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>
        </div>
    
        {/* Experience Section */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Experience</h2>
            <button 
              type="button"
              onClick={addExperience}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              + Add Experience
            </button>
          </div>
          
          {experiences.map((experience, index) => (
            <div key={experience.id} className="mb-6 p-4 border-2 border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
                {experiences.length >= 1 && (
                  <button 
                    type="button"
                    onClick={() => removeExperience(experience.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-6 mb-4">
                <div className="flex flex-col flex-1 min-w-[250px]">
                  <label className="mb-2 font-bold">Job Title</label>
                  <input 
                    placeholder='e.g., Software Engineering Intern' 
                    required
                    className="p-3 border-2 border-gray-300 rounded-md"
                    value={experience.jobTitle}
                    onChange={(e) => handleExperienceChange(experience.id, 'jobTitle', e.target.value)}
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-[250px]">
                  <label className="mb-2 font-bold">Company & Location</label>
                  <input 
                    placeholder='e.g., Tech Company, Toronto, ON' 
                    required
                    className="p-3 border-2 border-gray-300 rounded-md"
                    value={experience.company}
                    onChange={(e) => handleExperienceChange(experience.id, 'company', e.target.value)}
                  />
                </div>
                <div className="flex flex-col flex-1 min-w-[250px]">
                  <label className="mb-2 font-bold">Duration</label>
                  <input 
                    placeholder='e.g., June 2023 - August 2023' 
                    required
                    className="p-3 border-2 border-gray-300 rounded-md"
                    value={experience.duration}
                    onChange={(e) => handleExperienceChange(experience.id, 'duration', e.target.value)}
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-col">
                <label className="mb-2 font-bold"> Important Skills Used (optional)</label>
                <textarea 
                  placeholder='e.g., ReactJS, Excel, SQL' 
                  className="w-full p-3 border-2 border-gray-300 rounded-md min-h-[120px]"
                  value={experience.jobSkills}
                  onChange={(e) => handleExperienceChange(experience.id, 'jobSkills', e.target.value)}
                />
              </div>
              <div className="mb-4 flex flex-col">
                <label className="mb-2 font-bold">Job Description & Achievements (2-3 points is recommended)</label>
                <textarea 
                  placeholder='e.g., Developed and tested new features for cloud-based applications using Node.js and AWS. Collaborated in an Agile team to improve system performance by 15%.' 
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-md min-h-[120px]"
                  value={experience.jobDescription}
                  onChange={(e) => handleExperienceChange(experience.id, 'jobDescription', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Projects</h2>
            <button 
              type="button"
              onClick={addProjects}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
            >
              + Add Project
            </button>
          </div>
          {projects.map((project, index) => (
            <div key={project.id} className="mb-6 p-4 border-2 border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Project {index + 1}</h3>
                {projects.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeProjects(project.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="mb-4 flex flex-col">
                <label className="mb-2 font-bold">Project Name</label>
                <input 
                  placeholder='e.g., E-commerce Web Application' 
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-md"
                  value={project.projectName}
                  onChange={(e) => handleProjectChange(project.id, 'projectName', e.target.value)}
                />
              </div>
              <div className="mb-4 flex flex-col">
                <label className="mb-2 font-bold">Project Skills Used (optional)</label>
                <textarea 
                  placeholder='e.g., ReactJS, Excel, SQL' 
                  className="w-full p-3 border-2 border-gray-300 rounded-md min-h-[120px]"
                  value={project.projectSkills}
                  onChange={(e) => handleProjectChange(project.id, 'projectSkills', e.target.value)}
                />
              </div>
              <div className="mb-4 flex flex-col">
                <label className="mb-2 font-bold">Project Description & Technologies (2-4 points is recommended)</label>
                <textarea 
                  placeholder='e.g., Built a full-stack e-commerce web application using React and Node.js. Implemented secure payment processing and order management system. Achieved responsive and mobile-friendly design with optimized performance.' 
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-md min-h-[120px]"
                  value={project.projectDescription}
                  onChange={(e) => handleProjectChange(project.id, 'projectDescription', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
        <div className='mt-5 mb-5 font-semibold text-red-500'>If the generation fails, please simply press Generate Resume again</div>
        <div className='mt-5 mb-5 font-semibold text-green-500'>Each generation may be slightly different, so if there is a part you don't like, try pressing Generate Resume again</div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-300">
            {error}
          </div>
        )}
        {/* buttons */}
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
            {loading ? "Generating..." : "Generate Resume"}
          </button>
          {pdfUrl && (
            <div>
              <h3 className="mb-2">Generated Resume</h3>
              <a 
                href={pdfUrl} 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md text-base transition-colors inline-block"
              >
                Open PDF in New Tab
              </a>
            </div>
          )}       
        </div>
      </form>
    </div>
  );
};

export default ResumeViewer;
