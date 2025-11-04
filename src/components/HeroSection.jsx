import React, { useState, useEffect, useRef } from 'react';

const HeroSection = ({ hero }) => {
  const [visibleWords, setVisibleWords] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationInfo, setLocationInfo] = useState('');
  const sectionRef = useRef(null);
  const wordIntervalRef = useRef(null);

  const headline = hero?.headline || 'Making Your World a Pain Free Experience';
  const subtitle = hero?.subtitle || "My passion lies in crafting elegant, straightforward digital experiences. It's a love for simplicity, pure and simple";
  const words = headline.split(' ');

  const totalWords = words.length;

  // Get city name and timezone info
  useEffect(() => {
    const locationRef = { set: false };

    // Fallback: Extract city from timezone
    const extractCityFromTimezone = () => {
      if (locationRef.set) return; // Already set via geolocation
      
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        // Better city name mapping for common timezones
        const timezoneCityMap = {
          'America/New_York': 'New York',
          'America/Los_Angeles': 'Los Angeles',
          'America/Chicago': 'Chicago',
          'America/Denver': 'Denver',
          'America/Phoenix': 'Phoenix',
          'America/Toronto': 'Toronto',
          'America/Vancouver': 'Vancouver',
          'Europe/London': 'London',
          'Europe/Paris': 'Paris',
          'Europe/Berlin': 'Berlin',
          'Europe/Rome': 'Rome',
          'Europe/Madrid': 'Madrid',
          'Asia/Karachi': 'Karachi',
          'Asia/Dubai': 'Dubai',
          'Asia/Tokyo': 'Tokyo',
          'Asia/Shanghai': 'Shanghai',
          'Asia/Hong_Kong': 'Hong Kong',
          'Asia/Singapore': 'Singapore',
          'Asia/Mumbai': 'Mumbai',
          'Asia/Dhaka': 'Dhaka',
          'Australia/Sydney': 'Sydney',
          'Australia/Melbourne': 'Melbourne',
        };
        
        let cityName = timezoneCityMap[timeZone];
        
        // If not in map, extract from timezone string
        if (!cityName) {
          const parts = timeZone.split('/');
          cityName = parts[parts.length - 1].replace(/_/g, ' ');
        }
        
        // Get timezone offset
        const now = new Date();
        const offset = -now.getTimezoneOffset() / 60;
        const offsetStr = offset >= 0 ? `GMT+${offset}` : `GMT${offset}`;
        
        if (cityName) {
          setLocationInfo(`${cityName}, ${offsetStr}`);
          locationRef.set = true;
        }
      } catch (error) {
        // Silently fail - will show time only
      }
    };

    // Try to get city from geolocation (more accurate)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            if (response.ok) {
              const data = await response.json();
              const cityName = data.city || data.locality || data.principalSubdivision;
              
              if (cityName) {
                // Get timezone offset
                const now = new Date();
                const offset = -now.getTimezoneOffset() / 60; // Convert to hours
                const offsetStr = offset >= 0 ? `GMT+${offset}` : `GMT${offset}`;
                
                setLocationInfo(`${cityName}, ${offsetStr}`);
                locationRef.set = true;
                return;
              }
            }
          } catch (error) {
            // Silently fail and fallback to timezone
          }
          // If geolocation API fails, fallback to timezone
          if (!locationRef.set) {
            extractCityFromTimezone();
          }
        },
        (error) => {
          // Silently fail and fallback to timezone extraction
          extractCityFromTimezone();
        },
        { timeout: 5000 }
      );
    } else {
      // No geolocation support, use timezone fallback immediately
      extractCityFromTimezone();
    }

    // Fallback timeout - use timezone if geolocation takes too long
    const timeout = setTimeout(() => {
      if (!locationRef.set) {
        extractCityFromTimezone();
      }
    }, 6000);

    return () => clearTimeout(timeout);
  }, []);

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
    };

    // Update immediately
    updateTime();
    
    // Update every second
    const timeInterval = setInterval(updateTime, 1000);
    
    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset and start word animation
          if (wordIntervalRef.current) {
            clearInterval(wordIntervalRef.current);
            wordIntervalRef.current = null;
          }
          setVisibleWords(0);
          setCompletedProjects(0);
          setSuccessRate(0);
          
          wordIntervalRef.current = setInterval(() => {
            setVisibleWords((prev) => {
              if (prev < totalWords) {
                return prev + 1;
              }
              if (wordIntervalRef.current) {
                clearInterval(wordIntervalRef.current);
                wordIntervalRef.current = null;
              }
              return prev;
            });
          }, 300);
        } else {
          // Reset when out of view
          if (wordIntervalRef.current) {
            clearInterval(wordIntervalRef.current);
            wordIntervalRef.current = null;
          }
          setVisibleWords(0);
          setCompletedProjects(0);
          setSuccessRate(0);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (wordIntervalRef.current) {
        clearInterval(wordIntervalRef.current);
        wordIntervalRef.current = null;
      }
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [totalWords]);

  useEffect(() => {
    // Start counter animation after all words appear
    if (visibleWords === totalWords && visibleWords > 0) {
      const counterTimeout = setTimeout(() => {
        // Completed Projects counter
        let currentProjects = 0;
        const projectsInterval = setInterval(() => {
          currentProjects += 1;
          setCompletedProjects(currentProjects);
          if (currentProjects >= 50) {
            clearInterval(projectsInterval);
          }
        }, 40);

        // Success Rate counter
        let currentSuccess = 0;
        const successInterval = setInterval(() => {
          currentSuccess += 2;
          setSuccessRate(currentSuccess);
          if (currentSuccess >= 98) {
            clearInterval(successInterval);
          }
        }, 30);

        return () => {
          clearInterval(projectsInterval);
          clearInterval(successInterval);
        };
      }, 500);
      return () => clearTimeout(counterTimeout);
    }
  }, [visibleWords, totalWords]);

  // Parse subtitle into two lines if it contains a period
  const subtitleLines = subtitle.split('. ').filter(line => line.trim() !== '');

  return (
      <section ref={sectionRef} id="home" className="min-h-screen bg-transparent flex flex-col items-center justify-center px-4 lg:px-12 py-12 lg:py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Top location and time */}
      <div className="absolute top-8 left-12 text-gray-400 text-sm tracking-wider">
        {locationInfo ? `${locationInfo} ` : ''}
        {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </div>

      {/* Introduction label */}
      <div className="text-gray-500 text-sm mb-8 tracking-widest">• Introduction</div>

      {/* Main heading with word-by-word animation */}
      <div className="text-center mb-8 max-w-[900px] px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-tight tracking-tight">
          {words.map((word, index) => (
            <span
              key={index}
              className="inline-block mr-6 transition-all duration-700"
              style={{
                opacity: index < visibleWords ? 1 : 0,
                transform: index < visibleWords ? 'translateX(0)' : 'translateX(100px)',
              }}
            >
              {word}
            </span>
          ))}
        </h1>
      </div>

      {/* Subtitle */}
      <div className="text-center text-gray-400 text-base max-w-2xl mb-12 space-y-1">
        {subtitleLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-3 justify-center mb-16">
        {['Full Stack', 'React.js', 'WordPress', 'Shopify', 'Headless CMS'].map((tag) => (
          <span
            key={tag}
            className="px-5 py-2 rounded-full text-sm text-gray-300 tracking-wide"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

           {/* Counter cards */}
           <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-8 px-4">
             {/* Completed Projects */}
             <div
               className="rounded-3xl p-6 sm:p-8 w-full sm:w-80 h-48 sm:h-56 relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="text-gray-500 text-sm mb-4 tracking-wider">• Completed Projects</div>
          <div className="text-7xl font-light text-white mt-8">
            <span
              className="inline-block transition-all duration-500"
              style={{
                transform: completedProjects > 0 ? 'rotateX(0deg)' : 'rotateX(90deg)',
                opacity: completedProjects > 0 ? 1 : 0,
              }}
            >
              {completedProjects}+
            </span>
          </div>
        </div>

             {/* Success Rate */}
             <div
               className="rounded-3xl p-6 sm:p-8 w-full sm:w-80 h-48 sm:h-56 relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="text-gray-500 text-sm mb-4 tracking-wider">• Success Rate</div>
          <div className="text-7xl font-light text-white mt-8">
            <span
              className="inline-block transition-all duration-500"
              style={{
                transform: successRate > 0 ? 'rotateX(0deg)' : 'rotateX(90deg)',
                opacity: successRate > 0 ? 1 : 0,
              }}
            >
              {successRate}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
