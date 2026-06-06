const CategoryModel = require('../models/category.model');

class CategoryService {
  static async getAll() {
    return await CategoryModel.findAll();
  }

  static async getById(id) {
    const category = await CategoryModel.findById(id);
    if (!category) {
      const error = new Error('Catégorie non trouvée');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  static async create(data) {
    try {
      return await CategoryModel.create(data);
    } catch (err) {
      if (err.code === '23505') {
        const error = new Error('Une catégorie avec ce nom existe déjà');
        error.statusCode = 409;
        throw error;
      }
      throw err;
    }
  }

  static async update(id, data) {
    const category = await CategoryModel.update(id, data);
    if (!category) {
      const error = new Error('Catégorie non trouvée');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }

  static async delete(id) {
    const category = await CategoryModel.delete(id);
    if (!category) {
      const error = new Error('Catégorie non trouvée');
      error.statusCode = 404;
      throw error;
    }
    return category;
  }
}

module.exports = CategoryService;
