/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Background colors - dark
        dark: {
          950: '#0a0a0a',
          900: '#121212',
          800: '#1a1a1a',
        },
        // Neon colors - primary palette
        neon: {
          green: '#10b981',
          teal: '#14b8a6',
          orange: '#fb923c',
        },
        // Text colors for dark mode
        text: {
          primary: '#ffffff',
          secondary: '#e5e7eb',
          tertiary: '#9ca3af',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'hero': 'clamp(3rem, 8vw, 7rem)',
        'section': 'clamp(2.5rem, 5vw, 4.5rem)',
        'subsection': 'clamp(1.75rem, 3vw, 2.5rem)',
        'body-lg': 'clamp(1.125rem, 2vw, 1.5rem)',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'glow-green': '0 0 30px rgba(16, 185, 129, 0.5)',
        'glow-green-lg': '0 0 60px rgba(16, 185, 129, 0.8), 0 20px 40px rgba(0, 0, 0, 0.4)',
        'glow-teal': '0 0 30px rgba(20, 184, 166, 0.6)',
        'glow-teal-lg': '0 0 60px rgba(20, 184, 166, 0.8), 0 20px 40px rgba(20, 184, 166, 0.3)',
        'inner-glow': 'inset 0 0 60px rgba(16, 185, 129, 0.1), 0 0 80px rgba(16, 185, 129, 0.2)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-glow': 'fadeInGlow 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-hover': 'scaleHover 0.3s ease',
        'float': 'float 20s ease-in-out infinite',
        'float-reverse': 'float 15s ease-in-out infinite reverse',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-right': 'slideRight 0.3s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInGlow: {
          '0%': {
            opacity: '0',
            transform: 'translateY(40px) scale(0.95)',
            filter: 'blur(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0px)',
          },
        },
        scaleHover: {
          '0%': {
            transform: 'scale(1)',
          },
          '100%': {
            transform: 'scale(1.05)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translate(0, 0)',
          },
          '25%': {
            transform: 'translate(100px, -80px)',
          },
          '50%': {
            transform: 'translate(-50px, 100px)',
          },
          '75%': {
            transform: 'translate(-100px, -50px)',
          },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 60px rgba(16, 185, 129, 0.7)',
          },
        },
        slideRight: {
          '0%': {
            transform: 'translateX(0)',
          },
          '100%': {
            transform: 'translateX(8px)',
          },
        },
      },
      letterSpacing: {
        'tighter': '-0.03em',
        'tight': '-0.01em',
        'wide': '0.1em',
      },
    },
  },
  plugins: [],
}
