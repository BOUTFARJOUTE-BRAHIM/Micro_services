const pool = require('../config/db');

class ProductModel {
  /**
   * Trouver tous les produits avec pagination, filtrage et recherche
   */
  static async findAll({ page = 1, limit = 12, category, search, minPrice, maxPrice, sortBy = 'created_at', sortOrder = 'DESC' }) {
    const offset = (page - 1) * limit;
    const conditions = ['p.is_active = true'];
    const params = [];
    let paramIndex = 1;

    if (category) {
      conditions.push(`p.category_id = $${paramIndex++}`);
      params.push(category);
    }

    if (search) {
      conditions.push(`(
        p.name ILIKE $${paramIndex} OR
        p.description ILIKE $${paramIndex}
      )`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (minPrice) {
      conditions.push(`p.price >= $${paramIndex++}`);
      params.push(minPrice);
    }

    if (maxPrice) {
      conditions.push(`p.price <= $${paramIndex++}`);
      params.push(maxPrice);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sécuriser les colonnes de tri
    const allowedSortColumns = ['name', 'price', 'created_at', 'stock'];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const safeSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Compter le total
    const countQuery = `SELECT COUNT(*) FROM products p ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count);

    // Récupérer les produits
    const query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.${safeSortBy} ${safeSortOrder}
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    return {
      products: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async findById(id) {
    const query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create({ name, description, price, stock, categoryId, imageUrl }) {
    const query = `
      INSERT INTO products (name, description, price, stock, category_id, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, price, stock, categoryId, imageUrl]);
    return result.rows[0];
  }

  static async update(id, { name, description, price, stock, categoryId, imageUrl, isActive }) {
    const query = `
      UPDATE products
      SET name = COALESCE($1, name),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          stock = COALESCE($4, stock),
          category_id = COALESCE($5, category_id),
          image_url = COALESCE($6, image_url),
          is_active = COALESCE($7, is_active)
      WHERE id = $8
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, price, stock, categoryId, imageUrl, isActive, id]);
    return result.rows[0] || null;
  }

  static async updateStock(id, quantity) {
    const query = `
      UPDATE products
      SET stock = stock + $1
      WHERE id = $2 AND stock + $1 >= 0
      RETURNING *
    `;
    const result = await pool.query(query, [quantity, id]);
    return result.rows[0] || null;
  }

  static async delete(id) {
    // Soft delete — désactiver le produit
    const query = `
      UPDATE products SET is_active = false WHERE id = $1 RETURNING *
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = ProductModel;
