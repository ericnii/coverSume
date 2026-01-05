import React from "react";
import { useNavigate } from "react-router-dom";

function About(){
    const navigate = useNavigate();
    return (
        <div className="p-3">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          ← Back Home
        </button>
            <div className="flex flex-col items-center mt-44">
              <h1 className="text-5xl"><span className="text-blue-500">About</span> <span className="text-yellow-400">Us</span></h1>
              <div className="w-1/2 text-center mt-4">
              CoverSume specializes in creating professional-grade resumes and cover letters specifically for technology professionals, including those in Computer Science and Computer Engineering. Rather than offering generic templates, we use proven, industry-optimized formatting methodologies that have been tested and refined for maximum impact in tech hiring. We only use ONE specific format for our resumes, and it is based on the highly successful Jake's Resume format, recognized as one of the most effective resume structures in the technology sector.              </div>
            </div>


        </div>
    )
}

export default About;