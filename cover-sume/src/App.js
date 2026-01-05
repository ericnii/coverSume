import './App.css';
import About from './about.js';
import Resume from  './resume.js'
import Cover from './cover.js'
import Documents from './documents.js'
import AuthButtons from './AuthButtons.js';
import Lottie from 'lottie-react';
import animation from './front.json';
import { useNavigate } from 'react-router-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';

function AppContent() {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="relative top-10">
        <div className="flex flex-row gap-10 w-screen justify-between px-8 items-center text-lg font-thin">
            <div className="flex gap-6">
              <button className="relative hover:opacity-50 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-800 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full" onClick={() => navigate('/about')}>About Us</button>
              <button className="relative hover:opacity-50 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-800 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full" onClick={() => navigate('/documents')}>Documents</button>
            </div>
            <AuthButtons />
        </div>
      </div>
          <div className="flex items-center justify-center px-8 mt-12 gap-28">
            <div className="flex flex-col">
              <div className="flex flex-col items-start text-start mt-48">
                <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <span className='text-yellow-400'>C</span><span className='text-blue-500'>over</span><span className='text-yellow-400'>S</span><span className='text-blue-500'>ume</span>
                </div>
            <div className="text-xl font-thin mt-3">
              Want a resume that stands out just like the legendary <span className='font-semibold'>Jake’s Resume?</span>
                </div>
            <div className="text-xl font-thin mt-3">
              Struggling to craft a <span className="font-semibold text-gray-800">clean, effective</span> cover letter or tech resume?
                </div>
            <div className="text-xl font-thin mt-3">
              Start building yours in seconds!
                </div>
                {/* Buttons */}
            <div className="flex gap-10 font-thin text-2xl mt-7">
                  <button 
                    onClick={() => navigate('/resume')}
                className="relative bg-yellow-400 hover:opacity-50 rounded-3xl px-6 py-3 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-800 after:left-6 after:bottom-2 after:transition-all after:duration-300 hover:after:w-20"
                  >
                    Resume
                  </button>
                  <button 
                    onClick={() => navigate('/cover')}
                className="relative bg-yellow-400 hover:opacity-50 rounded-3xl px-6 py-3 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-800 after:left-5 after:bottom-2 after:transition-all after:duration-300 hover:after:w-32"
                  >
                    Cover Letter
                  </button>
                </div>
              </div>
              {/* Trust indicators */}
              <div className="flex flex-row gap-10 mt-5">
                <div>
              <span className="text-green-500">✓</span> Professional resumes and cover letters 
                </div>
                <div>
                  <span className="text-green-500">✓</span> Free to use
                </div>
              </div>
            </div>
            {/* Animations */}
            <div className="w-96 border-2 border-gray-200 p-10 shadow-2xl bg-blue-200 rounded-xl mt-44">
              <Lottie animationData={animation} loop={true} />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/about" element={<About />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/cover" element={<Cover/>}/>
        <Route path="/documents" element={<Documents/>}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
