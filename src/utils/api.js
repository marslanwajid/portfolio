// API utility functions for WordPress REST API
const API_BASE = 'https://headless-cms.free.nf/wp-json';

export const fetchPortfolioSettings = async () => {
  const response = await fetch(`${API_BASE}/portfolio/v1/settings`);
  if (!response.ok) throw new Error('Failed to fetch portfolio settings');
  return await response.json();
};

export const fetchPortfolios = async (params = {}) => {
  const queryParams = new URLSearchParams({
    _embed: 'true',
    per_page: '100', // Fetch up to 100 portfolios (WordPress default max)
    ...params,
  }).toString();
  const response = await fetch(`${API_BASE}/wp/v2/portfolio?${queryParams}`);
  if (!response.ok) throw new Error('Failed to fetch portfolios');
  const portfolios = await response.json();
  
  // Filter to only show items with show_on_frontend = true
  // Handle various formats: true, '1', 'yes', 1
  const filtered = portfolios.filter(portfolio => {
    const showOnFrontend = portfolio.show_on_frontend;
    // Return true if show_on_frontend is explicitly true, '1', 'yes', or 1
    return showOnFrontend === true || 
           showOnFrontend === '1' || 
           showOnFrontend === 1 ||
           showOnFrontend === 'yes';
  });
  
  // Only return portfolios that have show_on_frontend = true
  return filtered;
};

export const fetchPortfolioBySlug = async (slug) => {
  const response = await fetch(`${API_BASE}/wp/v2/portfolio?slug=${slug}&_embed=true`);
  if (!response.ok) throw new Error('Failed to fetch portfolio');
  const data = await response.json();
  return data[0]; // Return first match
};

export const fetchSkills = async () => {
  const response = await fetch(`${API_BASE}/wp/v2/skill?_embed`);
  if (!response.ok) throw new Error('Failed to fetch skills');
  return await response.json();
};

export const fetchExperience = async () => {
  const response = await fetch(`${API_BASE}/wp/v2/experience?_embed`);
  if (!response.ok) throw new Error('Failed to fetch experience');
  return await response.json();
};

export const fetchEducation = async () => {
  const response = await fetch(`${API_BASE}/wp/v2/education?_embed`);
  if (!response.ok) throw new Error('Failed to fetch education');
  return await response.json();
};

// Contact Form 7 API functions
// Note: CF7 GET endpoints require authentication, but POST submission endpoint is public
// We use a custom endpoint to fetch form by hash/title

// Fetch CF7 form by hash, title, or numeric ID using custom endpoint
export const fetchContactForm7 = async (formIdOrTitle) => {
  try {
    // First try our custom endpoint (works with hash, title, or numeric ID)
    const response = await fetch(`${API_BASE}/portfolio/v1/contact-form?id=${encodeURIComponent(formIdOrTitle)}`);
    if (response.ok) {
      const form = await response.json();
      return form;
    }
    
    // If custom endpoint returns 500, it might not be set up yet - skip it
    // Fallback: try CF7 direct endpoint if numeric ID (may require auth, so it's optional)
    if (!isNaN(formIdOrTitle)) {
      const cf7Response = await fetch(`${API_BASE}/contact-form-7/v1/contact-forms/${formIdOrTitle}`);
      if (cf7Response.ok) {
        const form = await cf7Response.json();
        return form;
      } else if (cf7Response.status === 403 || cf7Response.status === 401) {
        return null; // Return null so we use the ID directly
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
};

// Extract field names from CF7 form HTML
export const extractFieldNamesFromCF7 = (formHtml) => {
  const fieldNames = [];
  // Match CF7 field tags like [email* your-email], [tel* your-phone], [textarea* your-message], [radio budget]
  const fieldRegex = /\[(?:email|tel|text|textarea|radio|select|checkbox|number|date|url|file|hidden|acceptance|captcha|quiz|submit)[*\s]*([^\]]+)\]/gi;
  let match;
  
  while ((match = fieldRegex.exec(formHtml)) !== null) {
    const fieldTag = match[1].trim();
    // Extract field name (part before any pipe or space)
    const fieldName = fieldTag.split(/[\s|]/)[0];
    if (fieldName && !fieldNames.includes(fieldName)) {
      fieldNames.push(fieldName);
    }
  }
  
  return fieldNames;
};

export const submitContactForm7 = async (formId, formData) => {
  // Ensure formId is numeric (CF7 REST API requires numeric IDs)
  const numericFormId = typeof formId === 'number' ? formId : parseInt(formId);
  
  if (isNaN(numericFormId)) {
    throw new Error(`Invalid form ID: ${formId}. CF7 requires numeric form IDs.`);
  }

  // Use FormData for proper submission
  const formBody = new FormData();
  
  // Add all form fields to FormData
  Object.keys(formData).forEach(key => {
    if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
      formBody.append(key, formData[key]);
    }
  });

  // Add required CF7 metadata fields
  formBody.append('_wpcf7', numericFormId.toString());
  formBody.append('_wpcf7_version', '5.9');
  formBody.append('_wpcf7_locale', 'en_US');
  formBody.append('_wpcf7_unit_tag', `wpcf7-f${numericFormId}-o1`);
  formBody.append('_wpcf7_container_post', '0');

  const response = await fetch(`${API_BASE}/contact-form-7/v1/contact-forms/${numericFormId}/feedback`, {
    method: 'POST',
    body: formBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit form: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  
  if (result.status === 'mail_sent') {
    return { success: true, message: result.message };
  } else {
    return { 
      success: false, 
      message: result.message || 'Failed to send message', 
      errors: result.invalid_fields || {} 
    };
  }
};

