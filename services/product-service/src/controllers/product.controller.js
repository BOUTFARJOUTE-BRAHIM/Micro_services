const ProductService = require('../services/product.service');

class ProductController {
  static async getAll(req, res, next) {
    try {
      const { page, limit, category, search, minPrice, maxPrice, sortBy, sortOrder } = req.query;
      const result = await ProductService.getAll({
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 12,
        category,
        search,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sortBy,
        sortOrder,
      });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const product = await ProductService.getById(req.params.id);
      res.json({ success: true, data: { product } });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, description, price, stock, categoryId, imageUrl } = req.body;
      const product = await ProductService.create({
        name,
        description,
        price,
        stock,
        categoryId,
        imageUrl,
      });
      res.status(201).json({
        success: true,
        message: 'Produit créé',
        data: { product },
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { name, description, price, stock, categoryId, imageUrl, isActive } = req.body;
      const product = await ProductService.update(req.params.id, {
        name,
        description,
        price,
        stock,
        categoryId,
        imageUrl,
        isActive,
      });
      res.json({
        success: true,
        message: 'Produit mis à jour',
        data: { product },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStock(req, res, next) {
    try {
      const { quantity } = req.body;
      const product = await ProductService.updateStock(req.params.id, quantity);
      res.json({
        success: true,
        message: 'Stock mis à jour',
        data: { product },
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await ProductService.delete(req.params.id);
      res.json({ success: true, message: 'Produit supprimé' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProductController;
