import React, { useState, useEffect } from 'react';
import { Home, Menu, Layers, Briefcase, FileText, MessageSquare } from 'lucide-react';

const VerticalNavBar = () => {
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { icon: Home, label: 'Home', href: '#home', sectionId: 'home' },
    { icon: Menu, label: 'Experiences', href: '#experience', sectionId: 'experience' },
    { icon: Layers, label: 'Selected Work', href: '#selected-works', sectionId: 'selected-works' },
    { icon: Briefcase, label: 'Services', href: '#services', sectionId: 'services' },
    { icon: FileText, label: 'Work Process', href: '#work-process', sectionId: 'work-process' },
    { icon: MessageSquare, label: 'Contact', href: '#contact', sectionId: 'contact' },
  ];

  // Scroll detection to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      // Check which section is in view
      const sections = navItems.map(item => {
        const element = document.getElementById(item.sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return {
            id: item.sectionId,
            top: rect.top + window.scrollY,
            bottom: rect.bottom + window.scrollY,
          };
        }
        return null;
      }).filter(Boolean);

      // Find the section that contains the scroll position
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].top && scrollPosition <= sections[i].bottom) {
          setActiveSection(sections[i].id);
          return;
        }
      }

      // Default to first section if at top
      if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset from top
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setActiveSection(sectionId);
  };

  return (
    <div 
      className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 rounded-full p-3 shadow-2xl"
      style={{ 
        background: 'rgba(24, 24, 27, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex flex-col gap-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.sectionId;
          
          return (
            <a
              key={item.sectionId}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              }}
              title={item.label}
            >
              <Icon 
                className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/70'}`}
                strokeWidth={1.5}
                style={{
                  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default VerticalNavBar;
