# Sudeep Nandyal – Java Full Stack Developer Portfolio

A premium, cinematic, dark-themed portfolio website built with HTML5, Tailwind CSS, and Vanilla JavaScript.

## 🚀 Features

- **Premium dark theme** – Matte black (#0B0B0B) with neon blue and orange accents
- **Glassmorphism cards** – Frosted blur effects with glowing borders
- **Cinematic animations** – Hero fade-in, typing effect, floating profile image, scroll reveal
- **Particle canvas** – Animated floating particles with connecting lines
- **Fully responsive** – Mobile-first, works on all screen sizes
- **Accessible** – WCAG compliant, ARIA labels, keyboard navigation, focus indicators
- **Performance optimized** – Lazy loading, reduced motion support, minimal JS

## 📁 Project Structure

```
portfolio/
├── index.html                    # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css             # Main stylesheet
│   ├── js/
│   │   └── main.js               # All JavaScript logic
│   └── Sudeep_Nandyal_Resume.pdf # Your resume (replace with actual)
└── README.md
```

## 🛠 Setup

1. **Open locally** – Simply open `index.html` in any modern browser (no build step needed)
2. **Replace resume** – Put your actual resume PDF at `assets/Sudeep_Nandyal_Resume.pdf`
3. **Add profile photo** – Replace the avatar placeholder in `index.html` with an `<img>` tag
4. **Update links** – Add your actual GitHub and LinkedIn URLs in `index.html`

## 📸 Adding Your Profile Photo

In `index.html`, find the `.profile-placeholder` div and replace it:

```html
<!-- Replace this block -->
<div class="profile-placeholder" role="img" aria-label="Sudeep Nandyal profile photo">
  <i class="fas fa-user profile-icon"></i>
  <span class="profile-initials">SN</span>
</div>

<!-- With this -->
<img src="assets/images/profile.jpg"
     alt="Sudeep Nandyal – Java Full Stack Developer"
     width="280" height="280"
     style="width:100%;height:100%;object-fit:cover;border-radius:50%;"
     loading="eager" />
```

## 🔗 Updating Social Links

Search for `href="#"` in `index.html` and replace with your actual URLs:
- LinkedIn: `https://linkedin.com/in/your-username`
- GitHub: `https://github.com/your-username`
- Project GitHub repos and live demo links

## 🎨 Customisation

All CSS custom properties (colors, radii, shadows) are defined at the top of `style.css` under `:root {}`.

Key variables:
```css
--neon-blue:     #3B82F6;  /* Primary accent */
--accent-orange: #F97316;  /* Secondary accent */
--bg-primary:    #0B0B0B;  /* Background */
```

## 🚀 Deployment

Works on any static host:
- **GitHub Pages** – Push to repo, enable Pages in settings
- **Netlify** – Drag & drop the folder
- **Vercel** – `vercel deploy`

## 📝 Tech Stack

- HTML5 (semantic, SEO-friendly)
- Tailwind CSS (CDN)
- Vanilla JavaScript ES6+
- Google Fonts (Inter, JetBrains Mono)
- Font Awesome 6 icons

---

© 2026 Sudeep Nandyal. All Rights Reserved.
