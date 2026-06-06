const express = require('express');
const { body } = require('express-validator');
const CategoryController = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// GET /api/categories — liste publique
router.get('/', CategoryController.getAll);

// GET /api/categories/:id — détail public
router.get('/:id', CategoryController.getById);

// POST /api/categories — créer (admin)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('description').optional().trim(),
  ],
  validate,
  CategoryController.create
);

// PUT /api/categories/:id — modifier (admin)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    body('name').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('description').optional().trim(),
  ],
  validate,
  CategoryController.update
);

// DELETE /api/categories/:id — supprimer (admin)
router.delete('/:id', authenticate, authorize('admin'), CategoryController.delete);

module.exports = router;
