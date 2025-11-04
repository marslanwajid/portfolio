import React, { useState, useEffect, useRef } from 'react';

const ExperiencesSection = ({ experiences = [] }) => {
  const [visibleWords, setVisibleWords] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);
  const sectionRef = useRef(null);

  const text = "I will offers more than just a place to live it's a space designed to reflect your unique style inspiration";
  const words = text.split(' ');

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if section is in viewport
        if (rect.top < windowHeight * 0.7 && rect.bottom > 0) {
          const scrollProgress = (windowHeight - rect.top) / windowHeight;
          const wordsToShow = Math.floor(scrollProgress * words.length * 2);
          setVisibleWords(Math.min(wordsToShow, words.length));
        } else {
          // Reset when out of view
          setVisibleWords(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [words.length]);

  // Map WordPress experience data to the format needed
  const formattedExperiences = experiences.length > 0 
    ? experiences.map(exp => {
        // Remove em dash and clean text
        const cleanCompany = (exp.company_name || exp.company || exp.title?.rendered || 'Unknown Company')
          .replace(/&#8211;/g, '-')
          .replace(/–/g, '-')
          .replace(/—/g, '-');
        const cleanRole = (exp.job_title || exp.role || 'Product Designer')
          .replace(/&#8211;/g, '-')
          .replace(/–/g, '-')
          .replace(/—/g, '-');
        const startDate = exp.start_date || '2020';
        const endDate = exp.end_date || 'Present';
        const cleanPeriod = `${startDate} - ${endDate}`.replace(/&#8211;/g, '-').replace(/–/g, '-').replace(/—/g, '-');
        
        return {
          company: cleanCompany,
          role: cleanRole,
          period: cleanPeriod,
          active: !exp.end_date || exp.end_date === 'Present' || exp.end_date === 'current'
        };
      }).reverse()
    : [
        {
          company: 'Drake',
          role: 'Product Designer',
          period: '2022 - Present',
          active: true
        },
        {
          company: 'Minus',
          role: 'Product Designer',
          period: '2021 - 2022',
          active: false
        },
        {
          company: 'Avox Studio',
          role: 'Product Designer',
          period: '2020 - 2021',
          active: false
        }
      ].reverse();

  return (
    <section 
      ref={sectionRef} 
      id="experience"
      className="min-h-screen bg-transparent flex items-center justify-center px-4 lg:px-12 py-12 lg:py-20 relative overflow-hidden"
    >
      {/* Background image overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-gray-800 to-transparent"></div>
      </div>
      
           <div className="max-w-[900px] w-full mx-auto relative z-10 px-4">
        {/* Main heading with experiences label inline */}
        <div className="mb-12 lg:mb-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-relaxed tracking-tight">
            <span className="text-gray-500 text-sm tracking-widest align-middle mr-4">• Experiences</span>
            {words.map((word, index) => (
              <span
                key={index}
                className="inline-block mr-3 transition-opacity duration-500"
                style={{
                  opacity: index < visibleWords ? 1 : 0.15,
                }}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* Experience list */}
        <div className="space-y-0">
          {formattedExperiences.map((exp, index) => (
            <div
              key={index}
              className="relative group cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Content */}
              <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between py-6 lg:py-8 px-4 lg:px-6 border-b border-gray-800 gap-3 lg:gap-4">
                <div className="flex-1 w-full">
                  <div 
                    className="text-xs lg:text-sm mb-2 tracking-wide transition-colors duration-300"
                    style={{
                      color: hoveredItem === index ? '#FF6B00' : '#9CA3AF'
                    }}
                  >
                    {exp.company}
                  </div>
                  <div 
                    className="transition-colors duration-300"
                    style={{
                      color: hoveredItem === index ? '#FF6B00' : '#FFFFFF',
                      fontFamily: 'Rajdhani, sans-serif',
                      fontWeight: 500, // Medium
                      fontSize: 'clamp(24px, 5vw, 48px)',
                      lineHeight: '1.2',
                      letterSpacing: '-1.5px',
                    }}
                  >
                    {exp.role}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 flex-shrink-0">
                  {exp.active && (
                    <span
                      className="px-3 py-1.5 lg:px-5 lg:py-2 rounded-full text-xs lg:text-sm font-medium tracking-wide transition-all duration-300 whitespace-nowrap"
                      style={{
                        background: 'rgba(255, 107, 0, 0.2)',
                        color: 'white',
                      }}
                    >
                      {exp.period}
                    </span>
                  )}
                  {!exp.active && (
                    <span
                      className="px-3 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm text-gray-400 tracking-wide transition-all duration-300 whitespace-nowrap"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {exp.period}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;

