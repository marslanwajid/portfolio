import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Tech stack cards (separate, one per slide)
const techStack = [
  { title: 'React', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', desc: 'Declarative UI library' },
  { title: 'Next.js', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg', desc: 'Full‑stack React framework' },
  { title: 'Node.js', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', desc: 'Runtime for scalable apps' },
  { title: 'Python', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', desc: 'High-level programming language' },
  { title: 'Express', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', desc: 'Minimal backend framework' },
  { title: 'MongoDB', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', desc: 'NoSQL database' },
  { title: 'WordPress', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg', desc: 'CMS & headless backend' },
  { title: 'Shopify', img: 'https://www.vectorlogo.zone/logos/shopify/shopify-icon.svg', desc: 'E-commerce platform' },
  { title: 'Redux', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg', desc: 'State management' },
  { title: 'GitHub', img: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', desc: 'Code hosting & CI' },
];

const AboutSkillsSection = ({ aboutHtml }) => {
  const [visibleWords, setVisibleWords] = useState(0);
  const sectionRef = useRef(null);
  const scrollerRef = useRef(null);
  const wordIntervalRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const slideIntervalRef = useRef(null);

  // Responsive card dimensions
  const getCardDimensions = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 1024) {
        // Mobile & Tablet: 1 card, full width minus container padding (px-4 = 16px each side) and card padding
        const containerPadding = 32; // px-4 on both sides = 16px * 2
        const cardPadding = 32; // px-4 on both sides = 16px * 2
        const availableWidth = width - containerPadding - cardPadding;
        return {
          cardWidth: Math.max(280, Math.min(400, availableWidth)),
          gap: 16,
          visibleCards: 1
        };
      } else {
        // Desktop: 3 cards
        return {
          cardWidth: 440,
          gap: 28,
          visibleCards: 3
        };
      }
    }
    return { cardWidth: 440, gap: 28, visibleCards: 3 };
  };

  const [dimensions, setDimensions] = useState(getCardDimensions());
  
  useEffect(() => {
    const handleResize = () => {
      setDimensions(getCardDimensions());
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { cardWidth, gap, visibleCards } = dimensions;
  const AUTOPLAY_MS = 3000;

  const heading = 'Behind every great build is an even greater story';
  const words = heading.split(' ');

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Check if section is in viewport
      if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
        // Only trigger animation once when it comes into view
        if (!hasAnimatedRef.current && !wordIntervalRef.current) {
          hasAnimatedRef.current = true;
          let currentIndex = 0;
          
          wordIntervalRef.current = setInterval(() => {
            currentIndex += 1;
            setVisibleWords(currentIndex);
            
            // Stop when all words are visible
            if (currentIndex >= words.length) {
              if (wordIntervalRef.current) {
                clearInterval(wordIntervalRef.current);
                wordIntervalRef.current = null;
              }
            }
          }, 90);
        }
      } else {
        // Reset when out of view
        if (wordIntervalRef.current) {
          clearInterval(wordIntervalRef.current);
          wordIntervalRef.current = null;
        }
        hasAnimatedRef.current = false;
        setVisibleWords(0);
      }
    };
    
    window.addEventListener('scroll', onScroll);
    onScroll(); // Initial check
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (wordIntervalRef.current) {
        clearInterval(wordIntervalRef.current);
        wordIntervalRef.current = null;
      }
    };
  }, [words.length]);

  // Auto-advance 1 slide at a time every 3000ms
  useEffect(() => {
    const maxIndex = Math.max(0, techStack.length - visibleCards);
    
    const advanceSlide = () => {
      setCurrentIndex(prev => {
        const next = prev >= maxIndex ? 0 : prev + 1;
        return next;
      });
    };
    
    // Set up slide interval
    slideIntervalRef.current = setInterval(advanceSlide, AUTOPLAY_MS);
    
    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
        slideIntervalRef.current = null;
      }
    };
  }, [techStack.length, visibleCards]);

  // Calculate scroll position for the scroll bar indicator
  const maxIndex = Math.max(0, techStack.length - visibleCards);
  const scrollPosition = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 0;

  const scrollLeft = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };
  const scrollRight = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <section 
      ref={sectionRef} 
      id="about-skills"
      className="min-h-screen bg-transparent flex items-center justify-center px-4 lg:px-12 py-12 lg:py-20"
    >
      {/* Header like Experiences */}
      <div className="max-w-[900px] mx-auto px-2 lg:px-4 w-full">
        <div className="mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white leading-relaxed tracking-tight">
            <span className="text-gray-500 text-sm tracking-widest align-middle mr-4">• About Me</span>
            {words.map((w, i) => (
              <span
                key={i}
                className="inline-block mr-3 transition-opacity duration-500 ease-in-out"
                style={{ 
                  opacity: i < visibleWords ? 1 : 0.15,
                  transition: 'opacity 400ms ease-in-out'
                }}
              >
                {w}
              </span>
            ))}
          </h2>
        </div>

        {/* Paragraph */}
        <div className="text-gray-400 text-sm lg:text-base max-w-3xl leading-relaxed mb-8 lg:mb-12 px-2 lg:px-0">
          {aboutHtml ? (
            <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
          ) : (
            <p>
              Every project has a starting point and a narrative that guides the process. I build
              elegant, performant products with attention to detail and long-term maintainability.
            </p>
          )}
        </div>

        {/* Skills Carousel Card (design section replaced by skills icons) */}
        <div
          className="rounded-2xl lg:rounded-[2rem] p-4 lg:p-6 xl:p-8 relative w-full overflow-hidden"
          style={{
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {/* Top Row with handle and arrows */}
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <div>
              <span
                className="inline-block px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs text-gray-300"
                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
              >
                @Tech Stack
              </span>
            </div>
            <div className="flex items-center gap-2 lg:gap-3">
              <button
                onClick={scrollLeft}
                className="w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center hover:scale-110 transition"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
              </button>
              <button
                onClick={scrollRight}
                className="w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center hover:scale-110 transition"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                aria-label="Scroll right"
              >
                <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Slider - responsive width */}
          <div 
            className="overflow-hidden w-full"
          >
            <div
              ref={scrollerRef}
              className="flex"
              style={{
                transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
                transition: 'transform 750ms cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            >
              {techStack.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 rounded-xl lg:rounded-2xl px-4 py-6 lg:px-6 lg:py-8 xl:px-8 xl:py-10 text-center"
                  style={{
                    width: `${cardWidth}px`,
                    marginRight: idx < techStack.length - 1 ? `${gap}px` : '0px',
                    background: 'rgba(20,20,20,0.85)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.35)'
                  }}
                >
                  <h3 className="text-xl lg:text-2xl xl:text-3xl text-white mb-4 lg:mb-6 xl:mb-8 font-medium">{item.title}</h3>
                  <div className="flex items-center justify-center mb-4 lg:mb-6" style={{ height: isMobile ? '100px' : '140px' }}>
                    <img 
                      src={item.img} 
                      alt={item.title} 
                      className="object-contain" 
                      style={{ 
                        maxWidth: isMobile ? '100px' : '140px', 
                        maxHeight: isMobile ? '100px' : '140px' 
                      }} 
                    />
                  </div>
                  <div className="text-gray-400 text-xs lg:text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal scroll bar indicator */}
          <div className="mt-6 h-1.5 rounded bg-white/10 overflow-hidden relative">
            <div
              className="h-full rounded bg-white/80"
              style={{ 
                width: `${Math.min(100, Math.max(0, scrollPosition))}%`, 
                transition: 'width 750ms cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSkillsSection;


