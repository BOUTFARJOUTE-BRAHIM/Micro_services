const pool = require('../config/db');

class OrderModel {
  /**
   * Créer une commande avec ses articles (transaction)
   */
  static async create({ userId, items, total, shippingAddress }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Créer la commande
      const orderQuery = `
        INSERT INTO orders (user_id, total, shipping_address)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const orderResult = await client.query(orderQuery, [userId, total, shippingAddress]);
      const order = orderResult.rows[0];

      // Insérer les articles
      const itemsData = [];
      for (const item of items) {
        const itemQuery = `
          INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        const itemResult = await client.query(itemQuery, [
          order.id,
          item.productId,
          item.productName,
          item.productPrice,
          item.quantity,
        ]);
        itemsData.push(itemResult.rows[0]);
      }

      await client.query('COMMIT');
      return { ...order, items: itemsData };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Trouver les commandes d'un utilisateur
   */
  static async findByUserId(userId, { page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;

    // Compter le total
    const countQuery = 'SELECT COUNT(*) FROM orders WHERE user_id = $1';
    const countResult = await pool.query(countQuery, [userId]);
    const total = parseInt(countResult.rows[0].count);

    // Récupérer les commandes
    const query = `
      SELECT * FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const result = await pool.query(query, [userId, limit, offset]);

    return {
      orders: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Trouver une commande par ID avec ses articles
   */
  static async findById(id) {
    const orderQuery = 'SELECT * FROM orders WHERE id = $1';
    const orderResult = await pool.query(orderQuery, [id]);
    const order = orderResult.rows[0];

    if (!order) return null;

    const itemsQuery = 'SELECT * FROM order_items WHERE order_id = $1';
    const itemsResult = await pool.query(itemsQuery, [id]);
    order.items = itemsResult.rows;

    return order;
  }

  /**
   * Mettre à jour le statut d'une commande
   */
  static async updateStatus(id, status) {
    const query = `
      UPDATE orders SET status = $1 WHERE id = $2 RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0] || null;
  }

  /**
   * Trouver toutes les commandes (admin)
   */
  static async findAll({ page = 1, limit = 10, status }) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) FROM orders ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    const query = `
      SELECT * FROM orders
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(limit, offset);
    const result = await pool.query(query, params);

    return {
      orders: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = OrderModel;
