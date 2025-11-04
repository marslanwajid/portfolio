<?php
/**
 * Bulk Add Work Experience
 * This will add all your work experience entries
 * Activate ONCE, then deactivate (runs automatically)
 */

function bulk_add_experience_on_activation() {
    // Check if already added
    if (get_option('portfolio_experience_bulk_added')) {
        return;
    }

    $experiences = array(
        array(
            'company' => 'Digital Optimisers',
            'job_title' => 'Full Stack Developer',
            'start_date' => '2025-05-01',
            'end_date' => '', // Present
            'is_current' => true,
            'description' => 'Joined digitaloptimisers.com.au as a Full Stack Web Developer, contributing to both front-end and back-end development for eCommerce and marketing-focused websites

• Developed custom WordPress themes and plugins, resulting in a 15% increase in client satisfaction by addressing specific business needs.

• Led the development of custom WordPress themes and WooCommerce solutions tailored to unique client needs, resulting in improved customer satisfaction and repeat business.

• Worked closely with designers, marketers, and project managers to deliver fully responsive, SEO-optimized websites within tight deadlines.',
            'technologies' => 'WordPress, WooCommerce, PHP, JavaScript, HTML, CSS, SEO',
        ),
        array(
            'company' => 'Tauronic (Czech Republic)',
            'job_title' => 'Project-Based WooCommerce/Full Stack Developer',
            'start_date' => '2025-02-01',
            'end_date' => '',
            'is_current' => true,
            'description' => 'Successfully rebuilt and optimized multiple high-volume e-commerce WooCommerce sites including smartonix.cz, mobilpoint.cz and czmobily.cz to improve stability and performance.

• Developed new custom e-commerce platforms like elektroplaneta.cz and asijskejidlo.cz (food shop) from the ground up, integrating online ordering and delivery functionality.

• Engineered a proprietary custom WordPress Plugin (rtx Central Import) using REST APIs and WordPress AJAX for automated product and order synchronization.

• Created a Product Scraper using Python to extract and export product data (from WooCommerce, Shopify, etc.) into Excel for competitive analysis and inventory sourcing.',
            'technologies' => 'WooCommerce, WordPress, REST API, WordPress AJAX, Python, Shopify, Excel',
        ),
        array(
            'company' => 'Systems Dash Ltd',
            'job_title' => 'Junior Full Stack Developer',
            'start_date' => '2024-08-01',
            'end_date' => '2025-05-31',
            'is_current' => false,
            'description' => 'Enhanced front-end user experiences by implementing responsive designs using React, JavaScript, and CSS, improving user engagement by 20%.

• Integrated third-party APIs and payment gateways, streamlining business operations and improving conversion rates by 18%.

• Collaborated with cross-functional teams to deliver high-quality web solutions, consistently meeting 100% of project deadlines.',
            'technologies' => 'React, JavaScript, CSS, REST API, Payment Gateways',
        ),
        array(
            'company' => 'Easy Sell Buy Car (Qatar)',
            'job_title' => 'Web Development Intern',
            'start_date' => '2024-08-01',
            'end_date' => '2024-09-30',
            'is_current' => false,
            'description' => 'Improved the design and performance of a Qatar-based online car listing platform.

• Conducted theme analysis and presentation to recommend the best WordPress solutions for the client\'s automotive marketplace.

• Configured Cloudflare CDN, enhancing website speed, reliability, and security.

• Collaborated remotely with the management team to align UI/UX decisions with business objectives.

• Demonstrated initiative, strong communication, and problem-solving skills in a remote professional environment.',
            'technologies' => 'WordPress, Cloudflare CDN, UI/UX',
        ),
        array(
            'company' => 'Systems Dash Ltd',
            'job_title' => 'Intern WordPress Developer',
            'start_date' => '2024-06-01',
            'end_date' => '2024-08-31',
            'is_current' => false,
            'description' => 'Developed and maintained websites using Elementor, WP Bakery, and Divi, increasing site performance by 30%.

• Implemented custom plugins to enhance website functionality, contributing to a 25% rise in client retention.',
            'technologies' => 'WordPress, Elementor, WP Bakery, Divi, PHP',
        ),
        array(
            'company' => 'Elpha Tech',
            'job_title' => 'WordPress Blog Developer',
            'start_date' => '2024-01-01',
            'end_date' => '2024-06-30',
            'is_current' => false,
            'description' => 'Built and managed a full-featured blog website using Elementor, leading to a 40% increase in daily traffic.',
            'technologies' => 'WordPress, Elementor',
        ),
        array(
            'company' => 'Digital Bolt',
            'job_title' => 'Intern Front-End Developer',
            'start_date' => '2023-07-01',
            'end_date' => '2023-12-31',
            'is_current' => false,
            'description' => 'Developed dynamic user interfaces and web applications using React.js, SASS, and Bootstrap, resulting in a 35% improvement in user experience.

• Applied modern web development frameworks and tools, which improved application performance by 25%.',
            'technologies' => 'React.js, SASS, Bootstrap, JavaScript',
        ),
        array(
            'company' => 'Ibrahim Fibers Limited',
            'job_title' => 'Intern',
            'start_date' => '2023-05-01',
            'end_date' => '2023-06-30',
            'is_current' => false,
            'description' => 'Assisted in network management and software maintenance, reducing system downtime by 10%.

• Contributed to marketing strategies and promotional campaigns, boosting campaign reach by 15%.',
            'technologies' => 'Network Management, Software Maintenance, Marketing',
        ),
    );

    foreach ($experiences as $exp) {
        // Check if experience already exists (by company and title)
        $existing = get_posts(array(
            'post_type' => 'experience',
            'post_status' => 'any',
            'meta_query' => array(
                'relation' => 'AND',
                array(
                    'key' => 'company',
                    'value' => $exp['company'],
                    'compare' => '='
                ),
                array(
                    'key' => 'job_title',
                    'value' => $exp['job_title'],
                    'compare' => '='
                )
            ),
            'posts_per_page' => 1
        ));

        if (!empty($existing)) {
            continue; // Skip if already exists
        }

        // Create experience post
        $post_data = array(
            'post_title'   => $exp['company'] . ' - ' . $exp['job_title'],
            'post_content' => $exp['description'],
            'post_status'  => 'publish',
            'post_type'    => 'experience',
        );

        $post_id = wp_insert_post($post_data);

        if ($post_id && !is_wp_error($post_id)) {
            // Add meta fields
            update_post_meta($post_id, 'company', $exp['company']);
            update_post_meta($post_id, 'job_title', $exp['job_title']);
            update_post_meta($post_id, 'start_date', $exp['start_date']);
            
            if ($exp['is_current']) {
                update_post_meta($post_id, 'is_current', 'yes');
                update_post_meta($post_id, 'end_date', '');
            } else {
                update_post_meta($post_id, 'is_current', 'no');
                update_post_meta($post_id, 'end_date', $exp['end_date']);
            }
            
            update_post_meta($post_id, 'technologies_used', $exp['technologies']);

            error_log("✓ Added experience: {$exp['company']} - {$exp['job_title']}");
        } else {
            error_log("✗ Failed to add experience: {$exp['company']}");
        }
    }

    update_option('portfolio_experience_bulk_added', true);
}

// Run on init (only once)
add_action('init', function() {
    if (!get_option('portfolio_experience_bulk_added')) {
        bulk_add_experience_on_activation();
    }
}, 999);

