<?php
/**
 * Enable Contact Form 7 REST API Access
 * This allows public access to CF7 forms via REST API
 * Add this to WPCode → Add Snippet → PHP Snippet
 */

// Allow public access to CF7 REST API endpoints
add_filter('wpcf7_rest_api_access', '__return_true');

// Add CORS headers for REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
        return $value;
    });
}, 15);

// Handle preflight OPTIONS requests
add_action('rest_api_init', function() {
    register_rest_route('portfolio/v1', '/contact-form', array(
        'methods' => 'GET',
        'callback' => 'get_contact_form_by_id_or_title',
        'permission_callback' => '__return_true',
    ));
}, 10);

function get_contact_form_by_id_or_title($request) {
    // Add CORS headers
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
    
    $identifier = $request->get_param('id') ?: $request->get_param('title');
    
    if (!$identifier) {
        return new WP_Error('missing_identifier', 'Please provide form ID or title', array('status' => 400));
    }
    
    // Get all CF7 forms
    $posts = get_posts(array(
        'post_type' => 'wpcf7_contact_form',
        'posts_per_page' => -1,
        'post_status' => 'publish'
    ));
    
    foreach ($posts as $post) {
        $form = wpcf7_contact_form($post->ID);
        
        if (!$form) continue;
        
        // Check by numeric ID
        if ($post->ID == $identifier || $post->ID == intval($identifier)) {
            return array(
                'id' => $post->ID,
                'title' => $form->title(),
                'form' => $form->form(),
                'hash' => $form->hash(),
            );
        }
        
        // Check by hash (slug)
        if ($form->hash() === $identifier) {
            return array(
                'id' => $post->ID,
                'title' => $form->title(),
                'form' => $form->form(),
                'hash' => $form->hash(),
            );
        }
        
        // Check by title
        if (strtolower($form->title()) === strtolower($identifier) || 
            stripos($form->title(), $identifier) !== false) {
            return array(
                'id' => $post->ID,
                'title' => $form->title(),
                'form' => $form->form(),
                'hash' => $form->hash(),
            );
        }
    }
    
    return new WP_Error('form_not_found', 'Contact form not found', array('status' => 404));
}

