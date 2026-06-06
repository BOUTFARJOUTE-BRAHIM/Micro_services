const pool = require('../config/db');

class UserModel {
  /**
   * Créer un nouvel utilisateur
   */
  static async create({ email, passwordHash, firstName, lastName, role = 'user' }) {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, role, created_at, updated_at
    `;
    const values = [email, passwordHash, firstName, lastName, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Trouver un utilisateur par email
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  /**
   * Trouver un utilisateur par ID
   */
  static async findById(id) {
    const query = `
      SELECT id, email, first_name, last_name, role, created_at, updated_at
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async update(id, { firstName, lastName, email }) {
    const query = `
      UPDATE users
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          email = COALESCE($3, email)
      WHERE id = $4
      RETURNING id, email, first_name, last_name, role, created_at, updated_at
    `;
    const values = [firstName, lastName, email, id];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Mettre à jour le mot de passe
   */
  static async updatePassword(id, passwordHash) {
    const query = 'UPDATE users SET password_hash = $1 WHERE id = $2';
    await pool.query(query, [passwordHash, id]);
  }
}

module.exports = UserModel;
