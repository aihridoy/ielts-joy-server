const Inquiry = require("../models/inquiryModel");

// PUBLIC — Submit inquiry
exports.submitInquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const inquiry = await Inquiry.create({ name, email, phone, message });
    res
      .status(201)
      .json({ message: "Inquiry submitted successfully", inquiry });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Get all inquiries
exports.getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Update status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "contacted", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Delete inquiry
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: "Inquiry not found" });

    await Inquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
