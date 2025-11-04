<?php
/**
 * EXAMPLE: Portfolio Settings with Your Personal Information
 * Copy this file, fill in your details, then add to WPCode
 * 
 * INSTRUCTIONS:
 * 1. Copy this code
 * 2. Replace the placeholder values with your actual information
 * 3. Add to WPCode → Add Snippet → PHP Snippet
 * 4. Activate once, then deactivate
 */

function bulk_add_portfolio_settings_on_activation() {
    if (get_option('portfolio_settings_bulk_added')) {
        return;
    }

    // ⬇️ EDIT THESE VALUES ⬇️
    $hero_headline = 'Full Stack Developer';
    $hero_subtitle = 'Building beautiful and functional web applications with WordPress, React, and modern technologies';

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

    // ⬇️ FILL IN YOUR CONTACT INFORMATION ⬇️
    $email = 'your.email@example.com'; // CHANGE THIS
    $phone = '+92 XXX XXXXXXX'; // CHANGE THIS (with country code)
    $location = 'Remote / Pakistan'; // CHANGE THIS

    // ⬇️ FILL IN YOUR SOCIAL LINKS ⬇️
    $linkedin = 'https://linkedin.com/in/yourname'; // CHANGE THIS
    $github = 'https://github.com/yourusername'; // CHANGE THIS
    $twitter = 'https://twitter.com/yourusername'; // OPTIONAL - Leave empty if you don't have one

    // ⬇️ PORTFOLIO & RESUME ⬇️
    $portfolio_site = 'https://yourportfolio.com'; // OPTIONAL - Leave empty if you don't have one
    $resume_url = 'https://yourportfolio.com/resume.pdf'; // OPTIONAL - Leave empty if you don't have one

    // ⬆️ END OF EDITABLE SECTION ⬆️

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

    update_option('portfolio_settings_bulk_added', true);

    error_log('✓ Portfolio settings have been added with your personal information!');
}

add_action('init', function() {
    if (!get_option('portfolio_settings_bulk_added')) {
        bulk_add_portfolio_settings_on_activation();
    }
}, 999);

