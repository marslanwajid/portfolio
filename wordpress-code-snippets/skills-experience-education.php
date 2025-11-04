<?php
/**
 * Skills, Experience, and Education Custom Post Types
 * Add this to WPCode → Add Snippet → PHP Snippet
 */

// ============================================
// 1. SKILLS Custom Post Type
// ============================================
function create_skills_cpt() {
    $labels = array(
        'name'               => 'Skills',
        'singular_name'      => 'Skill',
        'menu_name'          => 'Skills',
        'add_new_item'       => 'Add New Skill',
        'edit_item'          => 'Edit Skill',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'has_archive'        => true,
        'show_in_rest'       => true,
        'menu_position'      => 6,
        'menu_icon'          => 'dashicons-star-filled',
        'supports'           => array('title', 'editor'),
        'rewrite'            => array('slug' => 'skills'),
    );

    register_post_type('skill', $args);
}
add_action('init', 'create_skills_cpt');

// Skills Taxonomy (Frontend, Backend, Tools, etc.)
function create_skill_category_taxonomy() {
    $labels = array(
        'name'              => 'Skill Categories',
        'singular_name'     => 'Skill Category',
        'menu_name'         => 'Categories',
    );

    $args = array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'skill-category'),
    );

    register_taxonomy('skill_category', array('skill'), $args);
}
add_action('init', 'create_skill_category_taxonomy');

// Add Skills fields to REST API
function add_skills_fields_to_rest_api() {
    // Proficiency Level
    register_rest_field('skill', 'proficiency_level', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'proficiency_level', true);
        },
        'schema' => array(
            'description' => 'Proficiency level (Beginner/Intermediate/Advanced)',
            'type'        => 'string',
        ),
    ));

    // Skill Icon/Logo URL
    register_rest_field('skill', 'skill_icon', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'skill_icon', true);
        },
        'schema' => array(
            'description' => 'Skill icon URL',
            'type'        => 'string',
        ),
    ));

    // Skill Categories
    register_rest_field('skill', 'skill_categories', array(
        'get_callback' => function($post_arr) {
            $terms = get_the_terms($post_arr['id'], 'skill_category');
            if (is_array($terms)) {
                return array_map(function($term) {
                    return array(
                        'id' => $term->term_id,
                        'name' => $term->name,
                        'slug' => $term->slug,
                    );
                }, $terms);
            }
            return [];
        },
        'schema' => array(
            'description' => 'Skill categories',
            'type' => 'array',
        ),
    ));
}
add_action('rest_api_init', 'add_skills_fields_to_rest_api');

// Skills Meta Box
function add_skill_meta_boxes() {
    add_meta_box('skill_details', 'Skill Details', 'skill_meta_box_callback', 'skill', 'normal', 'high');
}
add_action('add_meta_boxes', 'add_skill_meta_boxes');

function skill_meta_box_callback($post) {
    wp_nonce_field('skill_meta_box', 'skill_meta_box_nonce');
    $proficiency = get_post_meta($post->ID, 'proficiency_level', true);
    $icon = get_post_meta($post->ID, 'skill_icon', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="proficiency_level">Proficiency Level</label></th>
            <td>
                <select id="proficiency_level" name="proficiency_level">
                    <option value="">Select Level</option>
                    <option value="Beginner" <?php selected($proficiency, 'Beginner'); ?>>Beginner</option>
                    <option value="Intermediate" <?php selected($proficiency, 'Intermediate'); ?>>Intermediate</option>
                    <option value="Advanced" <?php selected($proficiency, 'Advanced'); ?>>Advanced</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="skill_icon">Icon URL</label></th>
            <td><input type="url" id="skill_icon" name="skill_icon" value="<?php echo esc_attr($icon); ?>" class="regular-text" placeholder="https://example.com/icon.png" /></td>
        </tr>
    </table>
    <?php
}

function save_skill_meta_box($post_id) {
    if (!isset($_POST['skill_meta_box_nonce']) || !wp_verify_nonce($_POST['skill_meta_box_nonce'], 'skill_meta_box')) {
        return;
    }
    if (isset($_POST['proficiency_level'])) {
        update_post_meta($post_id, 'proficiency_level', sanitize_text_field($_POST['proficiency_level']));
    }
    if (isset($_POST['skill_icon'])) {
        update_post_meta($post_id, 'skill_icon', sanitize_url($_POST['skill_icon']));
    }
}
add_action('save_post', 'save_skill_meta_box');

// ============================================
// 2. EXPERIENCE Custom Post Type
// ============================================
function create_experience_cpt() {
    $labels = array(
        'name'               => 'Work Experience',
        'singular_name'      => 'Experience',
        'menu_name'          => 'Experience',
        'add_new_item'       => 'Add New Experience',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'has_archive'        => true,
        'show_in_rest'       => true,
        'menu_position'      => 7,
        'menu_icon'          => 'dashicons-businessman',
        'supports'           => array('title', 'editor'),
        'rewrite'            => array('slug' => 'experience'),
    );

    register_post_type('experience', $args);
}
add_action('init', 'create_experience_cpt');

// Experience fields to REST API
function add_experience_fields_to_rest_api() {
    register_rest_field('experience', 'company', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'company', true);
        },
    ));

    register_rest_field('experience', 'job_title', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'job_title', true);
        },
    ));

    register_rest_field('experience', 'start_date', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'start_date', true);
        },
    ));

    register_rest_field('experience', 'end_date', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'end_date', true);
        },
    ));

    register_rest_field('experience', 'is_current', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'is_current', true) === 'yes';
        },
    ));

    register_rest_field('experience', 'technologies_used', array(
        'get_callback' => function($post_arr) {
            $tech = get_post_meta($post_arr['id'], 'technologies_used', true);
            if (is_string($tech)) {
                return array_filter(array_map('trim', explode(',', $tech)));
            }
            return is_array($tech) ? $tech : [];
        },
    ));
}
add_action('rest_api_init', 'add_experience_fields_to_rest_api');

// Experience Meta Box
function add_experience_meta_boxes() {
    add_meta_box('experience_details', 'Experience Details', 'experience_meta_box_callback', 'experience', 'normal', 'high');
}
add_action('add_meta_boxes', 'add_experience_meta_boxes');

function experience_meta_box_callback($post) {
    wp_nonce_field('experience_meta_box', 'experience_meta_box_nonce');
    $company = get_post_meta($post->ID, 'company', true);
    $job_title = get_post_meta($post->ID, 'job_title', true);
    $start_date = get_post_meta($post->ID, 'start_date', true);
    $end_date = get_post_meta($post->ID, 'end_date', true);
    $is_current = get_post_meta($post->ID, 'is_current', true) === 'yes';
    $tech = get_post_meta($post->ID, 'technologies_used', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="company">Company</label></th>
            <td><input type="text" id="company" name="company" value="<?php echo esc_attr($company); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="job_title">Job Title</label></th>
            <td><input type="text" id="job_title" name="job_title" value="<?php echo esc_attr($job_title); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="start_date">Start Date</label></th>
            <td><input type="date" id="start_date" name="start_date" value="<?php echo esc_attr($start_date); ?>" /></td>
        </tr>
        <tr>
            <th><label for="is_current">Current Position</label></th>
            <td><input type="checkbox" id="is_current" name="is_current" value="yes" <?php checked($is_current, true); ?> /></td>
        </tr>
        <tr>
            <th><label for="end_date">End Date</label></th>
            <td><input type="date" id="end_date" name="end_date" value="<?php echo esc_attr($end_date); ?>" <?php echo $is_current ? 'disabled' : ''; ?> /></td>
        </tr>
        <tr>
            <th><label for="technologies_used">Technologies Used</label></th>
            <td><input type="text" id="technologies_used" name="technologies_used" value="<?php echo esc_attr($tech); ?>" class="regular-text" placeholder="React, Node.js, MongoDB (comma-separated)" /></td>
        </tr>
    </table>
    <script>
    document.getElementById('is_current').addEventListener('change', function() {
        document.getElementById('end_date').disabled = this.checked;
        if (this.checked) {
            document.getElementById('end_date').value = '';
        }
    });
    </script>
    <?php
}

function save_experience_meta_box($post_id) {
    if (!isset($_POST['experience_meta_box_nonce']) || !wp_verify_nonce($_POST['experience_meta_box_nonce'], 'experience_meta_box')) {
        return;
    }
    if (isset($_POST['company'])) {
        update_post_meta($post_id, 'company', sanitize_text_field($_POST['company']));
    }
    if (isset($_POST['job_title'])) {
        update_post_meta($post_id, 'job_title', sanitize_text_field($_POST['job_title']));
    }
    if (isset($_POST['start_date'])) {
        update_post_meta($post_id, 'start_date', sanitize_text_field($_POST['start_date']));
    }
    if (isset($_POST['end_date'])) {
        update_post_meta($post_id, 'end_date', sanitize_text_field($_POST['end_date']));
    }
    if (isset($_POST['is_current'])) {
        update_post_meta($post_id, 'is_current', 'yes');
    } else {
        update_post_meta($post_id, 'is_current', 'no');
    }
    if (isset($_POST['technologies_used'])) {
        update_post_meta($post_id, 'technologies_used', sanitize_text_field($_POST['technologies_used']));
    }
}
add_action('save_post', 'save_experience_meta_box');

// ============================================
// 3. EDUCATION Custom Post Type
// ============================================
function create_education_cpt() {
    $labels = array(
        'name'               => 'Education',
        'singular_name'      => 'Education',
        'menu_name'          => 'Education',
        'add_new_item'       => 'Add New Education',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'has_archive'        => true,
        'show_in_rest'       => true,
        'menu_position'      => 8,
        'menu_icon'          => 'dashicons-welcome-learn-more',
        'supports'           => array('title', 'editor'),
        'rewrite'            => array('slug' => 'education'),
    );

    register_post_type('education', $args);
}
add_action('init', 'create_education_cpt');

// Education fields to REST API
function add_education_fields_to_rest_api() {
    register_rest_field('education', 'institution', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'institution', true);
        },
    ));

    register_rest_field('education', 'degree', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'degree', true);
        },
    ));

    register_rest_field('education', 'year', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'year', true);
        },
    ));
}
add_action('rest_api_init', 'add_education_fields_to_rest_api');

// Education Meta Box
function add_education_meta_boxes() {
    add_meta_box('education_details', 'Education Details', 'education_meta_box_callback', 'education', 'normal', 'high');
}
add_action('add_meta_boxes', 'add_education_meta_boxes');

function education_meta_box_callback($post) {
    wp_nonce_field('education_meta_box', 'education_meta_box_nonce');
    $institution = get_post_meta($post->ID, 'institution', true);
    $degree = get_post_meta($post->ID, 'degree', true);
    $year = get_post_meta($post->ID, 'year', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="institution">Institution</label></th>
            <td><input type="text" id="institution" name="institution" value="<?php echo esc_attr($institution); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="degree">Degree</label></th>
            <td><input type="text" id="degree" name="degree" value="<?php echo esc_attr($degree); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="year">Year</label></th>
            <td><input type="text" id="year" name="year" value="<?php echo esc_attr($year); ?>" class="regular-text" placeholder="2020-2024" /></td>
        </tr>
    </table>
    <?php
}

function save_education_meta_box($post_id) {
    if (!isset($_POST['education_meta_box_nonce']) || !wp_verify_nonce($_POST['education_meta_box_nonce'], 'education_meta_box')) {
        return;
    }
    if (isset($_POST['institution'])) {
        update_post_meta($post_id, 'institution', sanitize_text_field($_POST['institution']));
    }
    if (isset($_POST['degree'])) {
        update_post_meta($post_id, 'degree', sanitize_text_field($_POST['degree']));
    }
    if (isset($_POST['year'])) {
        update_post_meta($post_id, 'year', sanitize_text_field($_POST['year']));
    }
}
add_action('save_post', 'save_education_meta_box');


