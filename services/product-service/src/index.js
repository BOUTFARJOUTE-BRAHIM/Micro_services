require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4002;

// Middleware globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'product-service',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} non trouvée`,
  });
});

// Gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`📦 Product Service démarré sur le port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
