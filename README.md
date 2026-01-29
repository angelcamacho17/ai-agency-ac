# Michelangelo Devs - Atmospheric Landing Page

**We write art, not code.**

A stunning, atmospheric landing page for Michelangelo Devs built with Angular 21+ and Tailwind CSS. Features nebula-inspired backgrounds, glassmorphism effects, particle animations, and an immersive user experience.

---

## Features

### Design Philosophy
- **Atmospheric & Dimensional**: Nebula gradients with heavy blur effects
- **Glassmorphism**: Translucent UI elements with backdrop blur
- **Glow Effects**: Strategic use of neon green glow on interactive elements
- **Particle System**: Canvas-based floating particles
- **Parallax Scrolling**: Nebula backgrounds move at different speeds
- **Smooth Animations**: Fade-in, glow expansion, and stagger effects
- **Custom Cursor**: Glowing cursor effect on desktop
- **Magnetic Buttons**: Interactive buttons that follow the cursor

### Sections
1. **Hero** - Full viewport with animated nebula backgrounds
2. **Philosophy** - Three glassmorphism cards with hover effects
3. **What We Build** - Bento grid layout with glow effects
4. **Process** - 4-step process with animated connectors
5. **Stats** - Counter animations with glow effects
6. **CTA** - Hero button with intense glow
7. **Footer** - Clean footer with social links

### Technical Stack
- **Angular 21+** with standalone components
- **Tailwind CSS** with custom theme
- **TypeScript** for type safety
- **Canvas API** for particle effects
- **Intersection Observer** for scroll animations
- **CSS Animations** with custom easing curves

---

## Prerequisites

Before you begin, ensure you have:
- **Node.js** v20.19+ or v22.12+ (Angular 21 requirement)
- **npm** 10.9.4+

---

## Installation

1. **Clone the repository** (if not already cloned)
   ```bash
   git clone git@github.com:angelcamacho17/ai-agency-ac.git
   cd ai-agency-ac
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

---

## Development

Start the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you make changes.

---

## Build

Build the project for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory with production optimizations enabled.

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── hero/                    # Hero section
│   │   ├── shared/
│   │   │   ├── navigation/          # Glassmorphism nav
│   │   │   ├── nebula-background/   # Animated nebula
│   │   │   └── particles/           # Canvas particles
│   │   └── sections/
│   │       ├── philosophy/          # Philosophy cards
│   │       ├── work/                # Bento grid
│   │       ├── process/             # Process steps
│   │       ├── stats/               # Counter animations
│   │       ├── cta/                 # Call to action
│   │       └── footer/              # Footer
│   ├── directives/
│   │   ├── scroll-reveal.directive.ts      # Scroll animations
│   │   ├── magnetic-button.directive.ts    # Magnetic effect
│   │   └── custom-cursor.directive.ts      # Custom cursor
│   ├── app.ts                       # Root component
│   └── app.html                     # Main template
├── styles.scss                      # Global styles
└── index.html                       # HTML entry point
```

---

## Customization

### Colors
Edit `tailwind.config.js` to customize the nebula colors:
```javascript
colors: {
  neon: {
    green: '#10b981',
    teal: '#14b8a6',
    orange: '#fb923c',
  }
}
```

### Animations
Adjust animation timings in `tailwind.config.js`:
```javascript
animation: {
  'float': 'float 20s ease-in-out infinite',
  'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
}
```

### Content
Update component templates to change text content:
- Hero: `src/app/components/hero/hero.html`
- Philosophy: `src/app/components/sections/philosophy/philosophy.component.ts`
- Work: `src/app/components/sections/work/work.component.ts`

---

## Performance Optimizations

### Implemented
- GPU acceleration for animated elements (`translateZ(0)`)
- Lazy loading for non-critical components
- Intersection Observer for scroll animations
- `will-change` hints for transformed elements
- Reduced motion support for accessibility

### Recommendations
- Add WebP images for mockups
- Implement code splitting for routes
- Use `NgOptimizedImage` for hero images
- Enable Brotli compression on server
- Set up CDN (Cloudflare recommended)

---

## Accessibility

- **WCAG AA compliant** contrast ratios
- **Keyboard navigation** with visible focus states
- **ARIA labels** on all interactive elements
- **Semantic HTML** structure
- **Screen reader** friendly content
- **Reduced motion** support via `prefers-reduced-motion`

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note**: Custom cursor and some advanced effects are desktop-only (viewport ≥ 1024px)

---

## Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Other Platforms
Build the project and serve the `dist/` directory as a static site.

---

## Troubleshooting

### Node Version Error
```bash
# Check Node version
node --version

# Update Node using nvm
nvm install 20.19
nvm use 20.19
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styling Issues
```bash
# Rebuild Tailwind
npm run build
```

---

## Credits

**Design Inspiration**: Nebulae, spatial aesthetics, glassmorphism trends
**Framework**: Angular 21+
**Styling**: Tailwind CSS
**Fonts**: Google Fonts (Inter, Playfair Display)

---

## License

This project is proprietary and confidential.
© 2026 Michelangelo Devs. All rights reserved.

---

## Contact

- **Email**: hello@michelangelodevs.com
- **Instagram**: [@michelangelodevs](https://instagram.com)
- **LinkedIn**: [Michelangelo Devs](https://linkedin.com)
- **Twitter/X**: [@michelangelodevs](https://twitter.com)

---

**Built with ❤️ and Angular 21 in Venezuela**
