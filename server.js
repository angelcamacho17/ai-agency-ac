const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Servir archivos estáticos desde dist/ai-agency-ac/browser
const distPath = path.join(__dirname, 'dist/ai-agency-ac/browser');
app.use(express.static(distPath));

// Para todas las rutas, servir index.html (necesario para Angular routing)
app.get('/*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
