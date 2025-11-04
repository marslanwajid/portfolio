<?php
/**
 * Bulk Add Skills to Portfolio
 * This will add all your skills with their categories
 * Add this to WPCode → Add Snippet → PHP Snippet
 * Run it ONCE, then you can deactivate it
 */

function bulk_add_portfolio_skills() {
    // Only run if we haven't added skills yet (check for a flag)
    if (get_option('portfolio_skills_added')) {
        return; // Skills already added
    }

    // Define skill categories and their skills
    $skills_data = array(
        'Web Technologies' => array(
            'JavaScript' => 'Advanced',
            'HTML5' => 'Advanced',
            'CSS3' => 'Advanced',
            'AJAX' => 'Advanced',
            'JSP' => 'Intermediate',
            'Bootstrap' => 'Advanced',
            'WordPress' => 'Advanced',
        ),
        'SEO' => array(
            'On & Off-Page SEO' => 'Advanced',
            'Google Search Console' => 'Advanced',
            'Semrush' => 'Intermediate',
            'Ahrefs' => 'Intermediate',
            'Moz' => 'Intermediate',
        ),
        'Frameworks/Libraries' => array(
            'React JS' => 'Advanced',
            'Redux' => 'Advanced',
            'Express JS' => 'Advanced',
            'jQuery' => 'Advanced',
            'Next JS' => 'Advanced',
        ),
        'WordPress Development' => array(
            'Custom Themes & Plugins' => 'Advanced',
            'Advanced Custom Fields (ACF)' => 'Advanced',
            'WP-CLI' => 'Intermediate',
            'Custom Post Types (CPT)' => 'Advanced',
            'Custom Taxonomies' => 'Advanced',
            'Gutenberg Blocks' => 'Intermediate',
            'WordPress Hooks & Filters' => 'Advanced',
            'REST API Integration' => 'Advanced',
            'WordPress AJAX API' => 'Advanced',
            'Performance Optimization' => 'Advanced',
            'Core Web Vitals' => 'Advanced',
        ),
        'Design & Optimization' => array(
            'Figma to WordPress Conversion' => 'Advanced',
            'Responsive UI Design' => 'Advanced',
        ),
        'Debugging & Tools' => array(
            'Firebug' => 'Intermediate',
            'Chrome Developer Tools' => 'Advanced',
            'Browser Console' => 'Advanced',
        ),
        'IDE/Tools' => array(
            'Git' => 'Advanced',
            'GitHub' => 'Advanced',
            'Microsoft Office' => 'Advanced',
            'Electron JS' => 'Intermediate',
        ),
        'Languages' => array(
            'English' => 'Advanced',
            'Urdu' => 'Advanced',
        ),
        'Other Skills' => array(
            'WordPress AJAX API' => 'Advanced',
            'Payment Gateways' => 'Intermediate',
            'Cross-Functional Collaboration' => 'Advanced',
            'Agile Workflow' => 'Advanced',
        ),
    );

    // Create categories and add skills
    foreach ($skills_data as $category_name => $skills) {
        // Get or create category term
        $category_term = get_term_by('name', $category_name, 'skill_category');
        
        if (!$category_term) {
            // Create the category
            $term_result = wp_insert_term(
                $category_name,
                'skill_category',
                array(
                    'description' => "Skills related to {$category_name}",
                )
            );

            if (!is_wp_error($term_result)) {
                $category_id = $term_result['term_id'];
            } else {
                error_log('Error creating category: ' . $term_result->get_error_message());
                continue; // Skip this category if creation failed
            }
        } else {
            $category_id = $category_term->term_id;
        }

        // Add each skill in this category
        foreach ($skills as $skill_name => $proficiency) {
            // Check if skill already exists
            $existing_skill = get_page_by_title($skill_name, OBJECT, 'skill');
            
            if (!$existing_skill) {
                // Create the skill post
                $skill_post = array(
                    'post_title'    => $skill_name,
                    'post_content'  => "Proficiency level: {$proficiency}",
                    'post_status'   => 'publish',
                    'post_type'     => 'skill',
                );

                $skill_id = wp_insert_post($skill_post);

                if ($skill_id && !is_wp_error($skill_id)) {
                    // Set proficiency level
                    update_post_meta($skill_id, 'proficiency_level', $proficiency);

                    // Assign to category
                    wp_set_object_terms($skill_id, array($category_id), 'skill_category');

                    error_log("✓ Added skill: {$skill_name} ({$proficiency}) to category: {$category_name}");
                } else {
                    error_log("✗ Failed to add skill: {$skill_name}");
                }
            } else {
                // Skill exists, just update category if needed
                $existing_categories = wp_get_object_terms($existing_skill->ID, 'skill_category', array('fields' => 'ids'));
                if (!in_array($category_id, $existing_categories)) {
                    wp_set_object_terms($existing_skill->ID, array($category_id), 'skill_category', true);
                }
            }
        }
    }

    // Mark as completed
    update_option('portfolio_skills_added', true);
    
    // Return success message
    return array(
        'success' => true,
        'message' => 'All skills have been added successfully!',
    );
}

// Hook to run on admin_init (only in admin)
add_action('admin_init', function() {
    // Only run if triggered manually or via admin notice
    if (isset($_GET['bulk_add_skills']) && current_user_can('manage_options')) {
        bulk_add_portfolio_skills();
        wp_redirect(admin_url('edit.php?post_type=skill&skills_added=1'));
        exit;
    }
});

// Add admin notice with button to trigger bulk add
add_action('admin_notices', function() {
    if (get_current_screen()->post_type === 'skill' || get_current_screen()->id === 'skill') {
        if (isset($_GET['skills_added'])) {
            echo '<div class="notice notice-success is-dismissible"><p><strong>Success!</strong> All skills have been added to your portfolio.</p></div>';
        } elseif (!get_option('portfolio_skills_added')) {
            echo '<div class="notice notice-info is-dismissible">';
            echo '<p><strong>Bulk Add Skills:</strong> Click the button below to automatically add all your skills organized by category.</p>';
            echo '<p><a href="' . admin_url('edit.php?post_type=skill&bulk_add_skills=1') . '" class="button button-primary">Add All Skills</a></p>';
            echo '</div>';
        }
    }
});

// Alternative: Run automatically on activation (uncomment if you want this)
// Uncomment the line below if you want skills to be added automatically when snippet is activated
// add_action('init', 'bulk_add_portfolio_skills', 999);

