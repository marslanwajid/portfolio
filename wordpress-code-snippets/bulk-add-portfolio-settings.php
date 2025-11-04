<?php
/**
 * Bulk Add/Update Portfolio Settings
 * This will set your personal information, contact details, and social links
 * Activate ONCE, then deactivate (runs automatically)
 */

function bulk_add_portfolio_settings_on_activation() {
    // Check if already added
    if (get_option('portfolio_settings_bulk_added')) {
        return;
    }

    // Hero Section
    $hero_headline = 'Full Stack Developer';
    $hero_subtitle = 'Building beautiful and functional web applications with WordPress, React, and modern technologies';

    // About Me / Summary
    $about_me = '<p>Experienced Full Stack Developer specializing in WordPress, React.js, and modern web technologies. Passionate about creating responsive, performant, and user-friendly web applications.</p>

<p><strong>Key Strengths:</strong></p>
<ul>
<li>Extensive experience with WordPress custom theme and plugin development</li>
<li>Proficient in React.js, Redux, and modern front-end frameworks</li>
<li>Expert in WooCommerce eCommerce solutions</li>
<li>Strong backend development skills with PHP, Laravel, and Node.js</li>
<li>SEO optimization and performance enhancement expertise</li>
<li>Experience with REST API integration and custom API development</li>
</ul>

<p>I have successfully delivered 17+ portfolio projects, working with international clients from Czech Republic, Qatar, and beyond. Currently working as a Full Stack Developer at Digital Optimisers and as a Project-Based Developer for Tauronic.</p>';

    // Contact Information
    $email = ''; // ADD YOUR EMAIL HERE
    $phone = ''; // ADD YOUR PHONE HERE
    $location = ''; // ADD YOUR LOCATION HERE (e.g., "Remote" or "Pakistan")

    // Social Links
    $linkedin = ''; // ADD YOUR LINKEDIN URL HERE (e.g., "https://linkedin.com/in/yourname")
    $github = ''; // ADD YOUR GITHUB URL HERE (e.g., "https://github.com/yourname")
    $twitter = ''; // ADD YOUR TWITTER/X URL HERE (optional)

    // Portfolio Website
    $portfolio_site = ''; // ADD YOUR PORTFOLIO WEBSITE URL HERE (if you have one)

    // Resume/CV URL
    $resume_url = ''; // ADD YOUR RESUME/CV URL HERE (optional)

    // Update all settings
    update_option('portfolio_hero_headline', $hero_headline);
    update_option('portfolio_hero_subtitle', $hero_subtitle);
    update_option('portfolio_about_me', $about_me);
    update_option('portfolio_email', $email);
    update_option('portfolio_phone', $phone);
    update_option('portfolio_location', $location);
    update_option('portfolio_linkedin', $linkedin);
    update_option('portfolio_github', $github);
    update_option('portfolio_twitter', $twitter);
    update_option('portfolio_resume_url', $resume_url);

    // Mark as completed
    update_option('portfolio_settings_bulk_added', true);

    error_log('✓ Portfolio settings have been added!');
    error_log('⚠ Remember to update email, phone, and social links in the code or WordPress Settings → Portfolio Settings');
}

// Run on init (only once)
add_action('init', function() {
    if (!get_option('portfolio_settings_bulk_added')) {
        bulk_add_portfolio_settings_on_activation();
    }
}, 999);

