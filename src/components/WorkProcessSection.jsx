import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Process steps data
const processSteps = [
  {
    id: 1,
    step: 'Step 1',
    title: 'Requirements\nGathering',
    description: 'Understanding client needs, project scope, and defining clear objectives for the solution.',
    icon: '/step1.svg',
  },
  {
    id: 2,
    step: 'Step 2',
    title: 'Planning &\nArchitecture',
    description: 'Designing system architecture, selecting technologies, and creating development roadmap.',
    icon: '/step2.svg',
  },
  {
    id: 3,
    step: 'Step 3',
    title: 'Development &\nImplementation',
    description: 'Building the solution using modern frameworks, writing clean code, and following best practices.',
    icon: '/step3.svg',
  },
  {
    id: 4,
    step: 'Step 4',
    title: 'Testing &\nDeployment',
    description: 'Rigorous testing, bug fixes, performance optimization, and deploying to production.',
    icon: '/step4.svg',
  },
];

const WorkProcessSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleWords, setVisibleWords] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const scrollerRef = useRef(null);
  const wordIntervalRef = useRef(null);
  const hasAnimatedRef = useRef(false);
  const autoPlayIntervalRef = useRef(null);

  const heading = 'Work Process';
  const words = heading.split(' ');

  // Responsive card dimensions
  const getCardDimensions = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 1024) {
        // Mobile & Tablet: 1 full card, full width minus padding
        const containerPadding = 32; // px-4 on both sides = 16px * 2
        const cardPadding = 32; // p-4 on both sides = 16px * 2
        const availableWidth = width - containerPadding - cardPadding;
        return {
          cardWidth: Math.max(280, availableWidth),
          gap: 16,
          visibleCards: 1,
          showPartial: false // Show full card on mobile & tablet
        };
      } else {
        // Desktop: 1 card with partial next
        return {
          cardWidth: 665,
          gap: 16,
          visibleCards: 1,
          showPartial: true
        };
      }
    }
    return { cardWidth: 665, gap: 16, visibleCards: 1, showPartial: true };
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

  const { cardWidth, gap, visibleCards, showPartial } = dimensions;

  // Scroll animation for heading
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
        setIsVisible(true);
        
        // Animate words appearing
        if (!hasAnimatedRef.current && !wordIntervalRef.current) {
          hasAnimatedRef.current = true;
          let currentIndex = 0;
          
          wordIntervalRef.current = setInterval(() => {
            currentIndex += 1;
            setVisibleWords(currentIndex);
            
            if (currentIndex >= words.length) {
              if (wordIntervalRef.current) {
                clearInterval(wordIntervalRef.current);
                wordIntervalRef.current = null;
              }
            }
          }, 100);
        }
      } else {
        // Reset when out of view
        if (wordIntervalRef.current) {
          clearInterval(wordIntervalRef.current);
          wordIntervalRef.current = null;
        }
        hasAnimatedRef.current = false;
        setVisibleWords(0);
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', onScroll);
    onScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (wordIntervalRef.current) {
        clearInterval(wordIntervalRef.current);
        wordIntervalRef.current = null;
      }
    };
  }, [words.length]);

  const scrollLeft = () => {
    const maxIndex = Math.max(0, processSteps.length - visibleCards);
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const scrollRight = () => {
    const maxIndex = Math.max(0, processSteps.length - visibleCards);
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Auto-advance carousel every 5000ms
  useEffect(() => {
    const maxIndex = Math.max(0, processSteps.length - visibleCards);
    
    autoPlayIntervalRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [processSteps.length, visibleCards]);

  return (
    <section
      ref={sectionRef}
      id="work-process"
      className="min-h-screen bg-transparent flex items-center justify-center px-4 lg:px-12 py-12 lg:py-20 relative"
    >
      <div className="w-full max-w-[900px] mx-auto">
        {/* Heading with word animation */}
        <div className="mb-12 lg:mb-16">
          <h2
            className="text-white"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 500, // Medium
              fontSize: 'clamp(40px, 8vw, 96px)',
              lineHeight: '1',
              letterSpacing: '-4px',
            }}
          >
            {words.map((word, index) => (
              <span
                key={index}
                className="inline-block mr-4 transition-opacity duration-500"
                style={{
                  opacity: index < visibleWords ? 1 : 0.15,
                }}
              >
                {word}
              </span>
            ))}
          </h2>
        </div>

        {/* Process Slider */}
        <div className="relative">
          {/* Navigation Arrows */}
          <div className="flex items-center justify-end gap-2 lg:gap-3 mb-4 lg:mb-6">
            <button
              onClick={scrollLeft}
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center hover:scale-110 transition"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </button>
            <button
              onClick={scrollRight}
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center hover:scale-110 transition"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </button>
          </div>

          {/* Slider Container */}
          <div
            className="overflow-hidden w-full"
            style={{
              width: showPartial ? `${cardWidth + (cardWidth * 0.2)}px` : '100%',
              maxWidth: '100%',
            }}
          >
            <div
              ref={scrollerRef}
              className="flex"
              style={{
                transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
                transition: 'transform 750ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {processSteps.map((step, idx) => {
                return (
                  <div
                    key={step.id}
                    className="flex-shrink-0 rounded-xl lg:rounded-2xl p-4 lg:p-6 xl:p-8 relative flex flex-col justify-between"
                      style={{
                        width: `${cardWidth}px`,
                        height: 'auto',
                        minHeight: isMobile ? '320px' : '380px',
                        marginRight: idx < processSteps.length - 1 ? `${gap}px` : '0px',
                        background: 'rgba(0,0,0,0.35)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                    {/* Step Number - At Top */}
                    <div
                      className="mb-4 lg:mb-6 text-white"
                      style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 500,
                        fontSize: isMobile ? '12px' : '14px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      • {step.step}
                    </div>

                    {/* Spacer to push content down */}
                    <div className="flex-1"></div>

                    {/* Content - At Bottom */}
                    <div className="mb-4 lg:mb-6">
                      {/* Title */}
                      <h3
                        className="text-white mb-3 lg:mb-4"
                        style={{
                          fontFamily: 'Rajdhani, sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? 'clamp(24px, 6vw, 36px)' : '48px',
                          lineHeight: isMobile ? '1.2' : '56px',
                          letterSpacing: '-1.5px',
                        }}
                      >
                        {step.title.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < step.title.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-white/70"
                        style={{
                          fontFamily: 'Rajdhani, sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '14px' : '16px',
                          lineHeight: '1.6',
                        }}
                      >
                        {step.description}
                      </p>
                    </div>

                    {/* Icon with gradient colors */}
                    <div className="absolute top-4 right-4 lg:top-8 lg:right-8 flex items-center justify-center">
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: isMobile ? '80px' : '120px',
                          height: isMobile ? '80px' : '120px',
                          border: '2px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <img
                          src={step.icon}
                          alt={`${step.step} icon`}
                          style={{
                            width: isMobile ? '44px' : '64px',
                            height: isMobile ? '44px' : '64px',
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkProcessSection;

