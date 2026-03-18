const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    feedback: { type: String, required: true, trim: true, maxlength: 500 },
    imageUrl: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
