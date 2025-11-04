import { useEffect, useState } from 'react';
import { fetchPortfolioSettings } from '../utils/api';

// Footer Component
// This appears at the bottom of every page

function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchPortfolioSettings();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  const social = settings?.social || {};

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-8 flex justify-between items-center flex-wrap gap-4">
        {/* Copyright */}
        <p className="m-0 text-gray-300">
          © {currentYear} My Portfolio. All rights reserved.
        </p>

        {/* Social Links */}
        <div className="flex gap-6">
          {social.linkedin && (
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white no-underline hover:text-blue-400 transition-colors"
            >
              LinkedIn
            </a>
          )}
          {social.github && (
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white no-underline hover:text-blue-400 transition-colors"
            >
              GitHub
            </a>
          )}
          {social.twitter && (
            <a
              href={social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white no-underline hover:text-blue-400 transition-colors"
            >
              Twitter
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

