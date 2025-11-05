import React, { useState, useEffect, useRef } from 'react';

// FAQ data
const faqData = [
  {
    id: 1,
    question: "What's the delivery time estimate?",
    answer: "Project timelines vary based on scope. A typical small to medium-sized website design and development project usually takes between 4 to 8 weeks.",
  },
  {
    id: 3,
    question: "What services do you offer?",
    answer: "I offer a full range of creative services including UI/UX design, front-end development (React/TypeScript), branding, and digital strategy consulting.",
  },
  {
    id: 4,
    question: "What if I don't like design?",
    answer: "Client satisfaction is my top priority. We include several revision rounds in the contract to ensure the final design meets your expectations. Should major changes be needed, we'll discuss scope adjustments.",
  },
  {
    id: 5,
    question: "Are there any refund?",
    answer: "Refund policies are detailed in the service agreement. Generally, deposits are non-refundable, but we can negotiate terms based on project cancellation stage.",
  },
];

// FAQ Item Component
const FAQItem = ({ item, isActive, onClick }) => {
  return (
    <div
      className="py-5 border-b border-white/10 transition-all duration-300"
    >
      {/* Question Header */}
      <button
        onClick={() => onClick(item.id)}
        className="w-full text-left flex justify-between items-center group focus:outline-none"
        aria-expanded={isActive}
        aria-controls={`faq-answer-${item.id}`}
      >
        <span
          className="group-hover:text-white transition-colors duration-300 text-white"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 400, // Regular weight - thin/regular not bold
            fontSize: 'clamp(24px, 5vw, 48px)',
            lineHeight: '1.2',
            letterSpacing: '-1.5px',
          }}
        >
          {item.question}
        </span>

        {/* Plus/Minus Icon */}
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full border border-white flex items-center justify-center transition-transform duration-300 ease-in-out ${
            isActive ? 'rotate-0 border-white text-white' : 'rotate-180 border-white text-white'
          }`}
        >
          {isActive ? (
            // Minus Icon
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          ) : (
            // Plus Icon
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
        </div>
      </button>

      {/* Answer Content (Collapsible) */}
      <div
        id={`faq-answer-${item.id}`}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isActive ? '200px' : '0',
          opacity: isActive ? 1 : 0,
        }}
      >
        <p className="mt-3 text-base text-white/70 pl-0 lg:pl-0 pr-12">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

// Main FAQ Section Component
const FAQSection = () => {
  // State to track the currently active (open) FAQ item ID
  const [activeIndex, setActiveIndex] = useState(null); // Start with all closed
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const sectionRef = useRef(null);

  const handleItemClick = (id) => {
    setActiveIndex(id === activeIndex ? null : id); // Toggle open/close
  };

  // Scroll animation for heading and FAQ items
  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Check if section is in viewport
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
          setIsVisible(true);
          
          // Animate FAQ items one by one
          faqData.forEach((item, index) => {
            setTimeout(() => {
              setVisibleItems(prev => {
                if (!prev.includes(item.id)) {
                  return [...prev, item.id];
                }
                return prev;
              });
            }, index * 100);
          });
        } else {
          // Reset when out of view
          setIsVisible(false);
          setVisibleItems([]);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom style for the FAQs header with Rajdhani font
  const faqTitleStyle = {
    fontFamily: 'Rajdhani, sans-serif',
    fontSize: '96px',
    lineHeight: '96px',
    letterSpacing: '-4px',
    fontWeight: 400, // Regular/Medium weight - not bold
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="min-h-screen bg-transparent flex justify-center items-start pt-20 lg:pt-16 pb-16 px-4 lg:px-6 xl:px-12"
    >
      <div className="w-full max-w-[900px]">
        {/* Title: Using inline style for precise font settings */}
        <h1
          className="mb-12 text-white transition-opacity duration-700"
          style={{
            ...faqTitleStyle,
            fontSize: 'clamp(48px, 10vw, 96px)',
            lineHeight: '1',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 700ms ease-out, transform 700ms ease-out'
          }}
        >
          FAQs
        </h1>

        {/* FAQ List */}
        <div className="w-full">
          {faqData.map((item) => (
            <div
              key={item.id}
              className="transition-all duration-500"
              style={{
                opacity: visibleItems.includes(item.id) ? 1 : 0,
                transform: visibleItems.includes(item.id) ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: `${faqData.indexOf(item) * 100}ms`
              }}
            >
              <FAQItem
                item={item}
                isActive={item.id === activeIndex}
                onClick={handleItemClick}
              />
            </div>
          ))}
        </div>

        {/* Footer Link */}
        <div className="mt-12 text-white/70 text-sm">
          <p>Do you have any other questions?</p>
          <a
            href="https://wa.me/+923156611804?text=Hello, I have a question about your services. Can you help me?"
            className="text-base text-white font-bold border-b border-white hover:text-gray-400 hover:border-gray-400 transition-colors duration-300"
            onClick={(e) => {
              e.preventDefault();
              // Scroll to contact section if exists
              window.open('https://wa.me/+923156611804?text=Hello, I have a question about your services. Can you help me?', '_blank');
            }}
          >
            Ask me directly
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

