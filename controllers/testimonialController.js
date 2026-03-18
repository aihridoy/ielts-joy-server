const Testimonial = require("../models/testimonialModel");
const { cloudinary } = require("../utils/cloudinary");

// PUBLIC — Get approved testimonials
exports.getApproved = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ status: "approved" }).sort({
      createdAt: -1,
    });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Get all testimonials
exports.getAll = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUBLIC — Submit feedback (status: pending)
exports.submitFeedback = async (req, res) => {
  try {
    const { name, country, feedback } = req.body;
    if (!name || !country || !feedback) {
      return res
        .status(400)
        .json({ message: "Name, country and feedback are required" });
    }

    const imageUrl = req.file ? req.file.path : "";
    const imagePublicId = req.file ? req.file.filename : "";

    const testimonial = await Testimonial.create({
      name,
      country,
      feedback,
      imageUrl,
      imagePublicId,
      status: "pending",
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Add & auto-approve
exports.addByAdmin = async (req, res) => {
  try {
    const { name, country, feedback } = req.body;
    if (!name || !country || !feedback) {
      return res
        .status(400)
        .json({ message: "Name, country and feedback are required" });
    }

    const imageUrl = req.file ? req.file.path : "";
    const imagePublicId = req.file ? req.file.filename : "";

    const testimonial = await Testimonial.create({
      name,
      country,
      feedback,
      imageUrl,
      imagePublicId,
      status: "approved",
    });

    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Update status (approve/decline)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });

    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADMIN — Delete
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial)
      return res.status(404).json({ message: "Testimonial not found" });

    if (testimonial.imagePublicId) {
      await cloudinary.uploader.destroy(testimonial.imagePublicId);
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
