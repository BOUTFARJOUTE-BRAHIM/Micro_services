const AuthService = require('../services/auth.service');

class AuthController {
  /**
   * POST /api/auth/register
   */
  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;
      const result = await AuthService.register({ email, password, firstName, lastName });

      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/auth/login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/auth/profile
   */
  static async getProfile(req, res, next) {
    try {
      const user = await AuthService.getProfile(req.user.id);

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PUT /api/auth/profile
   */
  static async updateProfile(req, res, next) {
    try {
      const { firstName, lastName, email } = req.body;
      const user = await AuthService.updateProfile(req.user.id, {
        firstName,
        lastName,
        email,
      });

      res.status(200).json({
        success: true,
        message: 'Profil mis à jour',
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/auth/verify
   * Vérifie la validité du token JWT (utilisé par les autres microservices)
   */
  static async verifyToken(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: { user: req.user },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
