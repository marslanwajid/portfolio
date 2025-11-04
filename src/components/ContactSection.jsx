import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fetchContactForm7, submitContactForm7, extractFieldNamesFromCF7 } from '../utils/api';

const ContactSection = () => {
  const [cf7Form, setCf7Form] = useState(null);
  const [cf7FormId, setCf7FormId] = useState(null);
  const [cf7FieldNames, setCf7FieldNames] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    message: '',
    budget: '< $1,000',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const [visibleWords, setVisibleWords] = useState(0);
  const [visibleFields, setVisibleFields] = useState([]);
  const sectionRef = useRef(null);
  const wordIntervalRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const heading = 'Contact For Work';
  const words = heading.split(' ');
  const formFields = ['email', 'phone', 'message'];
  // CF7 Form numeric ID - Get from WordPress admin URL: ?page=wpcf7&post=101
  // From your URL: https://headless-cms.wasmer.app/wp-admin/admin.php?page=wpcf7&post=101
  // The numeric ID is 101
  const CF7_FORM_NUMERIC_ID = 101; // Numeric form ID (required for submission)

  // Fetch CF7 form structure on mount (optional - for field extraction)
  useEffect(() => {
    const loadForm = async () => {
      try {
        // Try to fetch form details to extract field names
        const form = await fetchContactForm7(CF7_FORM_NUMERIC_ID);
        
        if (form) {
          setCf7Form(form);
          setCf7FormId(form.id);
          
          // Extract field names from the form HTML
          if (form.form) {
            const fieldNames = extractFieldNamesFromCF7(form.form);
            
            // Map common field names
            const fieldMap = {};
            fieldNames.forEach(field => {
              if (field.toLowerCase().includes('email') || field.toLowerCase().includes('mail')) {
                fieldMap.email = field;
              } else if (field.toLowerCase().includes('phone') || field.toLowerCase().includes('tel')) {
                fieldMap.phone = field;
              } else if (field.toLowerCase().includes('message') || field.toLowerCase().includes('msg')) {
                fieldMap.message = field;
              } else if (field.toLowerCase().includes('budget') || field.toLowerCase().includes('price')) {
                fieldMap.budget = field;
              }
            });
            
            setCf7FieldNames(fieldMap);
          }
        } else {
          // If fetch fails, still use the numeric ID for submission
          setCf7FormId(CF7_FORM_NUMERIC_ID);
        }
      } catch (error) {
        // Silently fail - will use form ID directly
        // Still set the form ID for submission
        setCf7FormId(CF7_FORM_NUMERIC_ID);
      }
    };
    loadForm();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear submit status when user types
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Use the form ID from state, or fallback to CF7_FORM_NUMERIC_ID constant
      const formId = cf7FormId || CF7_FORM_NUMERIC_ID;
      
      if (!formId || isNaN(formId)) {
        throw new Error('Contact Form 7 ID not configured. Please set the numeric form ID in ContactSection.jsx');
      }

      // Map our form fields to CF7 field names
      // Use the extracted field names from CF7, or fallback to common patterns
      const cf7FormData = {};
      
      // Use mapped field names if available, otherwise try common patterns
      if (cf7FieldNames.email) {
        cf7FormData[cf7FieldNames.email] = formData.email;
      } else {
        // Try common CF7 field name patterns
        cf7FormData['your-email'] = formData.email;
        cf7FormData['email'] = formData.email;
      }
      
      if (cf7FieldNames.phone) {
        cf7FormData[cf7FieldNames.phone] = formData.phone;
      } else {
        cf7FormData['your-phone'] = formData.phone;
        cf7FormData['phone'] = formData.phone;
      }
      
      if (cf7FieldNames.message) {
        cf7FormData[cf7FieldNames.message] = formData.message;
      } else {
        cf7FormData['your-message'] = formData.message;
        cf7FormData['message'] = formData.message;
      }
      
      if (cf7FieldNames.budget && formData.budget) {
        cf7FormData[cf7FieldNames.budget] = formData.budget;
      } else if (formData.budget) {
        cf7FormData['your-budget'] = formData.budget;
        cf7FormData['budget'] = formData.budget;
      }

      const result = await submitContactForm7(formId, cf7FormData);
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message || 'Thank you! Your message has been sent.' });
        // Reset form
        setFormData({
          email: '',
          phone: '',
          message: '',
          budget: '< $1,000',
        });
      } else {
        setSubmitStatus({ type: 'error', message: result.message || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const budgetOptions = [
    '< $1,000',
    '$1,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000 - $20,000',
    '> $20,000',
  ];

  // Scroll animation for heading and form fields
  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
        setIsVisible(true);
        
        // Animate heading words
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

        // Animate form fields one by one
        formFields.forEach((field, index) => {
          setTimeout(() => {
            setVisibleFields(prev => {
              if (!prev.includes(field)) {
                return [...prev, field];
              }
              return prev;
            });
          }, 500 + (index * 150));
        });
      } else {
        // Reset when out of view
        if (wordIntervalRef.current) {
          clearInterval(wordIntervalRef.current);
          wordIntervalRef.current = null;
        }
        hasAnimatedRef.current = false;
        setVisibleWords(0);
        setIsVisible(false);
        setVisibleFields([]);
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
  }, [words.length, formFields.length]);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen bg-transparent flex items-center justify-center px-4 lg:px-12 py-12 lg:py-20 relative"
    >
      <div className="w-full max-w-[900px] mx-auto">
        {/* Form Container */}
        <div
          className="rounded-3xl p-6 lg:p-12"
          style={{
            background: 'rgba(0,0,0,0.35)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Title */}
          <h1
            className="text-white mb-12"
          style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(40px, 10vw, 96px)',
            lineHeight: '1',
            letterSpacing: '-4px',
          }}
        >
            {words.map((word, index) => (
              <React.Fragment key={index}>
                <span
                  className="inline-block mr-4 transition-opacity duration-500"
                  style={{
                    opacity: index < visibleWords ? 1 : 0.15,
                  }}
                >
                  {word}
                </span>
                {index === 2 && <br />}
              </React.Fragment>
            ))}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <fieldset 
              className="space-y-3 transition-all duration-500"
              style={{
                opacity: visibleFields.includes('email') ? 1 : 0,
                transform: visibleFields.includes('email') ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <label
                className="block text-white text-xs"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                }}
              >
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter the Email"
                required
                className="w-full bg-transparent text-white placeholder-gray-400 outline-none border-b border-gray-500 pb-2 focus:border-white transition-colors"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                }}
              />
            </fieldset>

            {/* Phone Field */}
            <fieldset 
              className="space-y-3 transition-all duration-500"
              style={{
                opacity: visibleFields.includes('phone') ? 1 : 0,
                transform: visibleFields.includes('phone') ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <label
                className="block text-white text-xs"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                }}
              >
                Your Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                className="w-full bg-transparent text-white placeholder-gray-400 outline-none border-b border-gray-500 pb-2 focus:border-white transition-colors"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                }}
              />
            </fieldset>

            {/* Messenger Field */}
            <fieldset 
              className="space-y-3 transition-all duration-500"
              style={{
                opacity: visibleFields.includes('message') ? 1 : 0,
                transform: visibleFields.includes('message') ? 'translateY(0)' : 'translateY(20px)',
              }}
            >
              <label
                className="block text-white text-xs"
                style={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                }}
              >
                Messenger
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="10"
                maxLength="2000"
                className="w-full bg-transparent text-white placeholder-gray-400 outline-none border-b border-gray-500 pb-2 focus:border-white transition-colors resize-none"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  minHeight: '100px',
                }}
              />
            </fieldset>

            {/* Budget Range Selection */}
            <div 
              className="flex flex-wrap gap-3 py-4 transition-all duration-500"
              style={{
                opacity: visibleFields.includes('message') ? 1 : 0,
                transform: visibleFields.includes('message') ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '200ms',
              }}
            >
              {budgetOptions.map((option, index) => (
                <div key={index}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="budget"
                      value={option}
                      checked={formData.budget === option}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span
                      className={`px-5 py-3 rounded-lg text-center transition-all ${
                        formData.budget === option
                          ? 'bg-white text-black'
                          : 'bg-transparent text-white border border-gray-500 hover:border-gray-400'
                      }`}
                      style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                      }}
                    >
                      {option}
                    </span>
                  </label>
                </div>
              ))}
            </div>

            {/* Submit Status Message */}
            {submitStatus && (
              <div 
                className={`p-4 rounded-lg mb-4 transition-all ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            {/* Get Started Button */}
            <div 
              className="pt-4 transition-all duration-500"
              style={{
                opacity: visibleFields.includes('message') ? 1 : 0,
                transform: visibleFields.includes('message') ? 'translateY(0)' : 'translateY(20px)',
                transitionDelay: '400ms',
              }}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-white text-black rounded-lg px-6 py-4 flex items-center justify-between transition-colors ${
                  isSubmitting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-100'
                }`}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                }}
              >
                <span className="text-left">
                  {isSubmitting ? 'Sending...' : 'Get Started'}
                </span>
                {!isSubmitting && <ArrowUpRight className="w-5 h-5" strokeWidth={2} />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

