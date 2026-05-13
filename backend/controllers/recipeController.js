const Recipe = require("../models/Recipe");

// GET /api/recipes  — all recipes
const getAllRecipes = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    if (category && category !== "All") filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/recipes/:id
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/recipes/my/recipes  — recipes by logged-in user
const getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/recipes
const createRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, instructions, cookingTime, category, imageUrl } =
      req.body;
    if (!title || !description || !ingredients || !instructions)
      return res.status(400).json({ message: "Title, description, ingredients, and instructions are required" });

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      category,
      imageUrl,
      author: req.user.id,
      authorName: req.user.name,
    });
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/recipes/:id
const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to edit this recipe" });

    const updated = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/recipes/:id
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    if (recipe.author.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized to delete this recipe" });

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllRecipes, getRecipeById, getMyRecipes, createRecipe, updateRecipe, deleteRecipe };
