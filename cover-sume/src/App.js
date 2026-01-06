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
        <div className="flex flex-col md:flex-row gap-4 md:gap-10 justify-between px-4 md:px-8 items-center text-base md:text-lg font-thin">
            <div className="flex gap-4 md:gap-6 text-sm md:text-base">
              <button className="relative hover:opacity-50 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-800 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full" onClick={() => navigate('/about')}>About Us</button>
              <button className="relative hover:opacity-50 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-800 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full" onClick={() => navigate('/documents')}>Documents</button>
            </div>
            <AuthButtons />
        </div>
      </div>
          <div className="flex flex-col lg:flex-row items-center justify-center px-4 md:px-8 mt-8 md:mt-12 gap-8 lg:gap-28">
            <div className="flex flex-col w-full lg:w-auto">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-start mt-8 md:mt-24 lg:mt-48">
                <div className="text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <span className='text-yellow-400'>C</span><span className='text-blue-500'>over</span><span className='text-yellow-400'>S</span><span className='text-blue-500'>ume</span>
                </div>
            <div className="text-sm md:text-base lg:text-xl font-thin mt-3">
              Want a resume that stands out just like the legendary <span className='font-semibold'>Jake's Resume?</span>
                </div>
            <div className="text-sm md:text-base lg:text-xl font-thin mt-3">
              Struggling to craft a <span className="font-semibold text-gray-800">clean, effective</span> cover letter or tech resume?
                </div>
            <div className="text-sm md:text-base lg:text-xl font-thin mt-3">
              Start building yours in seconds!
                </div>
                {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 lg:gap-10 font-thin text-base md:text-lg lg:text-2xl mt-5 md:mt-7 w-full lg:w-auto justify-center lg:justify-start">
                  <button 
                    onClick={() => navigate('/resume')}
                className="relative bg-yellow-400 hover:opacity-50 rounded-3xl px-4 md:px-6 py-2 md:py-3 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-800 after:left-6 after:bottom-2 after:transition-all after:duration-300 hover:after:w-20"
                  >
                    Resume
                  </button>
                  <button 
                    onClick={() => navigate('/cover')}
                className="relative bg-yellow-400 hover:opacity-50 rounded-3xl px-4 md:px-6 py-2 md:py-3 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gray-800 after:left-5 after:bottom-2 after:transition-all after:duration-300 hover:after:w-32"
                  >
                    Cover Letter
                  </button>
                </div>
              </div>
              {/* Trust indicators */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-6 lg:gap-10 mt-4 md:mt-5 text-xs md:text-sm lg:text-base justify-center lg:justify-start">
                <div>
              <span className="text-green-500">✓</span> Professional resumes and cover letters 
                </div>
                <div>
                  <span className="text-green-500">✓</span> Free to use
                </div>
              </div>
            </div>
            {/* Animations */}
            <div className="w-56 md:w-72 lg:w-96 border-2 border-gray-200 p-4 md:p-8 lg:p-10 shadow-2xl bg-blue-200 rounded-xl mt-8 md:mt-12 lg:mt-44">
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
