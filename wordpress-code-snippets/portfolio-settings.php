<?php
/**
 * Portfolio Settings & Global Information
 * Stores About Me, Social Links, Hero Content, etc.
 * Add this to WPCode → Add Snippet → PHP Snippet
 */

// Add settings page to WordPress admin - Now under Portfolio menu for easier access
function add_portfolio_settings_page() {
    // Add as submenu under Portfolio menu (if Portfolio CPT exists)
    add_submenu_page(
        'edit.php?post_type=portfolio',
        'Portfolio Settings',
        'Portfolio Settings',
        'manage_options',
        'portfolio-settings',
        'portfolio_settings_page_callback'
    );
    
    // Fallback: Add to Settings menu if Portfolio CPT doesn't exist yet
    add_options_page(
        'Portfolio Settings',
        'Portfolio Settings',
        'manage_options',
        'portfolio-settings',
        'portfolio_settings_page_callback'
    );
}
add_action('admin_menu', 'add_portfolio_settings_page');

// Enqueue media uploader scripts and styles only on portfolio settings page
function enqueue_portfolio_settings_media_scripts($hook) {
    // Check if we're on the portfolio settings page using the hook
    // Hook names: 'portfolio_page_portfolio-settings' (under Portfolio menu) or 'settings_page_portfolio-settings' (under Settings menu)
    if (strpos($hook, 'portfolio-settings') === false) {
        return;
    }
    
    // Enqueue WordPress media uploader (this loads wp.media object)
    wp_enqueue_media();
}
add_action('admin_enqueue_scripts', 'enqueue_portfolio_settings_media_scripts');

// Settings page HTML
function portfolio_settings_page_callback() {
    // Handle form submission
    if (isset($_POST['portfolio_settings_submit']) && check_admin_referer('portfolio_settings', 'portfolio_settings_nonce')) {
        update_option('portfolio_about_me', wp_kses_post($_POST['portfolio_about_me']));
        update_option('portfolio_hero_headline', sanitize_text_field($_POST['portfolio_hero_headline']));
        update_option('portfolio_hero_subtitle', sanitize_text_field($_POST['portfolio_hero_subtitle']));
        update_option('portfolio_email', sanitize_email($_POST['portfolio_email']));
        update_option('portfolio_phone', sanitize_text_field($_POST['portfolio_phone']));
        update_option('portfolio_location', sanitize_text_field($_POST['portfolio_location']));
        update_option('portfolio_linkedin', esc_url_raw($_POST['portfolio_linkedin']));
        update_option('portfolio_github', esc_url_raw($_POST['portfolio_github']));
        update_option('portfolio_twitter', esc_url_raw($_POST['portfolio_twitter']));
        if (isset($_POST['portfolio_portfolio_url'])) {
            update_option('portfolio_portfolio_url', esc_url_raw($_POST['portfolio_portfolio_url']));
        }
        update_option('portfolio_resume_url', esc_url_raw($_POST['portfolio_resume_url']));
        // Save profile photo attachment ID
        if (isset($_POST['portfolio_profile_photo'])) {
            update_option('portfolio_profile_photo', absint($_POST['portfolio_profile_photo']));
        }
        echo '<div class="notice notice-success is-dismissible"><p><strong>✅ Success!</strong> All portfolio settings have been saved.</p></div>';
    }

    $about_me = get_option('portfolio_about_me', '');
    $hero_headline = get_option('portfolio_hero_headline', 'Full Stack Developer');
    $hero_subtitle = get_option('portfolio_hero_subtitle', 'Building beautiful and functional web applications');
    $email = get_option('portfolio_email', '');
    $phone = get_option('portfolio_phone', '');
    $location = get_option('portfolio_location', '');
    $linkedin = get_option('portfolio_linkedin', '');
    $github = get_option('portfolio_github', '');
    $twitter = get_option('portfolio_twitter', '');
    $resume_url = get_option('portfolio_resume_url', '');
    $profile_photo_id = get_option('portfolio_profile_photo', '');
    $profile_photo_url = $profile_photo_id ? wp_get_attachment_image_url($profile_photo_id, 'full') : '';
    ?>
    <div class="wrap">
        <h1>📋 Portfolio Settings</h1>
        <p>Manage your personal information, contact details, and social links that appear on your portfolio website.</p>
        
        <form method="post" action="">
            <?php wp_nonce_field('portfolio_settings', 'portfolio_settings_nonce'); ?>
            
            <div id="portfolio-settings-tabs" style="margin-top: 20px;">
                <!-- Hero Section -->
                <div class="postbox" style="margin-bottom: 20px;">
                    <div class="postbox-header">
                        <h2 class="hndle ui-sortable-handle">🎯 Hero Section</h2>
                    </div>
                    <div class="inside">
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label for="portfolio_hero_headline">Headline</label></th>
                                <td>
                                    <input type="text" id="portfolio_hero_headline" name="portfolio_hero_headline" value="<?php echo esc_attr($hero_headline); ?>" class="regular-text" placeholder="e.g., Full Stack Developer" />
                                    <p class="description">Main headline that appears at the top of your portfolio</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="portfolio_hero_subtitle">Subtitle</label></th>
                                <td>
                                    <input type="text" id="portfolio_hero_subtitle" name="portfolio_hero_subtitle" value="<?php echo esc_attr($hero_subtitle); ?>" class="regular-text" placeholder="e.g., Building beautiful web applications" />
                                    <p class="description">Supporting text that appears below the headline</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- About Me -->
                <div class="postbox" style="margin-bottom: 20px;">
                    <div class="postbox-header">
                        <h2 class="hndle ui-sortable-handle">📝 About Me / Summary</h2>
                    </div>
                    <div class="inside">
                        <p class="description">Write a professional summary about yourself, your skills, and experience. This will appear on your About page.</p>
                        <?php
                        wp_editor($about_me, 'portfolio_about_me', array(
                            'textarea_name' => 'portfolio_about_me',
                            'textarea_rows' => 15,
                            'media_buttons' => false,
                            'teeny' => false,
                        ));
                        ?>
                    </div>
                </div>

                <!-- Profile Photo -->
                <div class="postbox" style="margin-bottom: 20px;">
                    <div class="postbox-header">
                        <h2 class="hndle ui-sortable-handle">📷 Profile Photo</h2>
                    </div>
                    <div class="inside">
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label for="portfolio_profile_photo">Profile Image</label></th>
                                <td>
                                    <div class="portfolio-photo-upload">
                                        <input type="hidden" id="portfolio_profile_photo" name="portfolio_profile_photo" value="<?php echo esc_attr($profile_photo_id); ?>" />
                                        <div id="portfolio_photo_preview" style="margin-bottom: 10px;">
                                            <?php if ($profile_photo_url): ?>
                                                <img src="<?php echo esc_url($profile_photo_url); ?>" alt="Profile Photo" style="max-width: 300px; height: auto; border-radius: 8px;" />
                                            <?php endif; ?>
                                        </div>
                                        <button type="button" class="button" id="upload_profile_photo_btn">
                                            <?php echo $profile_photo_id ? 'Change Photo' : 'Upload Photo'; ?>
                                        </button>
                                        <button type="button" class="button" id="remove_profile_photo_btn" style="<?php echo $profile_photo_id ? '' : 'display:none;'; ?>">
                                            Remove Photo
                                        </button>
                                        <p class="description">Upload your profile photo. Recommended size: 400x500px or similar aspect ratio.</p>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="postbox" style="margin-bottom: 20px;">
                    <div class="postbox-header">
                        <h2 class="hndle ui-sortable-handle">📞 Contact Information</h2>
                    </div>
                    <div class="inside">
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label for="portfolio_email">Email Address</label></th>
                                <td>
                                    <input type="email" id="portfolio_email" name="portfolio_email" value="<?php echo esc_attr($email); ?>" class="regular-text" placeholder="your.email@example.com" />
                                    <p class="description">Your professional email address</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="portfolio_phone">Phone Number</label></th>
                                <td>
                                    <input type="text" id="portfolio_phone" name="portfolio_phone" value="<?php echo esc_attr($phone); ?>" class="regular-text" placeholder="+92 XXX XXXXXXX" />
                                    <p class="description">Include country code (e.g., +92 for Pakistan)</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="portfolio_location">Location</label></th>
                                <td>
                                    <input type="text" id="portfolio_location" name="portfolio_location" value="<?php echo esc_attr($location); ?>" class="regular-text" placeholder="e.g., Remote / Pakistan" />
                                    <p class="description">Your location or availability status</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Social Links -->
                <div class="postbox" style="margin-bottom: 20px;">
                    <div class="postbox-header">
                        <h2 class="hndle ui-sortable-handle">🔗 Social Links</h2>
                    </div>
                    <div class="inside">
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label for="portfolio_linkedin">LinkedIn URL</label></th>
                                <td>
                                    <input type="url" id="portfolio_linkedin" name="portfolio_linkedin" value="<?php echo esc_url($linkedin); ?>" class="regular-text" placeholder="https://linkedin.com/in/yourname" />
                                    <p class="description">Your LinkedIn profile URL</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="portfolio_github">GitHub URL</label></th>
                                <td>
                                    <input type="url" id="portfolio_github" name="portfolio_github" value="<?php echo esc_url($github); ?>" class="regular-text" placeholder="https://github.com/yourusername" />
                                    <p class="description">Your GitHub profile URL</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="portfolio_twitter">Twitter/X URL</label></th>
                                <td>
                                    <input type="url" id="portfolio_twitter" name="portfolio_twitter" value="<?php echo esc_url($twitter); ?>" class="regular-text" placeholder="https://twitter.com/yourusername" />
                                    <p class="description">Your Twitter/X profile URL (optional)</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="portfolio_portfolio_url">Portfolio Website URL</label></th>
                                <td>
                                    <?php $portfolio_url = get_option('portfolio_portfolio_url', ''); ?>
                                    <input type="url" id="portfolio_portfolio_url" name="portfolio_portfolio_url" value="<?php echo esc_url($portfolio_url); ?>" class="regular-text" placeholder="https://yourportfolio.com" />
                                    <p class="description">Link to your personal portfolio website (optional)</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- Resume -->
                <div class="postbox" style="margin-bottom: 20px;">
                    <div class="postbox-header">
                        <h2 class="hndle ui-sortable-handle">📄 Resume / CV</h2>
                    </div>
                    <div class="inside">
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label for="portfolio_resume_url">Resume/CV URL</label></th>
                                <td>
                                    <input type="url" id="portfolio_resume_url" name="portfolio_resume_url" value="<?php echo esc_url($resume_url); ?>" class="regular-text" placeholder="https://yourportfolio.com/resume.pdf" />
                                    <p class="description">Direct link to your resume or CV (PDF recommended)</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>

            <p class="submit">
                <?php submit_button('💾 Save All Settings', 'primary large', 'portfolio_settings_submit', false); ?>
            </p>
        </form>
    </div>
    
    <style>
    #portfolio-settings-tabs .postbox {
        border: 1px solid #c3c4c7;
        box-shadow: 0 1px 1px rgba(0,0,0,.04);
    }
    #portfolio-settings-tabs .postbox-header {
        border-bottom: 1px solid #c3c4c7;
        padding: 12px 20px;
        background: #f6f7f7;
    }
    #portfolio-settings-tabs .postbox-header h2 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
    }
    #portfolio-settings-tabs .inside {
        padding: 20px;
    }
    </style>
    
    <script>
    jQuery(document).ready(function($) {
        var mediaUploader;
        
        $('#upload_profile_photo_btn').on('click', function(e) {
            e.preventDefault();
            
            if (mediaUploader) {
                mediaUploader.open();
                return;
            }
            
            mediaUploader = wp.media({
                title: 'Choose Profile Photo',
                button: {
                    text: 'Use this image'
                },
                multiple: false
            });
            
            mediaUploader.on('select', function() {
                var attachment = mediaUploader.state().get('selection').first().toJSON();
                $('#portfolio_profile_photo').val(attachment.id);
                $('#portfolio_photo_preview').html('<img src="' + attachment.url + '" alt="Profile Photo" style="max-width: 300px; height: auto; border-radius: 8px;" />');
                $('#upload_profile_photo_btn').text('Change Photo');
                $('#remove_profile_photo_btn').show();
            });
            
            mediaUploader.open();
        });
        
        $('#remove_profile_photo_btn').on('click', function(e) {
            e.preventDefault();
            $('#portfolio_profile_photo').val('');
            $('#portfolio_photo_preview').html('');
            $('#upload_profile_photo_btn').text('Upload Photo');
            $('#remove_profile_photo_btn').hide();
        });
    });
    </script>
    <?php
}

// Expose settings via REST API
function register_portfolio_settings_rest_route() {
    register_rest_route('portfolio/v1', '/settings', array(
        'methods' => 'GET',
        'callback' => 'get_portfolio_settings',
        'permission_callback' => '__return_true',
    ));
}
add_action('rest_api_init', 'register_portfolio_settings_rest_route');

function get_portfolio_settings() {
    $profile_photo_id = get_option('portfolio_profile_photo', '');
    $profile_photo_url = $profile_photo_id ? wp_get_attachment_image_url($profile_photo_id, 'full') : '';
    
    // Get WordPress site title
    $site_title = get_bloginfo('name');
    
    return array(
        'site_title' => $site_title ? $site_title : '',
        'hero' => array(
            'headline' => get_option('portfolio_hero_headline', 'Full Stack Developer'),
            'subtitle' => get_option('portfolio_hero_subtitle', 'Building beautiful and functional web applications'),
        ),
        'about_me' => get_option('portfolio_about_me', ''),
        'profile_photo' => $profile_photo_url,
        'contact' => array(
            'email' => get_option('portfolio_email', ''),
            'phone' => get_option('portfolio_phone', ''),
            'location' => get_option('portfolio_location', ''),
        ),
        'social' => array(
            'linkedin' => get_option('portfolio_linkedin', ''),
            'github' => get_option('portfolio_github', ''),
            'twitter' => get_option('portfolio_twitter', ''),
            'portfolio_url' => get_option('portfolio_portfolio_url', ''),
        ),
        'resume_url' => get_option('portfolio_resume_url', ''),
    );
}


