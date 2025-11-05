import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const SelectedWorks = ({ projects = [] }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredProject, setHoveredProject] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate how far the section has scrolled into view
        if (rect.top < windowHeight && rect.bottom > 0) {
          const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
          setScrollProgress(progress);
        } else {
          // Reset when out of view
          setScrollProgress(0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Map WordPress portfolio data to the format needed
  // Note: API already filters to only show items with show_on_frontend = true
  // Show ALL filtered projects, not just the first 6
  const formattedProjects = projects.length > 0
    ? projects.map(project => {
        const image = project._embedded?.['wp:featuredmedia']?.[0]?.source_url 
          || project.featured_image_url 
          || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop';
        
        // Tech stack from WordPress (array or comma-separated string)
        const techStackRaw = project.tech_stack || [];
        const techStack = Array.isArray(techStackRaw)
          ? techStackRaw
          : (typeof techStackRaw === 'string' && techStackRaw.length > 0
            ? techStackRaw.split(',').map(t => t.trim()).filter(Boolean)
            : []);

        let externalLink = project.project_url || project.link || null;
        if (externalLink && !/^https?:\/\//i.test(externalLink)) {
          externalLink = `https://${externalLink}`;
        }

        return {
          title: project.title?.rendered || project.title || 'Untitled Project',
          category: project.project_type || project.category || 'Website Design',
          techStack,
          image: image,
          slug: project.slug || project.id,
          link: externalLink || (project.slug ? `/portfolio/${project.slug}` : '#'),
          id: project.id
        };
      })
    : [
        {
          title: 'Helve Tica Website Redesign',
          category: 'Website Design',
          date: 'May 2024',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop'
        },
        {
          title: 'Minimal Portfolio',
          category: 'UI/UX Design',
          date: 'Apr 2024',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
        }
      ];

  // Calculate text alignment - moves from right to center
  const justifyContent = scrollProgress < 0.5 ? 'flex-end' : 'center';

  return (
    <div 
      ref={sectionRef} 
      id="selected-works"
      className="min-h-screen bg-transparent py-16 lg:py-32 relative"
    >
      {/* Header with "Selected Work" */}
      <div className="mb-12 lg:mb-20 px-4 lg:px-8 max-w-5xl mx-auto">
        <div
          className="rounded-3xl px-16 py-10 transition-all duration-700 ease-out mx-auto"
          style={{
            background: '#1A1A1A',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            maxWidth: '500px',
          }}
        >
          <div 
            className="flex items-center gap-6 transition-all duration-700 ease-out justify-center"
            style={{
              justifyContent: justifyContent,
            }}
          >
            <div className="w-3 h-3 bg-[#FF6600] rounded-full"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-4xl font-light text-white tracking-tight">
              Selected Work
            </h2>
            <div className="w-3 h-3 bg-[#FF6600] rounded-full"></div>
          </div>
        </div>
      </div>

          {/* Projects grid */}
          <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6">
          {formattedProjects.map((project, index) => (
            <div
              key={project.id || index}
              className="group relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 mx-auto"
              style={{
                background: '#1A1A1A',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                border: hoveredProject === index ? '2px solid rgba(255, 102, 0, 0.3)' : '2px solid transparent',
                maxWidth: '900px',
                width: '100%',
              }}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Image */}
                   <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Dark overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>

              {/* Content - Bottom */}
              <div 
                className="absolute flex flex-row gap-2 sm:gap-3 justify-center items-center"
                style={{
                  left: '50%',
                  bottom: '12px',
                  transform: 'translateX(-50%)',
                  width: 'calc(100% - 24px)',
                  maxWidth: '800px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  paddingLeft: '12px',
                  paddingRight: '8px',
                  borderRadius: '16px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* Project Info */}
                <div className="flex-1 text-left min-w-0">
                  <div 
                    className="text-xs mb-1 font-light uppercase tracking-wider"
                    style={{
                      color: hoveredProject === index ? '#FF6600' : 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    {project.category}
                  </div>
                  <h3 
                    className="mb-1 transition-colors duration-300"
                    style={{
                      color: hoveredProject === index ? '#FF6600' : '#FFFFFF',
                    }}
                  >
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold text-white hover:no-underline line-clamp-2"
                      style={{
                        color: hoveredProject === index ? '#FF6600' : '#FFFFFF',
                      }}
                    >
                      {project.title}
                    </a>
                  </h3>
                  {/* Tech stack chips (replaces date) */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {project.techStack.slice(0, 4).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[10px] sm:text-xs text-white/80 bg-white/10 border border-white/20 rounded-full px-2 py-0.5"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 4 && (
                        <span className="text-[10px] sm:text-xs text-white/60">
                          +{project.techStack.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Arrow Button */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center transition-all duration-300 group-hover:scale-105 flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-[148px] xl:h-[148px] rounded-xl sm:rounded-2xl"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: hoveredProject === index ? 'rgba(255, 102, 0, 0.1)' : 'transparent',
                  }}
                >
                  <ArrowUpRight 
                    className="transition-colors duration-300 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10" 
                    strokeWidth={2}
                    style={{
                      color: hoveredProject === index ? '#FF6600' : '#FFFFFF',
                    }}
                  />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectedWorks;
