const pool = require('../config/db');

class CategoryModel {
  static async findAll() {
    const query = 'SELECT * FROM categories ORDER BY name ASC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM categories WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async create({ name, description }) {
    const query = `
      INSERT INTO categories (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await pool.query(query, [name, description]);
    return result.rows[0];
  }

  static async update(id, { name, description }) {
    const query = `
      UPDATE categories
      SET name = COALESCE($1, name),
          description = COALESCE($2, description)
      WHERE id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, id]);
    return result.rows[0] || null;
  }

  static async delete(id) {
    const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}

module.exports = CategoryModel;
