const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/connectionDb");

dotenv.config();

console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME)  // ← add this line

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDb();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/recipes", require("./routes/recipe"));
app.use("/api/users", require("./routes/user"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "🍽️ Food Recipe API is running!" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});