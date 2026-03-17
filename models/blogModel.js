const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: ["ielts-tips", "sample-essays", "vocabulary", "general"],
      default: "general",
    },
    coverImage: { type: String, default: "" },
    coverImagePublicId: { type: String, default: "" },
    author: { type: String, default: "Admin" },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);
