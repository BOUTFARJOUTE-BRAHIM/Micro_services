const express = require('express');
const { body } = require('express-validator');
const ProductController = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// GET /api/products — liste publique avec filtres
router.get('/', ProductController.getAll);

// GET /api/products/:id — détail public
router.get('/:id', ProductController.getById);

// POST /api/products — créer (admin)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('description').optional().trim(),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Le stock doit être un entier positif'),
    body('categoryId').optional().isUUID().withMessage('ID de catégorie invalide'),
    body('imageUrl').optional().isURL().withMessage('URL d\'image invalide'),
  ],
  validate,
  ProductController.create
);

// PUT /api/products/:id — modifier (admin)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('description').optional().trim(),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Le prix doit être un nombre positif'),
    body('stock')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Le stock doit être un entier positif'),
    body('categoryId').optional().isUUID().withMessage('ID de catégorie invalide'),
    body('imageUrl').optional().isURL().withMessage('URL d\'image invalide'),
  ],
  validate,
  ProductController.update
);

// PATCH /api/products/:id/stock — mise à jour du stock
router.patch(
  '/:id/stock',
  [
    body('quantity')
      .isInt()
      .withMessage('La quantité doit être un entier'),
  ],
  validate,
  ProductController.updateStock
);

// DELETE /api/products/:id — supprimer (admin)
router.delete('/:id', authenticate, authorize('admin'), ProductController.delete);

module.exports = router;
