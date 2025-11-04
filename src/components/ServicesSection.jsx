import React, { useState, useEffect, useRef } from 'react';
import { Code2, Layers, Globe, Boxes, ShoppingBag } from 'lucide-react';

const ServicesSection = () => {
  const [activeService, setActiveService] = useState(1);
  const [visibleServices, setVisibleServices] = useState([]);
  const sectionRef = useRef(null);
  const contentRefs = useRef({});
  const [contentHeights, setContentHeights] = useState({});

  const services = [
    {
      id: 1,
      icon: Code2, // Full Stack
      title: 'Full Stack Development',
      number: '(01)',
      items: [
        'Frontend & Backend Integration',
        'RESTful API Development',
        'Database Design & Optimization'
      ]
    },
    {
      id: 2,
      icon: Layers, // MERN Stack
      title: 'MERN Stack',
      number: '(02)',
      items: [
        'MongoDB Database Solutions',
        'Express.js Backend APIs',
        'React.js Frontend Applications',
        'Node.js Server Development'
      ]
    },
    {
      id: 3,
      icon: Globe, // WordPress / Headless
      title: 'WordPress Development',
      number: '(03)',
      items: [
        'Custom Themes & Plugins',
        'WooCommerce Integration',
        'Headless WordPress Setup',
        'Performance Optimization'
      ]
    },
    {
      id: 4,
      icon: Boxes, // CMS
      title: 'CMS Development',
      number: '(04)',
      items: [
        'Custom Content Management',
        'Admin Dashboard Creation',
        'Content Migration & Setup',
        'Multi-site Management'
      ]
    },
    {
      id: 5,
      icon: ShoppingBag, // Shopify
      title: 'Shopify Development',
      number: '(05)',
      items: [
        'Custom Shopify Themes',
        'Liquid Template Development',
        'App Integration & Customization',
        'Store Optimization'
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
          services.forEach((service, index) => {
            setTimeout(() => {
              setVisibleServices(prev => {
                if (!prev.includes(service.id)) {
                  return [...prev, service.id];
                }
                return prev;
              });
            }, index * 150);
          });
        } else {
          // Reset when out of view
          setVisibleServices([]);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Measure content heights for smooth max-height transitions
  useEffect(() => {
    const heights = {};
    Object.entries(contentRefs.current).forEach(([id, el]) => {
      if (el) heights[id] = el.scrollHeight;
    });
    setContentHeights(heights);
  }, [services.length]);

  return (
    <section 
      ref={sectionRef} 
      id="services"
      className="min-h-screen bg-transparent flex items-center justify-center px-4 lg:px-8 py-12 lg:py-20"
    >
      {/* Main Content Card */}
      <div 
        className="max-w-[900px] w-full mx-auto p-6 lg:p-12"
        style={{
          background: 'rgba(20, 20, 25, 0.4)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '3rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div className="mb-16">
          <div className="text-gray-500 text-xs tracking-wider mb-8">• My Services</div>
        </div>

        {/* Services Accordion */}
        <div className="space-y-0">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="border-b border-gray-800 last:border-0 transition-all duration-500"
              style={{
                opacity: visibleServices.includes(service.id) ? 1 : 0,
                transform: visibleServices.includes(service.id) ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              {/* Accordion Header */}
              <button
                onClick={() => setActiveService(activeService === service.id ? 0 : service.id)}
                className="w-full py-6 flex items-start gap-5 group transition-all duration-300"
              >
                {/* Icon with holographic background image - visually only when active */}
                <div
                  className="flex items-center justify-center flex-shrink-0 rounded-xl border transition-all"
                  style={{
                    width: activeService === service.id ? 48 : 0,
                    height: 48,
                    marginRight: activeService === service.id ? 0 : -20,
                    opacity: activeService === service.id ? 1 : 0,
                    transform: activeService === service.id ? 'scale(1)' : 'scale(0.9)',
                    backgroundImage: "url('/img-bg.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderColor: 'rgba(255,255,255,0.15)',
                    transition: 'all 650ms cubic-bezier(0.22, 1, 0.36, 1)'
                  }}
                >
                  {(() => {
                    const Icon = service.icon;
                    return <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />;
                  })()}
                </div>

                {/* Title and Content Container */}
                <div className="flex-1 text-left">
                  {/* Title and Number */}
                  <div className="flex items-baseline gap-3">
                    <h3
                      className="text-5xl tracking-tight transition-all duration-300"
                      style={{
                        color: activeService === service.id ? '#FFFFFF' : '#505050',
                        fontWeight: 300,
                        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      }}
                    >
                      {service.title}
                    </h3>
                    <span className="text-gray-600 text-sm font-light ml-auto">
                      {service.number}
                    </span>
                  </div>

                  {/* Accordion Content - Below title */}
                  <div
                    className="overflow-hidden transition-all"
                    style={{
                      maxHeight: activeService === service.id 
                        ? (contentHeights[service.id] ? `${contentHeights[service.id]}px` : '240px')
                        : '0px',
                      opacity: activeService === service.id ? 1 : 0,
                      transform: activeService === service.id ? 'translateY(0)' : 'translateY(-4px)',
                      transition: 'max-height 800ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease, transform 500ms ease',
                      willChange: 'max-height, opacity, transform'
                    }}
                  >
                    <div 
                      ref={(el) => { if (el) contentRefs.current[service.id] = el; }}
                      className="pt-6 space-y-2"
                    >
                      {service.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-gray-300 text-sm tracking-wide leading-relaxed"
                          style={{
                            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                            fontWeight: 300,
                          }}
                        >
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span>Available to <span className="text-white font-normal">Worldwide</span></span>
          </div>
          <a
            href="#contact"
            className="text-white text-xs tracking-wide hover:text-orange-500 transition-colors flex items-center gap-2"
          >
            Contact me
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

