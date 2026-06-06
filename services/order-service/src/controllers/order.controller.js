const OrderService = require('../services/order.service');

class OrderController {
  /**
   * POST /api/orders — Créer une commande
   */
  static async create(req, res, next) {
    try {
      const { items, shippingAddress } = req.body;
      const order = await OrderService.create({
        userId: req.user.id,
        items,
        shippingAddress,
      });

      res.status(201).json({
        success: true,
        message: 'Commande créée avec succès',
        data: { order },
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/orders — Historique des commandes de l'utilisateur
   */
  static async getUserOrders(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await OrderService.getUserOrders(req.user.id, {
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
      });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/orders/all — Toutes les commandes (admin)
   */
  static async getAll(req, res, next) {
    try {
      const { page, limit, status } = req.query;
      const result = await OrderService.getAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10,
        status,
      });

      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/orders/:id — Détail d'une commande
   */
  static async getById(req, res, next) {
    try {
      const isAdmin = req.user.role === 'admin';
      const order = await OrderService.getById(req.params.id, req.user.id, isAdmin);

      res.json({ success: true, data: { order } });
    } catch (err) {
      next(err);
    }
  }

  /**
   * PATCH /api/orders/:id/status — Changer le statut (admin)
   */
  static async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const order = await OrderService.updateStatus(req.params.id, status);

      res.json({
        success: true,
        message: `Statut mis à jour: ${status}`,
        data: { order },
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderController;
