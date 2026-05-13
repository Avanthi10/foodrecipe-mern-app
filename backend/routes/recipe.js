const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  getMyRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipeController");
const { protect } = require("../middleware/auth");
const { upload, cloudinary } = require("../config/cloudinary");

// Image upload route
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file received" })
    }

    console.log("File received:", req.file.originalname, req.file.mimetype, req.file.size)
    console.log("Uploading to Cloudinary...")

    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
    const result = await cloudinary.uploader.upload(fileStr, {
      folder: "foodrecipe-app",
      resource_type: "auto"
    })

    console.log("Cloudinary success:", result.secure_url)
    res.json({ imageUrl: result.secure_url })
  } catch (err) {
    console.error("Cloudinary upload error FULL:", JSON.stringify(err))
    res.status(500).json({ message: err.message })
  }
});

router.get("/", getAllRecipes);
router.get("/my/recipes", protect, getMyRecipes);
router.get("/:id", getRecipeById);
router.post("/", protect, createRecipe);
router.put("/:id", protect, updateRecipe);
router.delete("/:id", protect, deleteRecipe);

module.exports = router;