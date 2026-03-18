const express = require("express");
const router = express.Router();
const {
  getApproved,
  getAll,
  submitFeedback,
  addByAdmin,
  updateStatus,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const verifyToken = require("../middleware/authMiddleware");
const { upload } = require("../utils/cloudinary");

// Public
router.get("/", getApproved);
router.post("/", upload.single("image"), submitFeedback);

// Admin
router.get("/admin/all", verifyToken, getAll);
router.post("/admin", verifyToken, upload.single("image"), addByAdmin);
router.patch("/:id/status", verifyToken, updateStatus);
router.delete("/:id", verifyToken, deleteTestimonial);

module.exports = router;
