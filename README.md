# AI Agency Landing Page

Landing page profesional de agencia de IA construida con Angular 21 y diseño minimalista. Diseñada para mostrar servicios, portfolio y capturar leads de manera elegante y efectiva.

## Características

- **Angular 21** - Framework moderno y performante
- **Diseño Minimalista** - Enfoque en contenido y conversión
- **Tailwind CSS** - Estilos utilitarios y responsive
- **SEO Optimizado** - Meta tags y estructura semántica
- **Accesibilidad** - ARIA labels y navegación por teclado
- **Animaciones suaves** - Transiciones elegantes sin distracciones
- **100% Responsive** - Diseño adaptable a todos los dispositivos

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── hero/          # Sección principal con CTA
│   │   ├── about/         # Información sobre la agencia
│   │   ├── portfolio/     # Proyectos destacados
│   │   └── contact/       # Formulario de contacto
│   ├── app.ts
│   ├── app.html
│   └── app.scss
├── styles.scss            # Estilos globales
└── index.html            # HTML principal con meta tags SEO
```

## Instalación y Desarrollo

### Prerequisitos

- Node.js 22+
- npm 10+
- Angular CLI 21+

### Instalación

```bash
# Clonar el repositorio
git clone git@github.com:angelcamacho17/ai-agency-ac.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve
```

Navega a `http://localhost:4200/` para ver la aplicación.

### Build para Producción

```bash
ng build
```

Los archivos compilados estarán en el directorio `dist/`.

## Personalización

### Colores y Estilos

Los colores principales están definidos en `tailwind.config.js`:

```javascript
colors: {
  dark: {
    900: '#0A0A0A',
    800: '#121212',
    700: '#1A1A1A',
  },
}
```

### Contenido

Edita los componentes en `src/app/components/` para personalizar:

- **Hero**: Título principal y CTAs
- **About**: Descripción de servicios y expertise
- **Portfolio**: Proyectos y casos de estudio
- **Contact**: Información de contacto y formulario

### Meta Tags y SEO

Actualiza los meta tags en `src/index.html`:

```html
<title>Tu Título</title>
<meta name="description" content="Tu descripción">
<meta name="author" content="Tu Nombre">
```

## Directrices de Diseño

Este proyecto sigue principios específicos de diseño minimalista:

- **Espaciado generoso** (80-120px entre secciones)
- **Tipografía clara** (Inter font, line-height 1.6)
- **Animaciones sutiles** (0.8s fade-in, scale hover 0.3s)
- **Contraste alto** para legibilidad (WCAG AA)
- **Sin elementos innecesarios** (sin popups, auto-play, etc.)

## Tecnologías Utilizadas

- [Angular 21](https://angular.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostCSS](https://postcss.org/)

## Siguientes Pasos

1. ✅ Estructura base completa
2. ✅ Componentes implementados
3. ✅ Diseño responsive
4. ⏳ Integrar Tailwind CSS completamente
5. ⏳ Agregar animaciones con GSAP o Framer Motion
6. ⏳ Conectar formulario con backend/API
7. ⏳ Deploy a Vercel/Netlify

## Notas de Desarrollo

- El proyecto usa Tailwind CSS v4 que requiere `@tailwindcss/postcss`
- Las directivas de Tailwind están temporalmente deshabilitadas en `styles.scss`
- Para habilitar Tailwind, descomentar las directivas en `src/styles.scss`

## Licencia

MIT

## Contacto

Para preguntas o soporte, contacta a través del formulario en la landing page.
