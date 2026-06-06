const express = require('express');
const { body } = require('express-validator');
const OrderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/orders — Créer une commande (authentifié)
router.post(
  '/',
  authenticate,
  [
    body('items')
      .isArray({ min: 1 })
      .withMessage('La commande doit contenir au moins un article'),
    body('items.*.productId')
      .isUUID()
      .withMessage('ID de produit invalide'),
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('La quantité doit être un entier positif'),
    body('shippingAddress')
      .trim()
      .notEmpty()
      .withMessage('L\'adresse de livraison est requise'),
  ],
  validate,
  OrderController.create
);

// GET /api/orders — Historique des commandes (authentifié)
router.get('/', authenticate, OrderController.getUserOrders);

// GET /api/orders/all — Toutes les commandes (admin)
router.get('/all', authenticate, authorize('admin'), OrderController.getAll);

// GET /api/orders/:id — Détail d'une commande (authentifié)
router.get('/:id', authenticate, OrderController.getById);

// PATCH /api/orders/:id/status — Changer le statut (admin)
router.patch(
  '/:id/status',
  authenticate,
  authorize('admin'),
  [
    body('status')
      .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
      .withMessage('Statut invalide'),
  ],
  validate,
  OrderController.updateStatus
);

module.exports = router;
