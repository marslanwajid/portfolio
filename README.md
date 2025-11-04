# Portfolio Website - Headless CMS

A modern, responsive portfolio website built with a headless CMS architecture. The backend is powered by WordPress, and the frontend is built with React, connected through REST APIs. Styling is handled with Tailwind CSS.

## 🏗️ Architecture

### Backend (WordPress)
- **CMS**: WordPress as headless CMS
- **API**: WordPress REST API
- **Custom Post Types**: Portfolio, Skills, Experience, Education, Services
- **Custom Fields**: Portfolio settings, hero content, social links, contact information
- **Plugins**: Contact Form 7 integration

### Frontend (React)
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **API Integration**: REST API calls to WordPress backend


## 🚀 Features

- **Portfolio Showcase**: Display selected portfolio projects with filtering
- **Skills & Experience**: Dynamic content from WordPress
- **Contact Form**: Integrated with Contact Form 7
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Smooth Animations**: Animated transitions and loading states
- **Dynamic Content**: All content managed through WordPress admin
- **Preloader**: Animated loading screen with progress indication

## 📦 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: WordPress (Headless CMS)
- **APIs**: WordPress REST API
- **Form Handling**: Contact Form 7
- **Icons**: Lucide React

## 🛠️ Setup Instructions

### Prerequisites
- Node.js and npm installed
- WordPress installation with REST API enabled
- Contact Form 7 plugin (for contact form functionality)

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint in `src/utils/api.js`:
```javascript
const API_BASE = 'https://your-wordpress-site.com/wp-json';
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Backend Setup (WordPress)

1. Install WordPress plugins:
   - Contact Form 7
   - WPCode (for custom PHP snippets)

2. Add custom PHP snippets from `wordpress-code-snippets/`:
   - `portfolio-enhanced.php` - Custom post types and fields
   - `portfolio-settings.php` - Portfolio settings API
   - `enable-cf7-rest-api.php` - Contact Form 7 REST API integration
   - `services-cpt.php` - Services custom post type (if needed)

3. Configure WordPress settings:
   - Go to Settings → General → Site Title (for dynamic title)
   - Go to Portfolio → Portfolio Settings (for portfolio information)

## 📁 Project Structure

```
headless_frontend/
├── src/
│   ├── components/          # React components
│   │   ├── StickySidebar.jsx
│   │   ├── VerticalNavBar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── SelectedWorks.jsx
│   │   └── ...
│   ├── pages/              # Page components
│   │   └── HomeOnePage.jsx
│   ├── utils/              # Utility functions
│   │   └── api.js          # WordPress API integration
│   └── main.jsx            # Entry point
├── wordpress-code-snippets/ # WordPress PHP snippets
│   ├── portfolio-enhanced.php
│   ├── portfolio-settings.php
│   └── enable-cf7-rest-api.php
└── public/                 # Static assets
```

## 🔌 API Endpoints

The frontend connects to WordPress via REST API:

- `GET /wp-json/portfolio/v1/settings` - Portfolio settings
- `GET /wp-json/wp/v2/portfolio` - Portfolio projects
- `GET /wp-json/wp/v2/skill` - Skills
- `GET /wp-json/wp/v2/experience` - Experience
- `GET /wp-json/wp/v2/education` - Education
- `POST /wp-json/contact-form-7/v1/contact-forms/{id}/feedback` - Contact form submission

## 🎨 Styling

The project uses Tailwind CSS for styling with:
- Responsive breakpoints (mobile, tablet, desktop)
- Custom color schemes
- Smooth animations and transitions
- Glassmorphism effects
- Modern UI components

## 📱 Responsive Design

- **Mobile**: Optimized for small screens (< 1024px)
- **Tablet**: Adaptive layout for tablets
- **Desktop**: Full-featured layout with sidebar and navigation

## 🔧 Customization

### Adding New Portfolio Items
1. Go to WordPress Admin → Portfolio → Add New
2. Fill in project details
3. Check "Show on Frontend" to display on website
4. Save and publish

### Updating Portfolio Settings
1. Go to WordPress Admin → Portfolio → Portfolio Settings
2. Update profile information, social links, hero content
3. Save settings

## 📝 License

This project is open source and available for personal and commercial use.

## 👤 Author

Arslan Wajid - Portfolio Website

---

Built with ❤️ using React, WordPress, and Tailwind CSS

