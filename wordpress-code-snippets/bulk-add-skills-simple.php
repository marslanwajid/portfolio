<?php
/**
 * SIMPLE VERSION - One-Time Skill Import
 * Add this snippet, activate it ONCE, then deactivate it
 * Skills will be added automatically on activation
 */

function bulk_add_skills_on_activation() {
    // Check if already added
    if (get_option('portfolio_skills_bulk_added')) {
        return;
    }

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
            'Payment Gateways' => 'Intermediate',
            'Cross-Functional Collaboration' => 'Advanced',
            'Agile Workflow' => 'Advanced',
        ),
    );

    foreach ($skills_data as $category_name => $skills) {
        // Get or create category
        $category_term = get_term_by('name', $category_name, 'skill_category');
        
        if (!$category_term) {
            $term_result = wp_insert_term(
                $category_name,
                'skill_category',
                array('description' => "Skills related to {$category_name}")
            );
            $category_id = is_wp_error($term_result) ? null : $term_result['term_id'];
        } else {
            $category_id = $category_term->term_id;
        }

        if (!$category_id) continue;

        // Add skills
        foreach ($skills as $skill_name => $proficiency) {
            $existing = get_page_by_title($skill_name, OBJECT, 'skill');
            
            if (!$existing) {
                $skill_id = wp_insert_post(array(
                    'post_title'   => $skill_name,
                    'post_content'  => "Proficiency: {$proficiency}",
                    'post_status'   => 'publish',
                    'post_type'     => 'skill',
                ));

                if ($skill_id && !is_wp_error($skill_id)) {
                    update_post_meta($skill_id, 'proficiency_level', $proficiency);
                    wp_set_object_terms($skill_id, array($category_id), 'skill_category');
                }
            }
        }
    }

    update_option('portfolio_skills_bulk_added', true);
}

// Run on init (only once)
add_action('init', function() {
    if (!get_option('portfolio_skills_bulk_added')) {
        bulk_add_skills_on_activation();
    }
}, 999);

