const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/register
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('Le prénom est requis')
      .isLength({ max: 100 })
      .withMessage('Le prénom ne doit pas dépasser 100 caractères'),
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Le nom est requis')
      .isLength({ max: 100 })
      .withMessage('Le nom ne doit pas dépasser 100 caractères'),
  ],
  validate,
  AuthController.register
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
  ],
  validate,
  AuthController.login
);

// GET /api/auth/profile (protégé)
router.get('/profile', authenticate, AuthController.getProfile);

// PUT /api/auth/profile (protégé)
router.put(
  '/profile',
  authenticate,
  [
    body('email').optional().isEmail().normalizeEmail().withMessage('Email invalide'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Le prénom ne doit pas dépasser 100 caractères'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Le nom ne doit pas dépasser 100 caractères'),
  ],
  validate,
  AuthController.updateProfile
);

// GET /api/auth/verify (protégé — utilisé par les autres microservices)
router.get('/verify', authenticate, AuthController.verifyToken);

module.exports = router;
