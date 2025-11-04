# WordPress Backend Setup Guide

## 📝 How to Add These Code Snippets to WordPress

### Step-by-Step Instructions:

1. **Log into WordPress Admin**
   - Go to: `http://localhost/headless/wp-admin`

2. **Install WPCode Plugin** (if not already installed)
   - Go to: Plugins → Add New
   - Search for "WPCode"
   - Install and Activate

3. **Add Code Snippets**

   **For each PHP file:**
   
   - Go to: **WPCode → Add Snippet → Add Your Custom Code (New Snippet)**
   - Give it a name (e.g., "Portfolio Enhanced CPT")
   - Select **"PHP Snippet"** as snippet type
   - Select **"Run snippet everywhere"** for Location
   - Copy the entire code from each `.php` file and paste it into the code editor
   - Click **"Save Snippet"**
   - Toggle the snippet to **"Active"**
   - Repeat for all 3 files

### Files to Add (in this order):

1. ✅ **`portfolio-enhanced.php`** 
   - Enhanced Portfolio CPT with custom fields
   - Project categories taxonomy
   - Custom meta boxes

2. ✅ **`skills-experience-education.php`**
   - Skills CPT
   - Experience CPT
   - Education CPT

3. ✅ **`portfolio-settings.php`**
   - Portfolio settings page
   - About Me, Social Links, Hero Content
   - REST API endpoint for settings

4. ✅ **`bulk-add-skills-simple.php`** (OPTIONAL - Recommended)
   - Bulk adds all your skills organized by categories
   - Creates categories automatically
   - Sets proficiency levels
   - **Usage:** Activate once, then deactivate (runs automatically)

5. ✅ **`bulk-add-experience-simple.php`** (OPTIONAL - Recommended)
   - Bulk adds all your work experience entries
   - Sets dates, company, job title, technologies
   - Marks current positions automatically
   - **Usage:** Activate once, then deactivate (runs automatically)

6. ✅ **`bulk-add-portfolio-projects.php`** (OPTIONAL - Recommended)
   - Bulk adds all your portfolio projects
   - Organizes by categories (Personal & Front-End, WooCommerce, Portfolio/Business, Functional Tools)
   - Sets tech stacks, project types, and descriptions
   - **Usage:** Activate once, then deactivate (runs automatically)

7. ✅ **`bulk-add-portfolio-settings.php`** (OPTIONAL - Recommended)
   - Sets hero section, about me, contact info, and social links
   - **Important:** Edit the file first to add your email, phone, LinkedIn, GitHub, etc.
   - Or use `bulk-add-portfolio-settings-EXAMPLE.php` as a template
   - **Usage:** Activate once, then deactivate (runs automatically)

---

## 🧪 Testing the API Endpoints

After adding all snippets, test these REST API endpoints:

### Portfolio:
- `http://localhost/headless/wp-json/wp/v2/portfolio?_embed`
- Should return portfolio projects with all custom fields

### Skills:
- `http://localhost/headless/wp-json/wp/v2/skill`

### Experience:
- `http://localhost/headless/wp-json/wp/v2/experience`

### Education:
- `http://localhost/headless/wp-json/wp/v2/education`

### Portfolio Settings:
- `http://localhost/headless/wp-json/portfolio/v1/settings`

---

## 📋 Custom Fields Available in WordPress Admin

After activation, you'll see new menu items:

### Portfolio Projects
- **Custom Fields in Admin:**
  - Live Project URL
  - GitHub URL
  - Tech Stack (comma-separated)
  - Project Type (dropdown)
  - Date Completed
  - Project Categories (taxonomy)

### Skills
- **Custom Fields:**
  - Proficiency Level (Beginner/Intermediate/Advanced)
  - Icon URL
  - Skill Categories (taxonomy)

### Experience
- **Custom Fields:**
  - Company
  - Job Title
  - Start Date
  - End Date
  - Current Position (checkbox)
  - Technologies Used

### Education
- **Custom Fields:**
  - Institution
  - Degree
  - Year

### Portfolio Settings
- Go to: **Settings → Portfolio Settings**
- Configure:
  - Hero Headline & Subtitle
  - About Me (rich text)
  - Contact Info (Email, Phone, Location)
  - Social Links (LinkedIn, GitHub, Twitter)
  - Resume URL

---

## ✅ Checklist

- [ ] All 3 main PHP snippets added to WPCode
- [ ] All snippets are **Active**
- [ ] **Add bulk skills snippet** (`bulk-add-skills-simple.php`) - Activate once, then deactivate
- [ ] **Add bulk experience snippet** (`bulk-add-experience-simple.php`) - Activate once, then deactivate
- [ ] **Add bulk portfolio projects snippet** (`bulk-add-portfolio-projects.php`) - Activate once, then deactivate
- [ ] **Add portfolio settings snippet** (`bulk-add-portfolio-settings.php`) - Edit with your info first, then activate once
- [ ] Test REST API endpoints
- [ ] Verify skills were added: `http://localhost/headless/wp-json/wp/v2/skill`
- [ ] Verify experience was added: `http://localhost/headless/wp-json/wp/v2/experience`
- [ ] Verify portfolio projects were added: `http://localhost/headless/wp-json/wp/v2/portfolio?_embed`
- [ ] Verify portfolio settings: `http://localhost/headless/wp-json/portfolio/v1/settings`
- [ ] Add education entries (if any)

---

## 🚨 Troubleshooting

**If REST API doesn't show custom fields:**
- Make sure snippets are Active in WPCode
- Clear browser cache
- Check WordPress Permalinks: Settings → Permalinks → Save Changes

**If meta boxes don't appear:**
- Verify snippet is active
- Check for PHP errors in WordPress debug log
- Make sure you're editing the correct post type

---

## 🚀 Bulk Add Skills

After setting up the main snippets, use the bulk add skills snippet:

1. **Add `bulk-add-skills-simple.php` to WPCode**
2. **Activate it** - Skills will be added automatically
3. **Deactivate it** - It only needs to run once
4. **Check Skills:** Go to Skills → All Skills in WordPress admin

This will add all your skills:
- ✅ Web Technologies (JavaScript, HTML5, CSS3, etc.)
- ✅ SEO Tools (Google Search Console, Semrush, etc.)
- ✅ Frameworks/Libraries (React, Redux, Express, etc.)
- ✅ WordPress Development skills
- ✅ Design & Optimization
- ✅ Debugging & Tools
- ✅ IDE/Tools (Git, GitHub, etc.)
- ✅ Languages (English, Urdu)
- ✅ Other Skills

All organized by categories with proficiency levels!

---

## 🚀 Bulk Add Work Experience

After setting up the main snippets, use the bulk add experience snippet:

1. **Add `bulk-add-experience-simple.php` to WPCode**
2. **Activate it** - Experience entries will be added automatically
3. **Deactivate it** - It only needs to run once
4. **Check Experience:** Go to Experience → All Experience in WordPress admin

This will add all 8 work experience entries:
- ✅ Digital Optimisers - Full Stack Developer (May 2025 – Present)
- ✅ Tauronic - WooCommerce/Full Stack Developer (Feb 2025 – Present)
- ✅ Systems Dash Ltd - Junior Full Stack Developer (Aug 2024 – May 2025)
- ✅ Easy Sell Buy Car - Web Development Intern (Aug 2024 – Sep 2024)
- ✅ Systems Dash Ltd - Intern WordPress Developer (Jun 2024 – Aug 2024)
- ✅ Elpha Tech - WordPress Blog Developer (Jan 2024 – Jun 2024)
- ✅ Digital Bolt - Intern Front-End Developer (Jul 2023 - Dec 2023)
- ✅ Ibrahim Fibers Limited - Intern (May 2023 - Jun 2023)

All with:
- Company name and job titles
- Start/End dates (or marked as current)
- Full descriptions with achievements
- Technologies used

---

## 🚀 Bulk Add Portfolio Projects

After setting up the main snippets, use the bulk add portfolio projects snippet:

1. **Add `bulk-add-portfolio-projects.php` to WPCode**
2. **Activate it** - Portfolio projects will be added automatically
3. **Deactivate it** - It only needs to run once
4. **Check Portfolio:** Go to Portfolio → All Projects in WordPress admin

This will add all 17 portfolio projects organized by categories:

**Personal & Front-End Development (2 projects):**
- ✅ Tuitility - React-based platform with 80+ tools
- ✅ AlmahdiStore.pk - Laravel eCommerce platform

**WooCommerce / eCommerce (9 projects):**
- ✅ Elektroplaneta.cz
- ✅ Asijske Jidlo
- ✅ MobilPoint
- ✅ Smartonix
- ✅ Easy Sell Buy Car
- ✅ Comfy Casa
- ✅ Dene Furnishing
- ✅ Ali Baba Furniture
- ✅ Amritsar Sweets

**Portfolio / Business Showcase (5 projects):**
- ✅ Matharu Interiors
- ✅ Pearl Hair and Beauty Salon
- ✅ AK Decoration and Events
- ✅ Ordinary Edits
- ✅ Pixel Code Wizard

**Functional Projects & Tools (2 projects):**
- ✅ Ecowheel+ - Installment payment management system
- ✅ Cargo Management System - Full-stack dashboard

All projects include:
- Project descriptions with achievements
- Tech stacks (React, Laravel, WordPress, WooCommerce, PHP, etc.)
- Project categories for filtering
- Project types (Web Application, Website)
- Live URLs (where available)

---

## ⚙️ Configure Portfolio Settings

Use the bulk add portfolio settings snippet to set your personal information:

1. **Open `bulk-add-portfolio-settings-EXAMPLE.php`** (easier to edit)
2. **Edit the values:**
   - Email address
   - Phone number (with country code)
   - Location (e.g., "Remote / Pakistan")
   - LinkedIn URL
   - GitHub URL
   - Twitter/X URL (optional)
   - Portfolio website URL (optional)
   - Resume/CV URL (optional)
   - About Me / Summary (can be edited later in WordPress admin)
3. **Copy the edited code**
4. **Add to WPCode → Add Snippet → PHP Snippet**
5. **Activate it** - Settings will be saved
6. **Deactivate it** - Only needs to run once

**Or edit directly in WordPress:**
- Go to: **Settings → Portfolio Settings**
- Fill in all your information
- Click "Save Settings"

**Test API:**
- `http://localhost/headless/wp-json/portfolio/v1/settings`

---

## 📝 Next Steps

Once backend is set up:
1. ✅ Skills automatically added via bulk snippet
2. ✅ Experience automatically added via bulk snippet
3. ✅ Portfolio projects automatically added via bulk snippet
4. ✅ Portfolio settings configured (with your personal info)
5. Add education entries (if any)
6. Add featured images to portfolio projects (optional)
7. Then we'll build the React frontend to consume this data!


