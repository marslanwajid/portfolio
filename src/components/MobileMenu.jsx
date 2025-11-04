import React from 'react';
import { X, Home, Menu, Layers, Briefcase, FileText, MessageSquare, Twitter, Linkedin, Github } from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, activeSection, onNavClick, social }) => {
  const navItems = [
    { icon: Home, label: 'Home', href: '#home', sectionId: 'home' },
    { icon: Menu, label: 'Experiences', href: '#experience', sectionId: 'experience' },
    { icon: Layers, label: 'Selected Work', href: '#selected-works', sectionId: 'selected-works' },
    { icon: Briefcase, label: 'Services', href: '#services', sectionId: 'services' },
    { icon: FileText, label: 'Work Process', href: '#work-process', sectionId: 'work-process' },
    { icon: MessageSquare, label: 'Contact', href: '#contact', sectionId: 'contact' },
  ];

  const handleNavClick = (e, href, sectionId) => {
    e.preventDefault();
    onNavClick(e, href, sectionId);
    onClose(); // Close menu after navigation
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[9998] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Off-canvas menu */}
      <div 
        className={`fixed top-0 right-0 h-full w-2/3 max-w-sm bg-[#1A1A1A] z-[9999] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="h-full overflow-y-auto p-6">
          {/* Close Button */}
          <div className="flex justify-start mb-8">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Menu Section */}
          <div className="mb-8">
            <h2 className="text-white text-sm mb-6 tracking-widest">• Menu</h2>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.sectionId;
                
                return (
                  <a
                    key={item.sectionId}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-base font-medium">{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Social Network Section */}
          <div>
            <h2 className="text-white text-sm mb-6 tracking-widest">• Social Network</h2>
            <div className="flex gap-3">
              {social?.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors"
                  style={{
                    background: 'rgba(39, 39, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              )}
              {social?.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors"
                  style={{
                    background: 'rgba(39, 39, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <Github className="w-5 h-5 text-white" />
                </a>
              )}
              {social?.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors"
                  style={{
                    background: 'rgba(39, 39, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;

