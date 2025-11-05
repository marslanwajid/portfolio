import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Twitter, Linkedin, Github } from 'lucide-react';
import { fetchPortfolioSettings } from '../utils/api';
import MobileMenu from './MobileMenu';

const StickySidebar = () => {
  const [settings, setSettings] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const staticButtonRef = useRef(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchPortfolioSettings();
        setSettings(data);
        setImageError(false);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const contact = settings?.contact || {};
  const social = settings?.social || {};
  
  const profileImageSrc = imageError || !settings?.profile_photo 
    ? "/arslan.png" 
    : settings.profile_photo;

  // Calculate and update the floating button position to match the static menu button
  const updateButtonPosition = () => {
    if (!staticButtonRef.current) return;
    const rect = staticButtonRef.current.getBoundingClientRect();
    const desiredLeft = rect.left;
    const maxLeft = Math.max(0, window.innerWidth - 48 - 16); // prevent overflow (button ~48px + 16px margin)
    const clampedLeft = Math.min(Math.max(0, desiredLeft), maxLeft);
    setButtonPosition({
      top: rect.top + window.scrollY,
      left: clampedLeft
    });
  };

  // Get the initial position of the static button and update on resize
  useEffect(() => {
    updateButtonPosition();
    window.addEventListener('resize', updateButtonPosition);
    return () => window.removeEventListener('resize', updateButtonPosition);
  }, [settings]);

  // When sticky state toggles, ensure position is freshly measured so the animated button matches the static one
  useEffect(() => {
    if (isScrolled || isLeaving) {
      updateButtonPosition();
    }
  }, [isScrolled, isLeaving]);

  // Track scroll position for sticky button
  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      const shouldBeScrolled = window.scrollY > scrollThreshold;
      
      if (isScrolled && !shouldBeScrolled) {
        // Trigger leave animation
        setIsLeaving(true);
        setTimeout(() => {
          setIsScrolled(false);
          setIsLeaving(false);
        }, 600); // Match animation duration (increased to 600ms)
      } else if (!isScrolled && shouldBeScrolled) {
        setIsScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Track active section for mobile menu
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      const navItems = [
        { sectionId: 'home' },
        { sectionId: 'experience' },
        { sectionId: 'selected-works' },
        { sectionId: 'services' },
        { sectionId: 'work-process' },
        { sectionId: 'contact' },
      ];
      
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

      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].top && scrollPosition <= sections[i].bottom) {
          setActiveSection(sections[i].id);
          return;
        }
      }

      if (window.scrollY < 200) {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
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
    <>
      <style>
        {`
          @keyframes slide-down {
            0% {
              transform: translateY(-100px);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes slide-up {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(0);
              opacity: 0;
            }
          }
          
          .animate-slide-down {
            animation: slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .animate-slide-up {
            animation: slide-up 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .sticky-button-enter {
            animation: slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}
      </style>

      {/* Floating Sticky Button - Appears at same position when scrolled */}
      {(isScrolled || isLeaving) && (
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`lg:hidden fixed w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 shadow-lg z-[9999] ${
            isLeaving ? 'animate-slide-up' : 'animate-slide-down'
          }`}
          style={{
            top: `${buttonPosition.top}px`,
            left: `${buttonPosition.left}px`
          }}
          aria-label="Open menu"
        >
          <img 
            src="https://wpriverthemes.com/jayden/wp-content/themes/jayden/icons/dashboard.svg" 
            alt="menu icon"
            className="w-6 h-6"
          />
        </button>
      )}

      <aside className="relative lg:fixed left-0 top-0 lg:top-[2vh] h-auto lg:h-[100vh] w-full lg:w-[450px] bg-black flex lg:items-center justify-start p-4 z-50 overflow-y-auto">
        <div 
          className="w-full lg:max-w-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden lg:ml-4 lg:h-[94vh]"
          style={{ 
            height: 'auto',
            minHeight: 'auto',
            background: 'rgba(24, 24, 27, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {/* Logo - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex w-10 h-10 bg-white rounded-xl items-center justify-center">
            <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>

          {/* Availability pill */}
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'rgba(39, 39, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-400 text-sm">Available for <span className="text-white font-medium">Projects and Hire</span></span>
          </div>

          {/* Mobile Menu Button - Static version */}
          <button
            ref={staticButtonRef}
            onClick={() => setIsMenuOpen(true)}
            className={`lg:hidden w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300 ${
              isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            aria-label="Open menu"
          >
            <img 
              src="https://wpriverthemes.com/jayden/wp-content/themes/jayden/icons/dashboard.svg" 
              alt="menu icon"
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* Profile Image with gradient background */}
        <div className="relative rounded-3xl overflow-visible mb-2 lg:h-[50%]" style={{ height: 'auto', minHeight: '200px' }}>
          <div className="relative rounded-3xl overflow-hidden h-full" style={{ minHeight: '200px' }}>
            <div 
              className="absolute inset-0" 
              style={{
                background: 'linear-gradient(135deg, #FF0000 0%, #FF4500 30%, #FF6B00 60%, #FFA500 100%)'
              }}
            ></div>
            <img 
              src={profileImageSrc} 
              alt="Profile" 
              className="relative w-full h-full object-cover"
              onError={() => {
                if (!imageError) {
                  setImageError(true);
                }
              }}
            />
          </div>
          <div className="absolute -bottom-6 left-0 right-0 text-center">
            <h1 
              className="text-white text-4xl lg:text-7xl italic tracking-wide"
              style={{ 
                fontFamily: "'Brush Script MT', 'Lucida Handwriting', cursive",
                fontWeight: 400,
                letterSpacing: '0.02em',
                transform: 'rotate(-8deg)',
                transformOrigin: 'center'
              }}
            >
              Arslan
            </h1>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center mb-6 mt-8">
          <p className="text-white text-base mb-1 font-normal tracking-wide">{contact?.email || 'wajidmarslan@gmail.com'}</p>
          <p className="text-gray-500 text-xs font-light tracking-wider">Based in {contact?.location || 'Pakistan'}</p>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-3 mb-8">
          {social.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-all"
              style={{
                background: 'rgba(39, 39, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Linkedin className="w-4 h-4 text-white" />
            </a>
          )}
          {social.github && (
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-all"
              style={{
                background: 'rgba(39, 39, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Github className="w-4 h-4 text-white" />
            </a>
          )}
          {social.twitter && (
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-all"
              style={{
                background: 'rgba(39, 39, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Twitter className="w-4 h-4 text-white" />
            </a>
          )}
        </div>

        {/* Get Started Button */}
        <button 
          className="w-full text-white rounded-full py-4 px-6 flex items-center justify-between group transition-all hover:brightness-110"
          style={{
            background: 'rgba(39, 39, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <span className="text-base font-medium tracking-wide">Get Started</span>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5 text-black" />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeSection={activeSection}
        onNavClick={handleNavClick}
        social={social}
      />
      </aside>
    </>
  );
};

export default StickySidebar;