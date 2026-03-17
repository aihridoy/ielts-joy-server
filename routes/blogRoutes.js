const express = require("express");
const router = express.Router();
const {
  getPublishedPosts,
  getPostById,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  togglePublish,
} = require("../controllers/blogController");
const verifyToken = require("../middleware/authMiddleware");
const { upload } = require("../utils/cloudinary");

// Public
router.get("/", getPublishedPosts);
router.get("/:id", getPostById);

// Admin
router.get("/admin/all", verifyToken, getAllPosts);
router.post("/", verifyToken, upload.single("coverImage"), createPost);
router.put("/:id", verifyToken, upload.single("coverImage"), updatePost);
router.delete("/:id", verifyToken, deletePost);
router.patch("/:id/toggle-publish", verifyToken, togglePublish);

module.exports = router;
