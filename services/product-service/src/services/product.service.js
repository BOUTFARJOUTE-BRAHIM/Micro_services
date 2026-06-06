const ProductModel = require('../models/product.model');

class ProductService {
  static async getAll(filters) {
    return await ProductModel.findAll(filters);
  }

  static async getById(id) {
    const product = await ProductModel.findById(id);
    if (!product) {
      const error = new Error('Produit non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  static async create(data) {
    return await ProductModel.create(data);
  }

  static async update(id, data) {
    const product = await ProductModel.update(id, data);
    if (!product) {
      const error = new Error('Produit non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }

  static async updateStock(id, quantity) {
    const product = await ProductModel.updateStock(id, quantity);
    if (!product) {
      const error = new Error('Stock insuffisant ou produit non trouvé');
      error.statusCode = 400;
      throw error;
    }
    return product;
  }

  static async delete(id) {
    const product = await ProductModel.delete(id);
    if (!product) {
      const error = new Error('Produit non trouvé');
      error.statusCode = 404;
      throw error;
    }
    return product;
  }
}

module.exports = ProductService;
