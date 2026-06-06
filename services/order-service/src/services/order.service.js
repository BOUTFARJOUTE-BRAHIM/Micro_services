const axios = require('axios');
const OrderModel = require('../models/order.model');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4002';

class OrderService {
  /**
   * Créer une commande
   * Vérifie la disponibilité des produits via le product-service,
   * puis décrémente le stock de chaque produit
   */
  static async create({ userId, items, shippingAddress }) {
    // 1. Vérifier chaque produit et calculer le total
    const validatedItems = [];
    let total = 0;

    for (const item of items) {
      try {
        // Récupérer le produit depuis le product-service
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/${item.productId}`);
        const product = response.data.data.product;

        // Vérifier le stock
        if (product.stock < item.quantity) {
          const error = new Error(`Stock insuffisant pour "${product.name}". Disponible: ${product.stock}, demandé: ${item.quantity}`);
          error.statusCode = 400;
          throw error;
        }

        const itemTotal = parseFloat(product.price) * item.quantity;
        total += itemTotal;

        validatedItems.push({
          productId: product.id,
          productName: product.name,
          productPrice: parseFloat(product.price),
          quantity: item.quantity,
        });
      } catch (err) {
        if (err.statusCode) throw err;
        if (err.response && err.response.status === 404) {
          const error = new Error(`Produit ${item.productId} non trouvé`);
          error.statusCode = 404;
          throw error;
        }
        const error = new Error('Service produit indisponible');
        error.statusCode = 503;
        throw error;
      }
    }

    // 2. Créer la commande en base
    const order = await OrderModel.create({
      userId,
      items: validatedItems,
      total: total.toFixed(2),
      shippingAddress,
    });

    // 3. Décrémenter le stock de chaque produit
    for (const item of validatedItems) {
      try {
        await axios.patch(`${PRODUCT_SERVICE_URL}/api/products/${item.productId}/stock`, {
          quantity: -item.quantity,
        });
      } catch (err) {
        console.error(`⚠️ Erreur lors de la mise à jour du stock pour ${item.productId}:`, err.message);
        // La commande est déjà créée, on log l'erreur mais on ne l'annule pas
      }
    }

    return order;
  }

  /**
   * Récupérer les commandes d'un utilisateur
   */
  static async getUserOrders(userId, filters) {
    return await OrderModel.findByUserId(userId, filters);
  }

  /**
   * Récupérer le détail d'une commande
   */
  static async getById(orderId, userId, isAdmin = false) {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      const error = new Error('Commande non trouvée');
      error.statusCode = 404;
      throw error;
    }

    // Vérifier que l'utilisateur est bien le propriétaire (sauf admin)
    if (!isAdmin && order.user_id !== userId) {
      const error = new Error('Accès non autorisé à cette commande');
      error.statusCode = 403;
      throw error;
    }

    return order;
  }

  /**
   * Mettre à jour le statut d'une commande (admin)
   */
  static async updateStatus(orderId, status) {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      const error = new Error(`Statut invalide. Valeurs acceptées: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }

    const order = await OrderModel.updateStatus(orderId, status);
    if (!order) {
      const error = new Error('Commande non trouvée');
      error.statusCode = 404;
      throw error;
    }

    return order;
  }

  /**
   * Récupérer toutes les commandes (admin)
   */
  static async getAll(filters) {
    return await OrderModel.findAll(filters);
  }
}

module.exports = OrderService;
