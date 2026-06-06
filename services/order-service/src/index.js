require('dotenv').config();
const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/order.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4003;

// Middleware globaux
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'order-service',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/orders', orderRoutes);

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
  console.log(`🛒 Order Service démarré sur le port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
