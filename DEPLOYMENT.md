# Deployment en Render

Este proyecto está configurado para ser deployado en Render como un sitio estático.

## Configuración Automática

El proyecto incluye un archivo `render.yaml` que configura automáticamente el deployment.

## Pasos para Deployar

### 1. Preparar el Repositorio Git

Asegúrate de que todos los cambios estén committeados:

```bash
git add .
git commit -m "feat: add deployment configuration for Render"
git push origin main
```

### 2. Crear el Servicio en Render

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en "New +" y selecciona "Static Site"
3. Conecta tu repositorio de GitHub
4. Render detectará automáticamente el archivo `render.yaml`
5. Configura las siguientes opciones (si no se detectan automáticamente):
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist/ai-agency-ac/browser`
   - **Node Version**: 20.19.0 (especificado en `.nvmrc`)

### 3. Variables de Entorno (Opcional)

Si necesitas agregar variables de entorno:
1. Ve a "Environment" en el dashboard de tu servicio
2. Agrega las variables necesarias

### 4. Deploy

Click en "Create Static Site" y Render comenzará el proceso de build y deployment automáticamente.

## Redeployment Automático

Cada vez que hagas push a la rama `main`, Render automáticamente:
1. Detectará los cambios
2. Ejecutará el build
3. Deployará la nueva versión

## URLs

Después del deployment, tu sitio estará disponible en:
- URL de Render: `https://[tu-app-name].onrender.com`

## Troubleshooting

### Error: Node version too old

Si recibes un error sobre la versión de Node, verifica que el archivo `.nvmrc` exista y contenga `20.19.0`

### Error de Build

Si el build falla:
1. Verifica los logs en el dashboard de Render
2. Asegúrate de que el build funcione localmente: `npm run build`
3. Verifica que todas las dependencias estén en `package.json`

### 404 en rutas

Si obtienes 404 al navegar a rutas directamente, verifica que el archivo `render.yaml` incluya la configuración de rewrite:

```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

## Optimizaciones de Producción

El build de producción ya incluye:
- ✅ Minificación de código
- ✅ Tree shaking
- ✅ Output hashing para cache busting
- ✅ Optimización de assets
- ✅ Lazy loading de componentes

## Monitoreo

Después del deployment, puedes monitorear:
- Logs de build en Render dashboard
- Métricas de rendimiento
- Status del sitio
