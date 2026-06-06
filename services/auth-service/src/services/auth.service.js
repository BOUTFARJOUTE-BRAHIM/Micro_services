const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const SALT_ROUNDS = 10;

class AuthService {
  /**
   * Inscription d'un nouvel utilisateur
   */
  static async register({ email, password, firstName, lastName }) {
    // Vérifier si l'email existe déjà
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      const error = new Error('Cet email est déjà utilisé');
      error.statusCode = 409;
      throw error;
    }

    // Hasher le mot de passe
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Créer l'utilisateur
    const user = await UserModel.create({
      email,
      passwordHash,
      firstName,
      lastName,
    });

    // Générer le token JWT
    const token = this.generateToken(user);

    return { user, token };
  }

  /**
   * Connexion d'un utilisateur
   */
  static async login({ email, password }) {
    // Trouver l'utilisateur
    const user = await UserModel.findByEmail(email);
    if (!user) {
      const error = new Error('Email ou mot de passe incorrect');
      error.statusCode = 401;
      throw error;
    }

    // Vérifier le mot de passe
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      const error = new Error('Email ou mot de passe incorrect');
      error.statusCode = 401;
      throw error;
    }

    // Générer le token JWT
    const token = this.generateToken(user);

    // Retourner sans le password_hash
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  /**
   * Récupérer le profil utilisateur
   */
  static async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  static async updateProfile(userId, updateData) {
    // Si l'email change, vérifier qu'il n'est pas déjà pris
    if (updateData.email) {
      const existingUser = await UserModel.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== userId) {
        const error = new Error('Cet email est déjà utilisé');
        error.statusCode = 409;
        throw error;
      }
    }

    const user = await UserModel.update(userId, updateData);
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }

  /**
   * Vérifier et décoder un token JWT
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const error = new Error('Token invalide ou expiré');
      error.statusCode = 401;
      throw error;
    }
  }

  /**
   * Générer un token JWT
   */
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }
}

module.exports = AuthService;
