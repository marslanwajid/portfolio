import React from 'react';

const CTASection = () => {
  // Create items for marquee - we'll duplicate them for seamless loop
  const marqueeContent = (
    <>
      <div className="flex items-center flex-shrink-0 px-8">
        <div
          className="text-white uppercase tracking-wider whitespace-nowrap"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 400,
            fontSize: 'clamp(32px, 8vw, 72px)',
            lineHeight: '1.2',
            letterSpacing: '-2px',
          }}
        >
          Book A Call
        </div>
      </div>
      <div className="flex-shrink-0">
        <div 
          className="w-2 h-2 rounded-full bg-white"
          style={{ margin: '0 24px' }}
        />
      </div>
    </>
  );

  return (
    <section className="py-8 lg:py-12 px-4 lg:px-8 relative flex justify-center">
      <a 
        href="#contact" 
        className="block relative overflow-hidden cursor-pointer group lg:w-[40%] w-[95%]"
        onClick={(e) => {
          e.preventDefault();
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        style={{
          maxWidth: '800px',
          zIndex: 1000,
        }}
      >
        {/* Signature - Arslan */}
        <div className="flex justify-center -mb-10 ">
          <h2
            className="text-white"
            style={{
              fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
              fontSize: '56px',
              fontWeight: 400,
              letterSpacing: '0.05em',
            }}
          >
            Arslan
          </h2>
        </div>

        {/* Marquee Container */}
        <div 
          className="relative overflow-hidden lg:min-h-[120px] lg:p-[40px_0]"
          style={{
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '100px',
            padding: '24px 0',
            minHeight: '80px',
            zIndex: -1000,
          }}
        >
          <div className="overflow-hidden marquee-container">
            <div 
              className="marquee-content"
              style={{
                animation: 'marquee 70s linear infinite',
                willChange: 'transform',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {/* First set - these items will scroll left */}
              {[...Array(20)].map((_, i) => (
                <React.Fragment key={`item-${i}`}>
                  {marqueeContent}
                </React.Fragment>
              ))}
              
              {/* Exact duplicate set - when first set moves -50%, this set takes over seamlessly */}
              {[...Array(20)].map((_, i) => (
                <React.Fragment key={`clone-${i}`}>
                  {marqueeContent}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </a>

      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% / 2));
          }
        }
        .marquee-container {
          overflow: hidden;
          position: relative;
        }
        .marquee-content {
          display: inline-flex;
          align-items: center;
          width: max-content;
        }
        .marquee-content > * {
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
};

export default CTASection;

