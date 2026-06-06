const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';

/**
 * Middleware d'authentification via le auth-service
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'authentification requis',
      });
    }

    const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      headers: { Authorization: authHeader },
    });

    req.user = response.data.data.user;
    next();
  } catch (err) {
    if (err.response) {
      return res.status(err.response.status).json({
        success: false,
        message: err.response.data.message || 'Authentification échouée',
      });
    }
    return res.status(503).json({
      success: false,
      message: 'Service d\'authentification indisponible',
    });
  }
};

/**
 * Middleware d'autorisation par rôle
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé',
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
