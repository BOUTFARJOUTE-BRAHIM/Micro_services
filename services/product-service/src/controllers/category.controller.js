const CategoryService = require('../services/category.service');

class CategoryController {
  static async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAll();
      res.json({ success: true, data: { categories } });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const category = await CategoryService.getById(req.params.id);
      res.json({ success: true, data: { category } });
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const category = await CategoryService.create({ name, description });
      res.status(201).json({
        success: true,
        message: 'Catégorie créée',
        data: { category },
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req, res, next) {
    try {
      const { name, description } = req.body;
      const category = await CategoryService.update(req.params.id, { name, description });
      res.json({
        success: true,
        message: 'Catégorie mise à jour',
        data: { category },
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req, res, next) {
    try {
      await CategoryService.delete(req.params.id);
      res.json({ success: true, message: 'Catégorie supprimée' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
