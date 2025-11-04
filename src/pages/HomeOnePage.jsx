import { useEffect, useState } from 'react';
import { fetchPortfolioSettings, fetchPortfolios, fetchExperience, fetchSkills } from '../utils/api';
import StickySidebar from '../components/StickySidebar';
import VerticalNavBar from '../components/VerticalNavBar';
import HeroSection from '../components/HeroSection';
import ExperiencesSection from '../components/ExperiencesSection';
import SelectedWorks from '../components/SelectedWorks';
import ServicesSection from '../components/ServicesSection';
import AboutSkillsSection from '../components/AboutSkillsSection';
import FAQSection from '../components/FAQSection';
import WorkProcessSection from '../components/WorkProcessSection';
import ContactSection from '../components/ContactSection';
import CTASection from '../components/CTASection';

function HomeOnePage() {
  const [settings, setSettings] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Set default title immediately on mount
  useEffect(() => {
    document.title = 'Arslan Wajid Portfolio';
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate progress for smooth animation
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (prev >= 90) return prev; // Stop at 90% until data loads
            return prev + Math.random() * 15;
          });
        }, 100);

        const [settingsData, projectsData, expData, skillsData] = await Promise.all([
          fetchPortfolioSettings(),
          fetchPortfolios({ per_page: 100 }), // Fetch all portfolios to check all checkboxes
          fetchExperience(),
          fetchSkills(),
        ]);
        
        // Complete the progress
        setLoadingProgress(100);
        
        // Small delay to show 100% before hiding
        setTimeout(() => {
          setSettings(settingsData);
          setProjects(projectsData);
          setExperience(expData);
          setSkills(skillsData);
          
          // Update document title from WordPress settings
          // Use WordPress site title if available and not empty, otherwise use default
          const siteTitle = settingsData?.site_title?.trim();
          document.title = siteTitle || 'Arslan Wajid Portfolio';
          
          setLoading(false);
        }, 300);
        
        clearInterval(progressInterval);
      } catch (error) {
        // Error loading data - set default title
        document.title = 'Arslan Wajid Portfolio';
        setLoadingProgress(100);
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999] px-4">
        <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] flex items-center justify-center">
          {/* Angle Brackets Container */}
          <div className="relative inline-block w-full">
            {/* Base brackets (always visible, but will be covered) */}
            <div 
              className="text-white/20 text-5xl sm:text-6xl md:text-8xl font-light tracking-wider text-center"
              style={{
                fontFamily: 'monospace',
              }}
            >
              &lt;/&gt;
            </div>
            
            {/* Filled brackets (fills from bottom to top) */}
            <div 
              className="absolute inset-0 text-white text-5xl sm:text-6xl md:text-8xl font-light tracking-wider text-center overflow-hidden transition-all duration-500 ease-out"
              style={{
                fontFamily: 'monospace',
                clipPath: `inset(${100 - loadingProgress}% 0 0 0)`,
              }}
            >
              &lt;/&gt;
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hero = settings?.hero || {};

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background Video - Fixed */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
        style={{ position: 'fixed', top: 0, left: 0, minWidth: '100%', minHeight: '100%' }}
      >
        <source src="/video-1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay for better readability */}
      <div className="fixed inset-0 bg-black/30 z-[1]"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Left Fixed Sidebar */}
        <StickySidebar />

        {/* Right Sticky Navigation Bar */}
        <VerticalNavBar />

        {/* Right Scrollable Content - with left margin for sidebar on desktop */}
        <div className="lg:ml-[450px] ml-0 pt-0 lg:pt-0">
        {/* Hero Section */}
        <HeroSection hero={hero} />

        {/* Experiences Section */}
        <ExperiencesSection experiences={experience} />

        {/* Selected Work Section */}
        <SelectedWorks projects={projects} />

        {/* Services Section */}
        <ServicesSection />

        {/* About + Skills (carousel) */}
        <AboutSkillsSection aboutHtml={settings?.about_me} />

        {/* Work Process Section */}
        <WorkProcessSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Contact Section */}
        <ContactSection />

        {/* CTA Section */}
        <CTASection />

        {/* TODO: Add more section components here one by one */}
        </div>
      </div>
    </div>
  );
}

export default HomeOnePage;
