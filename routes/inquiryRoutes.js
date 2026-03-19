const express = require("express");
const router = express.Router();
const {
  submitInquiry,
  getAllInquiries,
  updateStatus,
  deleteInquiry,
} = require("../controllers/inquiryController");
const verifyToken = require("../middleware/authMiddleware");

// Public
router.post("/", submitInquiry);

// Admin
router.get("/", verifyToken, getAllInquiries);
router.patch("/:id/status", verifyToken, updateStatus);
router.delete("/:id", verifyToken, deleteInquiry);

module.exports = router;
