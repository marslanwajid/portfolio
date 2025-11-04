<?php
/**
 * Bulk Add Portfolio Projects
 * This will add all your portfolio projects with categories and tech stacks
 * Activate ONCE, then deactivate (runs automatically)
 */

function bulk_add_portfolio_projects_on_activation() {
    // Check if already added
    if (get_option('portfolio_projects_bulk_added')) {
        return;
    }

    $projects = array(
        // Personal & Front-End Development
        array(
            'title' => 'Tuitility',
            'content' => 'Developed a full-featured React-based web platform offering 80+ tools and calculators across categories like Mathematics, Science, Finance, Knowledge, Health, and Utilities (e.g., converters, PDF tools, unit calculators).

• Built with React.js and Redux for optimal state management and performance.
• Implemented a modular and scalable code structure for easy feature expansion.
• Focused on responsive design, fast performance, and user accessibility.',
            'tech_stack' => 'React.js, Redux, JavaScript, HTML, CSS',
            'project_type' => 'Web Application',
            'category' => 'Personal & Front-End Development',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'AlmahdiStore.pk',
            'content' => 'A PHP Laravel-based eCommerce platform.

• Designed and developed the entire front-end of the main store, user dashboards, and API-integrated sections.
• Converted complex Figma designs into fully responsive, pixel-perfect web pages using HTML, CSS, JS, and Blade templates.
• Collaborated on backend API integration and dashboard logic for seamless user experience.
• Focused on performance optimization, responsive layouts, and cross-browser compatibility.',
            'tech_stack' => 'Laravel, PHP, HTML, CSS, JavaScript, Blade Templates, Figma',
            'project_type' => 'Web Application',
            'category' => 'Personal & Front-End Development',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        
        // WooCommerce / eCommerce Websites
        array(
            'title' => 'Elektroplaneta.cz',
            'content' => 'Created an electronics-focused WooCommerce site, with clean product display and responsive performance.',
            'tech_stack' => 'WordPress, WooCommerce, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'WooCommerce / eCommerce',
            'project_url' => 'https://elektroplaneta.cz',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Asijske Jidlo',
            'content' => 'Customized WooCommerce Food Shop site for Czech-based Asian food delivery service.',
            'tech_stack' => 'WordPress, WooCommerce, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'WooCommerce / eCommerce',
            'project_url' => 'https://asijskejidlo.cz',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'MobilPoint',
            'content' => 'Created an electronics-focused WooCommerce site, with clean product display and responsive performance.',
            'tech_stack' => 'WordPress, WooCommerce, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'WooCommerce / eCommerce',
            'project_url' => 'https://mobilpoint.cz',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Smartonix',
            'content' => 'Built and optimized a WooCommerce electronics shop with a focus on usability and conversions.',
            'tech_stack' => 'WordPress, WooCommerce, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'WooCommerce / eCommerce',
            'project_url' => 'https://smartonix.cz',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Easy Sell Buy Car',
            'content' => 'Contributed to feature development and speed optimization for a vehicle listing/sales platform with dynamic functionality.',
            'tech_stack' => 'WordPress, WooCommerce, PHP, CSS, JavaScript, Cloudflare CDN',
            'project_type' => 'Website',
            'category' => 'WooCommerce / eCommerce',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Comfy Casa',
            'content' => 'Built a WooCommerce furniture store with product filtering, optimized navigation, and an easy checkout flow.',
            'tech_stack' => 'WordPress, WooCommerce, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'WooCommerce / eCommerce',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Dene Furnishing',
            'content' => 'Designed a scalable home furnishings eCommerce site with clean UI and back-end customization.',
            'tech_stack' => 'WordPress, WooCommerce, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'WooCommerce / eCommerce',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Ali Baba Furniture',
            'content' => 'Developed an engaging WooCommerce furniture site with inventory control and streamlined order management.',
            'tech_stack' => 'WordPress, WooCommerce, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'WooCommerce / eCommerce',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Amritsar Sweets',
            'content' => 'Integrated WooCommerce for a sweets shop, enabling online orders and delivery, which led to a 15% increase in sales.',
            'tech_stack' => 'WordPress, WooCommerce, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'WooCommerce / eCommerce',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        
        // Portfolio / Business Showcase Websites
        array(
            'title' => 'Matharu Interiors',
            'content' => 'Designed a modern interior design portfolio with gallery and services section.',
            'tech_stack' => 'WordPress, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'Portfolio / Business Showcase',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Pearl Hair and Beauty Salon',
            'content' => 'Created a beauty salon site with appointment features and testimonials.',
            'tech_stack' => 'WordPress, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'Portfolio / Business Showcase',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'AK Decoration and Events',
            'content' => 'Built a vibrant portfolio for an event decor business, with custom galleries and contact forms.',
            'tech_stack' => 'WordPress, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'Portfolio / Business Showcase',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Ordinary Edits',
            'content' => 'Responsive photo editing portfolio, resulting in a 25% increase in client inquiries.',
            'tech_stack' => 'WordPress, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'Portfolio / Business Showcase',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Pixel Code Wizard',
            'content' => 'Hosted a range of demo client portfolios (real estate, design, local businesses) to showcase branding and layout versatility.',
            'tech_stack' => 'WordPress, PHP, CSS, JavaScript',
            'project_type' => 'Website',
            'category' => 'Portfolio / Business Showcase',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        
        // Functional Projects & Tools (Non-WordPress)
        array(
            'title' => 'Ecowheel+',
            'content' => 'Developed a full-stack dashboard for installment payment management, allowing the admin to create/manage users, record payment information, and send automated reminders.',
            'tech_stack' => 'HTML, SCSS, JavaScript, PHP, MySQL',
            'project_type' => 'Web Application',
            'category' => 'Functional Projects & Tools',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
        array(
            'title' => 'Cargo Management System',
            'content' => 'Developed a full-stack cargo operations dashboard with Super Admin/Admin access and workflow automation.',
            'tech_stack' => 'PHP, JavaScript, SQL, MySQL',
            'project_type' => 'Web Application',
            'category' => 'Functional Projects & Tools',
            'project_url' => '',
            'github_url' => '',
            'date_completed' => '',
        ),
    );

    foreach ($projects as $project) {
        // Check if project already exists
        $existing = get_page_by_title($project['title'], OBJECT, 'portfolio');
        
        if ($existing) {
            continue; // Skip if already exists
        }

        // Create portfolio post
        $post_data = array(
            'post_title'   => $project['title'],
            'post_content' => $project['content'],
            'post_status'  => 'publish',
            'post_type'    => 'portfolio',
        );

        $post_id = wp_insert_post($post_data);

        if ($post_id && !is_wp_error($post_id)) {
            // Add meta fields
            if (!empty($project['project_url'])) {
                update_post_meta($post_id, 'project_url', $project['project_url']);
            }
            
            if (!empty($project['github_url'])) {
                update_post_meta($post_id, 'github_url', $project['github_url']);
            }
            
            update_post_meta($post_id, 'tech_stack', $project['tech_stack']);
            update_post_meta($post_id, 'project_type', $project['project_type']);
            
            if (!empty($project['date_completed'])) {
                update_post_meta($post_id, 'date_completed', $project['date_completed']);
            }

            // Set category (project_category taxonomy)
            $category_term = get_term_by('name', $project['category'], 'project_category');
            
            if (!$category_term) {
                // Create category if it doesn't exist
                $term_result = wp_insert_term(
                    $project['category'],
                    'project_category',
                    array('description' => "Projects in {$project['category']} category")
                );
                
                if (!is_wp_error($term_result)) {
                    $category_id = $term_result['term_id'];
                } else {
                    $category_id = null;
                }
            } else {
                $category_id = $category_term->term_id;
            }

            if ($category_id) {
                wp_set_object_terms($post_id, array($category_id), 'project_category');
            }

            error_log("✓ Added portfolio project: {$project['title']}");
        } else {
            error_log("✗ Failed to add portfolio project: {$project['title']}");
        }
    }

    update_option('portfolio_projects_bulk_added', true);
}

// Run on init (only once)
add_action('init', function() {
    if (!get_option('portfolio_projects_bulk_added')) {
        bulk_add_portfolio_projects_on_activation();
    }
}, 999);

