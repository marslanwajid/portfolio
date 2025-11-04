<?php
/**
 * Professional Portfolio CPT with Enhanced Fields
 * Add this to WPCode → Add Snippet → PHP Snippet
 */

// 1. Enhanced Portfolio Custom Post Type
function create_portfolio_cpt() {
    $labels = array(
        'name'               => _x('Portfolio Projects', 'post type general name'),
        'singular_name'      => _x('Portfolio Project', 'post type singular name'),
        'menu_name'          => 'Portfolio',
        'name_admin_bar'     => 'Portfolio Project',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Project',
        'edit_item'          => 'Edit Project',
        'new_item'           => 'New Project',
        'view_item'          => 'View Project',
        'all_items'          => 'All Projects',
        'search_items'       => 'Search Projects',
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'has_archive'        => true,
        'show_in_rest'       => true, // Important for REST API
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-portfolio',
        'supports'           => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'rewrite'            => array('slug' => 'portfolio'),
        'taxonomies'         => array('project_category'), // Custom taxonomy
    );

    register_post_type('portfolio', $args);
}
add_action('init', 'create_portfolio_cpt');

// 2. Project Category Taxonomy
function create_project_category_taxonomy() {
    $labels = array(
        'name'              => 'Project Categories',
        'singular_name'     => 'Project Category',
        'search_items'      => 'Search Categories',
        'all_items'         => 'All Categories',
        'edit_item'         => 'Edit Category',
        'update_item'       => 'Update Category',
        'add_new_item'      => 'Add New Category',
        'new_item_name'     => 'New Category Name',
        'menu_name'         => 'Categories',
    );

    $args = array(
        'hierarchical'      => true,
        'labels'            => $labels,
        'show_ui'           => true,
        'show_in_rest'      => true, // Important for REST API
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array('slug' => 'project-category'),
    );

    register_taxonomy('project_category', array('portfolio'), $args);
}
add_action('init', 'create_project_category_taxonomy');

// 3. Add Custom Fields to REST API
function add_portfolio_fields_to_rest_api() {
    // Project URL
    register_rest_field('portfolio', 'project_url', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'project_url', true);
        },
        'schema' => array(
            'description' => 'Live project URL',
            'type'        => 'string',
        ),
    ));

    // GitHub URL
    register_rest_field('portfolio', 'github_url', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'github_url', true);
        },
        'schema' => array(
            'description' => 'GitHub repository URL',
            'type'        => 'string',
        ),
    ));

    // Tech Stack (stored as comma-separated string, converted to array)
    register_rest_field('portfolio', 'tech_stack', array(
        'get_callback' => function($post_arr) {
            $tech_stack = get_post_meta($post_arr['id'], 'tech_stack', true);
            if (is_string($tech_stack)) {
                return array_filter(array_map('trim', explode(',', $tech_stack)));
            }
            return is_array($tech_stack) ? $tech_stack : [];
        },
        'schema' => array(
            'description' => 'Technologies used in project',
            'type'        => 'array',
        ),
    ));

    // Project Type
    register_rest_field('portfolio', 'project_type', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'project_type', true);
        },
        'schema' => array(
            'description' => 'Type of project (Web App, Mobile App, etc.)',
            'type'        => 'string',
        ),
    ));

    // Date Completed
    register_rest_field('portfolio', 'date_completed', array(
        'get_callback' => function($post_arr) {
            return get_post_meta($post_arr['id'], 'date_completed', true);
        },
        'schema' => array(
            'description' => 'Project completion date',
            'type'        => 'string',
        ),
    ));

    // Featured Image URL
    register_rest_field('portfolio', 'featured_image_url', array(
        'get_callback' => function($post_arr) {
            $id = get_post_thumbnail_id($post_arr['id']);
            if ($id) {
                $img = wp_get_attachment_image_src($id, 'full');
                return $img ? $img[0] : '';
            }
            return '';
        },
        'schema' => array(
            'description' => 'Featured image URL',
            'type' => 'string',
        ),
    ));

    // Project Categories (taxonomy)
    register_rest_field('portfolio', 'project_categories', array(
        'get_callback' => function($post_arr) {
            $terms = get_the_terms($post_arr['id'], 'project_category');
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
            'description' => 'Project categories',
            'type' => 'array',
        ),
    ));

    // Show on Frontend (checkbox)
    register_rest_field('portfolio', 'show_on_frontend', array(
        'get_callback' => function($post_arr) {
            $value = get_post_meta($post_arr['id'], 'show_on_frontend', true);
            // Debug: Log the raw value
            error_log('Portfolio ID ' . $post_arr['id'] . ' show_on_frontend raw value: ' . var_export($value, true));
            
            // Return true if value is '1', 'yes', true, or 1
            // Return false if value is '0', 'no', false, 0, or empty
            if ($value === '1' || $value === 'yes' || $value === true || $value === 1) {
                return true;
            }
            // If value is empty or not set, default to false
            return false;
        },
        'schema' => array(
            'description' => 'Whether to show this project on the frontend',
            'type' => 'boolean',
        ),
    ));
}
add_action('rest_api_init', 'add_portfolio_fields_to_rest_api');

// 4. Add Meta Boxes for Custom Fields (UI in WordPress admin)
function add_portfolio_meta_boxes() {
    add_meta_box(
        'portfolio_details',
        'Project Details',
        'portfolio_meta_box_callback',
        'portfolio',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'add_portfolio_meta_boxes');

function portfolio_meta_box_callback($post) {
    wp_nonce_field('portfolio_meta_box', 'portfolio_meta_box_nonce');
    
    $project_url = get_post_meta($post->ID, 'project_url', true);
    $github_url = get_post_meta($post->ID, 'github_url', true);
    $tech_stack = get_post_meta($post->ID, 'tech_stack', true);
    $project_type = get_post_meta($post->ID, 'project_type', true);
    $date_completed = get_post_meta($post->ID, 'date_completed', true);
    $show_on_frontend = get_post_meta($post->ID, 'show_on_frontend', true);
    ?>
    <table class="form-table">
        <tr>
            <th><label for="project_url">Live Project URL</label></th>
            <td><input type="url" id="project_url" name="project_url" value="<?php echo esc_attr($project_url); ?>" class="regular-text" placeholder="https://example.com" /></td>
        </tr>
        <tr>
            <th><label for="github_url">GitHub URL</label></th>
            <td><input type="url" id="github_url" name="github_url" value="<?php echo esc_attr($github_url); ?>" class="regular-text" placeholder="https://github.com/username/repo" /></td>
        </tr>
        <tr>
            <th><label for="tech_stack">Tech Stack</label></th>
            <td><input type="text" id="tech_stack" name="tech_stack" value="<?php echo esc_attr($tech_stack); ?>" class="regular-text" placeholder="React, Node.js, MongoDB (comma-separated)" /></td>
            <td><small>Enter technologies separated by commas</small></td>
        </tr>
        <tr>
            <th><label for="project_type">Project Type</label></th>
            <td>
                <select id="project_type" name="project_type">
                    <option value="">Select Type</option>
                    <option value="Web Application" <?php selected($project_type, 'Web Application'); ?>>Web Application</option>
                    <option value="Mobile App" <?php selected($project_type, 'Mobile App'); ?>>Mobile App</option>
                    <option value="Website" <?php selected($project_type, 'Website'); ?>>Website</option>
                    <option value="API" <?php selected($project_type, 'API'); ?>>API</option>
                    <option value="Other" <?php selected($project_type, 'Other'); ?>>Other</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="date_completed">Date Completed</label></th>
            <td><input type="date" id="date_completed" name="date_completed" value="<?php echo esc_attr($date_completed); ?>" /></td>
        </tr>
        <tr>
            <th><label for="show_on_frontend">Display Settings</label></th>
            <td>
                <label>
                    <input type="checkbox" id="show_on_frontend" name="show_on_frontend" value="1" <?php checked($show_on_frontend, '1', true); ?> />
                    Show on Frontend
                </label>
                <p class="description">Check this box to display this project on the React frontend website.</p>
                <p class="description"><strong>Current value:</strong> <?php echo esc_html($show_on_frontend ? '1 (checked)' : '0 (unchecked)'); ?></p>
            </td>
        </tr>
    </table>
    <?php
}

function save_portfolio_meta_box($post_id) {
    if (!isset($_POST['portfolio_meta_box_nonce']) || !wp_verify_nonce($_POST['portfolio_meta_box_nonce'], 'portfolio_meta_box')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Check permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (isset($_POST['project_url'])) {
        update_post_meta($post_id, 'project_url', sanitize_text_field($_POST['project_url']));
    }

    if (isset($_POST['github_url'])) {
        update_post_meta($post_id, 'github_url', sanitize_text_field($_POST['github_url']));
    }

    if (isset($_POST['tech_stack'])) {
        update_post_meta($post_id, 'tech_stack', sanitize_text_field($_POST['tech_stack']));
    }

    if (isset($_POST['project_type'])) {
        update_post_meta($post_id, 'project_type', sanitize_text_field($_POST['project_type']));
    }

    if (isset($_POST['date_completed'])) {
        update_post_meta($post_id, 'date_completed', sanitize_text_field($_POST['date_completed']));
    }

    // Save show_on_frontend checkbox
    // Checkboxes only send value when checked, so we need to check if it exists in POST
    if (isset($_POST['show_on_frontend']) && $_POST['show_on_frontend'] === '1') {
        update_post_meta($post_id, 'show_on_frontend', '1');
        error_log('Saved show_on_frontend = 1 for portfolio ID: ' . $post_id);
    } else {
        // Explicitly set to '0' if checkbox is not checked
        update_post_meta($post_id, 'show_on_frontend', '0');
        error_log('Saved show_on_frontend = 0 for portfolio ID: ' . $post_id);
    }
}
add_action('save_post', 'save_portfolio_meta_box');


