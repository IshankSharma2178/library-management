const Category = require('../models/Category');
const Book = require('../models/Book');

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    const category = new Category({ name, description });
    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const bookCount = await Book.countDocuments({ category: cat.name });
        return {
          _id: cat._id,
          name: cat.name,
          description: cat.description,
          createdAt: cat.createdAt,
          bookCount
        };
      })
    );

    res.json(categoriesWithCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    const bookCount = await Book.countDocuments({ category: category.name });
    if (bookCount > 0) {
      return res.status(400).json({ msg: `Cannot delete category. ${bookCount} books are using this category.` });
    }

    await Category.findByIdAndDelete(id);
    res.json({ msg: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: id }
    });
    if (existing) {
      return res.status(400).json({ msg: 'Category name already exists' });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ msg: 'Category not found' });
    }

    if (name) {
      await Book.updateMany(
        { category: { $regex: new RegExp(`^${name}$`, 'i') } },
        { $set: { category: name } }
      );
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
